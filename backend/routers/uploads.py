import numpy as np
import secrets
import xlsxwriter
import string
from datetime import date, datetime
from uuid import UUID
from fastapi import Body, Query, APIRouter, File, Form, status, Depends, HTTPException, UploadFile
from backend.database import get_db
from sqlalchemy.orm import Session, joinedload
from backend.oauth2 import get_current_user
from backend import models, utils
from typing import Annotated, List, Optional
from starlette import status
from backend.schemas import UserResponse
from backend import models
import cloudinary.uploader
import pandas as pd
import os


from fastapi.responses import JSONResponse, FileResponse

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet


router = APIRouter()
user_dependency = Annotated[dict, Depends(get_current_user)]

def validate_columns(df, expected_columns):
    if not set(expected_columns).issubset(df.columns):
        missing_columns = list(set(expected_columns) - set(df.columns))
        raise HTTPException(status_code=400, detail=f"Invalid file format as there are missing or extra columns: {missing_columns}")

def process_post_grad_act(value):
    allowed_activities = ['PersonalResponsibilities', 'Career Transition', 'Volunteering', 'Travel', 'Freelancing', 'Internship', 'Education', 'Employment']
    result = [activity for activity in value if activity.title() in allowed_activities]

    return result


def process_data(df):
    
    # Create a password with random letters 
    alphabet = string.ascii_letters + string.digits
    df['password'] = [utils.hash_password(''.join(secrets.choice(alphabet) for _ in range(10))) for _ in range(len(df))]

    # Clean the data: trim leading/trailing whitespace
    df = df.apply(lambda col: col.str.strip() if col.dtype == 'object' else col)

    # Remove duplicate entries based on must-be-unique columns
    df.drop_duplicates(subset=['username', 'student_number', 'email'], keep='first', inplace=True)

    # Convert date columns to datetime objects
    date_columns = ['birthdate', 'date_graduated', 'date_start']
    for col in date_columns:
        date_format = "%Y-%m-%d"  # Adjust the format according to your actual date format
        df[col] = pd.to_datetime(df[col], errors='coerce', format=date_format)

    # Convert date columns to object type and then set NaT values to None
    for col in date_columns:
        df[col] = df[col].astype(object).where(pd.notna(df[col]), None)

   
    # Convert boolean columns to boolean type
    bool_columns = ['is_international', 'origin_is_international']
    affirmative_words = ['yes', 'true', '1', 'positive', 'affirmative', 'confirmed', 'agree', 'correct', 'valid', 'good', 'okay', 'fine', 'accepted', 'right', 'aye', 'indeed', 'certain', 'omsim', 'tama', 'oo', 'oo na', 'totoo', 'ootot', 'pak', 'labyugab']  

    for col in bool_columns:
        df[col] = df[col].apply(lambda x: str(x).lower() in affirmative_words)

    # Convert array columns to array type
    df['post_grad_act'] = df['post_grad_act'].apply(lambda x: process_post_grad_act(x.split(',')) if isinstance(x, str) else [])

    # Convert all other columns to string type
    other_columns = ['student_number', 'username', 'first_name', 'last_name', 'email', 'gender', 'role', 'civil_status', 'headline', 'present_employment_status', 'country', 'region', 'city', 'barangay', 'origin_country', 'origin_region', 'origin_city', 'origin_barangay', 'course', 'mobile_number', 'telephone_number']
    for col in other_columns:
        df[col] = df[col].astype(str)


    return df


@router.get("/profiles/all")
async def get_demographic_profile(
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    user_data = db.query(models.User).all()
    profiles = []
    for user_profile in user_data:
        profile_dict = {
            "id": user_profile.id,
            "student_number": user_profile.student_number,
            "username": user_profile.username,
            "first_name": user_profile.first_name,
            "last_name": user_profile.last_name,
            "email": user_profile.email,
            "gender": user_profile.gender,
            "role": user_profile.role,
            "birthdate": user_profile.birthdate,
            "mobile_number": user_profile.mobile_number,
            "telephone_number": user_profile.telephone_number,
            "headline": user_profile.headline,
            "civil_status": user_profile.civil_status,          
            #pupqc educational bg
            "date_graduated": user_profile.date_graduated,          
            "course": user_profile.course.name if user_profile.course else '',          
            #address
            "is_international": user_profile.is_international,
            "country": user_profile.country,
            "region": user_profile.region,
            "city": user_profile.city,
            "barangay": user_profile.barangay,
            "address": user_profile.address,
            #home town
            "origin_is_international": user_profile.origin_is_international,
            "origin_country": user_profile.origin_country,
            "origin_region": user_profile.origin_region,
            "origin_city": user_profile.origin_city,
            "origin_barangay": user_profile.origin_barangay,
            "origin_address": user_profile.origin_address,
        }
        profiles.append(profile_dict)
    db.close() 
    # Close the database session
    return {"length": len(profiles), "profiles": profiles}

@router.post("/upload_demo_profile/")
async def file_upload(file: UploadFile = File(...), db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    responses = []
    elements = []
    styleSheet = getSampleStyleSheet()

    if user.role not in ["admin", "officer"]:
        raise HTTPException(status_code=401, detail="Unauthorized: Access Denied")

    if file.filename.endswith('.csv'):
        df = pd.read_csv(file.file, encoding='ISO-8859-1')
    elif file.filename.endswith('.xlsx'):
        df = pd.read_excel(file.file, engine='openpyxl')
    else:
        raise HTTPException(status_code=400, detail="Upload failed: The file format is not supported.")
    
    expected_columns = ['student_number','username','first_name','last_name','email','gender','role','birthdate','mobile_number','telephone_number','headline','civil_status','date_graduated','course','is_international','country','region','city','barangay','origin_is_international','origin_country','origin_region','origin_city','origin_barangay', 'post_grad_act', 'present_employment_status', 'date_start']
    
    validate_columns(df, expected_columns)

    # Process the data
    df = process_data(df)

    existing_studnums = {alumni.student_number for alumni in db.query(models.User).all()}
    existing_emails = {alumni.email for alumni in db.query(models.User).all()}
    existing_username = {alumni.username for alumni in db.query(models.User).all()}

    # Insert the data into the database
    inserted = []
    not_inserted = []  # List to store alumni that did not inserted
    incomplete_column = []


    try:
        for _, row in df.iterrows():

            if row['student_number'] in existing_studnums or row['email'] in existing_emails or row['username'] in existing_username:
                not_inserted.append(row)
            elif pd.isnull(row['username']):
                # Apply the custom function to the 'username' column
                row['username'] = row['lastname'] + str(np.random.randint(1000, 9999))
            elif pd.isnull(row['email']) :
                incomplete_column.append(row)
            else:
                # Check if the course exists
                actual_course = db.query(models.Course).filter(models.Course.name == row['course'].lower()).first()

                # If not, create a new course
                if not actual_course:
                    actual_course = models.Course(
                        name=row['course'],
                    )
                    # Add to the session
                    db.add(actual_course)
                    db.commit()
                    db.refresh(actual_course)

                # Update the row with the course instance and course_id
                row['course'] = actual_course
                row['course_id'] = actual_course.id

                # Create the new user
                new_user = models.User(**row.to_dict())
                db.add(new_user)
                inserted.append(row)

        db.commit()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Upload failed.")


    try:
        # Prepare the data for the report
        data = [inserted, not_inserted, incomplete_column]
        titles = ["Inserted", "Not Inserted", "Incomplete"]

        # Create a Pandas Excel writer using XlsxWriter as the engine
        now = datetime.now()
        xlsx_name = f"Report_{now.strftime('%Y%m%d_%H%M%S')}.xlsx"
        writer = pd.ExcelWriter(xlsx_name, engine='xlsxwriter')

        for idx, title in enumerate(titles):
            # Convert the data to a DataFrame and write it to the Excel file
            df = pd.DataFrame(data[idx])
            df.to_excel(writer, sheet_name=title, index=False)

        # Close the Pandas Excel writer and output the Excel file
        writer.close()

        # Upload the xlsx file to cloudinary
        upload_result = cloudinary.uploader.upload(xlsx_name, 
                                                resource_type = "raw", 
                                                public_id = f"InsertData/Reports/{xlsx_name}",
                                                tags=[xlsx_name])
        
        # Delete the local file
        os.remove(xlsx_name)

        user_instance = db.query(models.User).filter(models.User.id == user.id).first()

        # Create new UploadHistory instance
        new_upload_history = models.UploadHistory(
            type="Profile",
            link=upload_result['url'],
            user_id=user.id,
            user=user_instance
        )
        db.add(new_upload_history)
        db.commit()


    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while generating the report: {str(e)}")
