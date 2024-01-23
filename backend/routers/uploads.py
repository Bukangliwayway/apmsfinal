import random
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
from backend.routers.profiles import afterEmploymentPostRoutine, isProfileCompleted
from backend import models
import cloudinary.uploader
import pandas as pd
from fuzzywuzzy import process 

import os


from fastapi.responses import JSONResponse, FileResponse

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet


router = APIRouter()
user_dependency = Annotated[dict, Depends(get_current_user)]

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

@router.get("/educations/all")
async def get_education_profile(
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    education_data = db.query(models.Education).all()
    educations = []
    for education_profile in education_data:
        employment_dict = {
            "id": education_profile.id,
            "user_id": education_profile.user.id if education_profile.user and education_profile.user.id else '',
            "username": education_profile.user.username if education_profile.user and education_profile.user.username else '',
            "course": education_profile.course.name if education_profile.course and education_profile.course.name else '',
            "level": education_profile.level,
            "school_name": education_profile.school_name,
            "story": education_profile.story,
            "is_international": education_profile.is_international,
            "country": education_profile.country,
            "region": education_profile.region,
            "city": education_profile.city,
            "date_start": education_profile.date_start,
            "date_graduated": education_profile.date_graduated,          
        }
        educations.append(employment_dict)
    db.close() 
    # Close the database session
    return {"length": len(educations), "educations": educations}

@router.get("/employments/all")
async def get_employment_profile(
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    employment_data = db.query(models.Employment).all()
    employments = []
    for employment_profile in employment_data:
        employment_dict = {
            "id": employment_profile.id,
            "user_id": employment_profile.user.id if employment_profile.user and employment_profile.user.id else '',
            "username": employment_profile.user.username if employment_profile.user and employment_profile.user.username else '',
            "job": employment_profile.job.name if employment_profile.job and employment_profile.job.name else '',
            "company_name": employment_profile.company_name,
            "date_hired": employment_profile.date_hired,
            "date_end": employment_profile.date_end,
            "gross_monthly_income": employment_profile.gross_monthly_income,
            "employment_contract": employment_profile.employment_contract,
            "job_position": employment_profile.job_position,
            "employer_type": employment_profile.employer_type,
            "is_international": employment_profile.is_international,
            "country": employment_profile.country,          
            "region": employment_profile.region,          
            "city": employment_profile.city,          
        }
        employments.append(employment_dict)
    db.close() 
    # Close the database session
    return {"length": len(employments), "employments": employments}

@router.get("/achievements/all")
async def get_achievement_profile(
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    achievements_data = db.query(models.Achievement).all()
    achievements = []
    for achievements_profile in achievements_data:
        achievement_dict = {
            "id": achievements_profile.id,
            "user_id": achievements_profile.user.id if achievements_profile.user and achievements_profile.user.id else '',
            "username": achievements_profile.user.username if achievements_profile.user and achievements_profile.user.username else '',
            "type_of_achievement": achievements_profile.type_of_achievement,
            "date_of_attainment": achievements_profile.date_of_attainment,
            "description": achievements_profile.description,
            "story": achievements_profile.story,
            "link_reference": achievements_profile.link_reference,   
        }
        achievements.append(achievement_dict)
    db.close() 
    # Close the database session
    return {"length": len(achievements), "achievements": achievements}

@router.get("/all")        
async def read_users(db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)):
    users = db.query(models.User).options(joinedload(models.User.employment)).all()
    result = []
    exclude_user_keys = ['password', '_sa_instance_state', 'employment', 'id', 'city_code', 'origin_region_code', 'created_at', 'updated_at', 'deleted_at', 'origin_city_code', 'barangay_code', 'origin_barangay_code', 'sub', 'region_code', 'job']
    exclude_employment_keys = ['job_id', 'user_id', '_sa_instance_state', 'city_code', 'region_code', 'id', 'city_code', 'region_code', 'created_at', 'updated_at', 'job']
   
    id_counter = 0
    for user in users:
        user_dict = {key: value for key, value in user.__dict__.items() if key not in exclude_user_keys}
        user_course_classification_ids = None
        if user.course and user.course.classifications:
            user_course_classification_ids = {classification.id for classification in user.course.classifications}

        # If the user has no employment history
        if not user.employment:
            job_name = ''
            aligned_with_academic_program = False
            employment_dict = {key: None for key in models.Employment.__dict__ if key not in exclude_employment_keys}
            result.append({'id': id_counter, 'aligned_with_academic_program': aligned_with_academic_program, 'job_name': job_name, **user_dict, **employment_dict})
            id_counter += 1
        else:
            job_classification_ids = None

            for employment in user.employment:
                job_name = employment.job.name if employment.job and employment.job.name else ''

                # Check if employment.job is not None and it has classifications
                if employment.job and employment.job.classifications:
                    job_classification_ids = {classification.id for classification in employment.job.classifications}
                
                # Check if user_course_classification_ids and job_classification_ids are not None before performing the bitwise AND operation
                if user_course_classification_ids is not None and job_classification_ids is not None:
                    aligned_with_academic_program = bool(user_course_classification_ids & job_classification_ids)
                else:
                    aligned_with_academic_program = False
                
                employment_dict = {key: value for key, value in employment.__dict__.items() if key not in exclude_employment_keys}
                result.append({'id': id_counter, 'aligned_with_academic_program': aligned_with_academic_program, 'job_name': job_name, **user_dict, **employment_dict})

                id_counter += 1
    return result
   
@router.get("/unclaimed/all")
async def get_unclaimed_profile(
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    unclaimed_profiles = db.query(models.User).filter_by(role="unclaimed").all()
    unclaimed = []
    index = 0
    for unclaimed_profile in unclaimed_profiles:
        index += 1
        unclaimed_dict = {
            "id": index,
            "last_name": unclaimed_profile.last_name,
            "first_name": unclaimed_profile.first_name,
            "birthdate": unclaimed_profile.birthdate,
            "student_number": unclaimed_profile.student_number,
            "date_graduated": unclaimed_profile.date_graduated,
            "course": unclaimed_profile.course.name if unclaimed_profile.course and unclaimed_profile.course.name else '',
        }
        unclaimed.append(unclaimed_dict)
    db.close() 
    # Close the database session
    return unclaimed

def validate_columns(df, expected_columns):
    if not set(expected_columns).issubset(df.columns):
        missing_columns = list(set(expected_columns) - set(df.columns))
        raise HTTPException(status_code=400, detail=f"Invalid file format as there are missing or extra columns: {missing_columns}")

def process_post_grad_act(values):
    allowed_activities = ['PersonalResponsibilities', 'Career Transition', 'Volunteering', 'Travel', 'Freelancing', 'Internship', 'Education', 'Employment']
    return [process.extractOne(value.strip().lower(), allowed_activities)[0] for value in values if process.extractOne(value.strip().lower(), allowed_activities)[1] >= 80]

def process_unemployment_reason(values):
    allowed_reasons = ['demand-deficient unemployment', 'advances in technology', 'job outsourcing', 'voluntary', 'relocation', 'new force', 'reenter force']
    return [process.extractOne(value.strip().lower(), allowed_reasons)[0] for value in values if process.extractOne(value.strip().lower(), allowed_reasons)[1] >= 80]

def process_profile_data(df):
    # Clean the data: trim leading/trailing whitespace
    df = df.apply(lambda col: col.str.strip() if isinstance(col, str) else col)

    # Clean Unique Columns First
    df['email'] = df['email'].str.strip().str.lower()
    df['student_number'] = df['student_number'].str.strip().str.upper()

    # Drop duplicates based on 'student_number'
    df.drop_duplicates(subset=['student_number'], keep='first', inplace=True)

    # Drop duplicates based on 'email'
    df.drop_duplicates(subset=['email'], keep='first', inplace=True)

    # Process 'batch_year' column and save as integer
    df['batch_year'] = pd.to_numeric(df['batch_year'], errors='coerce', downcast='integer')

    # Convert date columns to datetime objects
    date_columns = ['birthdate', 'date_graduated']

    # Check if 'date_graduated' is just a year and modify it
    df['date_graduated'] = df['date_graduated'].astype(str)

    # Define a function to modify the date
    def modify_date(date):
        if len(date) == 4:  # If the date is a year
            return date + '-09-01'  # Append '-09-01'
        else:  # If the date is not a year
            return date  # Return the date as is

    # Apply the function to the 'date_graduated' column
    df['date_graduated'] = df['date_graduated'].apply(modify_date)
    
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

    specific_columns = {
        'gender': ['male', 'female', 'lgbtqia+'],
        'civil_status': ['single', 'married', 'divorced', 'widowed'],
        'present_employment_status': ['employed', 'self-employed', 'never been employed', 'unable to work', 'unemployed'],
    }

    for col, valid_values in specific_columns.items():
        df[col] = df[col].apply(lambda x: process.extractOne(str(x).lower(), valid_values)[0].capitalize())

    # Convert array columns to array type
    df['post_grad_act'] = df['post_grad_act'].apply(lambda x: process_post_grad_act(x.split(',')) if isinstance(x, str) else [])
    df['unemployment_reason'] = df['unemployment_reason'].apply(lambda x: process_unemployment_reason(x.split(',')) if isinstance(x, str) else [])

    # Convert all other columns to string type
    other_columns = ['student_number', 'first_name', 'last_name', 'email', 'gender', 'civil_status', 'headline', 'present_employment_status', 'country', 'region', 'city', 'barangay', 'origin_country', 'origin_region', 'origin_city', 'origin_barangay', 'course_code', 'mobile_number', 'telephone_number']
    for col in other_columns:
        df[col] = df[col].astype(str)

    return df

def process_education_data(df):

    # Clean the data: trim leading/trailing whitespace
    df = df.apply(lambda col: col.str.strip() if isinstance(col, str) else col)

    # Convert date columns to datetime objects
    date_columns = ['date_graduated', 'date_start']

    # Check if 'date_graduated' is just a year and modify it
    df['date_graduated'] = df['date_graduated'].astype(str)
    mask = df['date_graduated'].notna()
    df.loc[mask, 'date_graduated'] = df.loc[mask, 'date_graduated'] + '-09-01'

    # Check if 'date_start' is just a year and modify it
    df.loc[df['date_start'].str.len() == 4, 'date_start'] = df['date_start'] + '-09-01'

    for col in date_columns:
        date_format = "%Y-%m-%d"  # Adjust the format according to your actual date format
        df[col] = pd.to_datetime(df[col], errors='coerce', format=date_format)

    # Convert date columns to object type and then set NaT values to None
    for col in date_columns:
        df[col] = df[col].astype(object).where(pd.notna(df[col]), None)

    # Convert boolean columns to boolean type
    bool_columns = ['is_international']
    affirmative_words = ['yes', 'true', '1', 'positive', 'affirmative', 'confirmed', 'agree', 'correct', 'valid', 'good', 'okay', 'fine', 'accepted', 'right', 'aye', 'indeed', 'certain', 'omsim', 'tama', 'oo', 'oo na', 'totoo', 'ootot', 'pak', 'labyugab']  

    for col in bool_columns:
        df[col] = df[col].apply(lambda x: str(x).lower() in affirmative_words)


    # Convert all other columns to string type
    other_columns = ['student_number', 'course', 'level', 'school_name', 'story', 'country', 'region', 'city']
    for col in other_columns:
        df[col] = df[col].astype(str)

    return df

def process_achievement_data(df)    :

    # Clean the data: trim leading/trailing whitespace
    df = df.apply(lambda col: col.str.strip() if isinstance(col, str) else col)



    # Convert date columns to datetime objects
    date_columns = ['date_of_attainment']
    for col in date_columns:
        date_format = "%Y-%m-%d"  # Adjust the format according to your actual date format
        df[col] = pd.to_datetime(df[col], errors='coerce', format=date_format)

    # Convert date columns to object type and then set NaT values to None
    for col in date_columns:
        df[col] = df[col].astype(object).where(pd.notna(df[col]), None)

    # Convert all other columns to string type
    other_columns = ['student_number', 'description', 'story', 'link_reference', 'type_of_achievement']
    for col in other_columns:
        df[col] = df[col].astype(str)

    return df

def process_employment_data(df):

    # Clean the data: trim leading/trailing whitespace
    df = df.apply(lambda col: col.str.strip() if isinstance(col, str) else col)

    # Convert date columns to datetime objects
    date_columns = ['date_hired', 'date_end']
    for col in date_columns:
        date_format = "%Y-%m-%d"  # Adjust the format according to your actual date format
        df[col] = pd.to_datetime(df[col], errors='coerce', format=date_format)

    # Convert date columns to object type and then set NaT values to None
    for col in date_columns:
        df[col] = df[col].astype(object).where(pd.notna(df[col]), None)

    # Convert boolean columns to boolean type
    bool_columns = ['is_international']
    affirmative_words = ['yes', 'true', '1', 'positive', 'affirmative', 'confirmed', 'agree', 'correct', 'valid', 'good', 'okay', 'fine', 'accepted', 'right', 'aye', 'indeed', 'certain', 'omsim', 'tama', 'oo', 'oo na', 'totoo', 'ootot', 'pak', 'labyugab']  

    for col in bool_columns:
        df[col] = df[col].apply(lambda x: str(x).lower() in affirmative_words)

    specific_columns = {
        'gross_monthly_income': ['Less than ₱9,100', '₱9,100 to ₱18,200', '₱18,200 to ₱36,400', '₱36,400 to ₱63,700', '₱63,700 to ₱109,200', '₱109,200 to ₱182,000', 'Above ₱182,000'],
        'employment_contract': ['Regular', 'Casual', 'Project', 'Seasonal', 'Fixed-term', 'Probationary'],
        'job_position': ['Chairperson / Board of Directors', 'Chief Executive Offices & C-Suite', 'Vice President', 'Director', 'Manager', 'Individual Contributor', 'Entry Level'],
        'employer_type': ['Public / Government', 'Private Sector', 'Non-profit / Third sector', 'Self-Employed / Independent'],
        'finding_job_means': ['others', 'pup job fair', 'job advertisement', 'recommendations', 'On the Job Training', 'Information from friends', 'Government-sponsored job Fair', 'Family Business', 'Walk-in Applicant']
    }

    for col, valid_values in specific_columns.items():
        df[col] = df[col].apply(lambda x: process.extractOne(str(x).lower(), valid_values)[0].capitalize())

    # Convert all other columns to string type
    other_columns = ['student_number', 'job_name', 'finding_job_means','company_name', 'gross_monthly_income', 'employment_contract', 'job_position', 'employer_type', 'country', 'region', 'city']
    for col in other_columns:
        df[col] = df[col].astype(str)

    return df

def process_unclaimed_data(df):

    # Clean the data: trim leading/trailing whitespace
    df = df.apply(lambda col: col.str.strip() if isinstance(col, str) else col)

    # Convert date columns to datetime objects
    date_columns = ['birthdate', 'date_graduated']

    # Clean Unique Column First
    df['student_number'] = df['student_number'].str.strip().str.upper()

    # Drop duplicates based on 'student_number'
    df.drop_duplicates(subset=['student_number'], keep='first', inplace=True)

    df['batch_year'] = pd.to_numeric(df['batch_year'], errors='coerce', downcast='integer')

    # Check if 'date_graduated' is just a year and modify it
    df['date_graduated'] = df['date_graduated'].astype(str)
    mask = df['date_graduated'].notna()
    df.loc[mask, 'date_graduated'] = df.loc[mask, 'date_graduated'] + '-09-01'

    for col in date_columns:
        date_format = "%Y-%m-%d"  # Adjust the format according to your actual date format
        df[col] = pd.to_datetime(df[col], errors='coerce', format=date_format)

    # Convert date columns to object type and then set NaT values to None
    for col in date_columns:
        df[col] = df[col].astype(object).where(pd.notna(df[col]), None)

    # Convert all other columns to string type
    other_columns = ['student_number', 'first_name', 'last_name', 'course_code']
    for col in other_columns:
        df[col] = df[col].astype(str)

    return df

def generate_excel(data, titles):
    # Create a Pandas Excel writer using XlsxWriter as the engine
    now = datetime.now()
    xlsx_name = f"UploadReport_{now.strftime('%Y%m%d_%H%M%S')}.xlsx"
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

    return upload_result

@router.post("/fetch_alumni")
async def fetch_alumni(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    alumnis = db.query(models.CourseEnrolled).filter(models.CourseEnrolled.Status == 1).all()
    for alumni in alumnis:
        # Fetch the corresponding student and course information
        student = db.query(models.Student).get(alumni.StudentId)
        course = db.query(models.Course).get(alumni.CourseId)
        email = student.Email
        #Ensure email is unique
        existing_email_user = db.query(models.User).filter_by(email=student.Email).first()
        if existing_email_user:
            email = ""

        #Generate Username
        base_username = student.LastName.lower()
        random_suffix = ''.join(str(random.randint(0, 9)) for _ in range(4))
        username = f"{base_username}{random_suffix}"

        # Check if the username already exists
        existing_user = db.query(models.User).filter_by(username=username).first()
        while existing_user:
            random_suffix = ''.join(str(random.randint(0, 9)) for _ in range(4))
            username = f"{base_username}{random_suffix}"
            existing_user = db.query(models.User).filter_by(username=username).first()

        result = (
            db.query(models.Metadata.Batch)
            .join(models.CourseEnrolled, models.Metadata.CourseId == models.CourseEnrolled.CourseId)
            .filter(models.CourseEnrolled.StudentId == alumni.StudentId)
            .join(models.StudentClassSubjectGrade, models.StudentClassSubjectGrade.StudentId == models.CourseEnrolled.StudentId)
            .join(models.ClassSubject, models.StudentClassSubjectGrade.ClassSubjectId == models.ClassSubject.ClassSubjectId)
            .join(models.Class, models.ClassSubject.ClassId == models.Class.ClassId)
            .first()
        )

        if result:
            batch = result[0]
            print(f"The batch for StudentId {student.StudentId} is: {batch}")
            check = db.query(models.User).filter(models.User.student_number == student.StudentNumber).first()
            if not check:
                # Create a new User instance for UniversityAdmin
                new_user = models.User(
                    student_number=student.StudentNumber,
                    first_name=student.FirstName,
                    last_name=student.LastName,
                    email=email,
                    password=student.Password,
                    gender="male" if student.Gender == 1 else "female",
                    username=username,
                    birthdate=student.DateOfBirth,
                    origin_address=student.PlaceOfBirth,
                    address=student.ResidentialAddress,
                    mobile_number=student.MobileNumber,
                    course_id=course.id,
                    batch_year=batch,
                    role='alumni',
                )

                # Add the new user to the session and commit the changes
                db.add(new_user)
                db.commit()

@router.post("/fetch_admin")
async def fetch_admin(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    admins = db.query(models.UniversityAdmin).all()
    for admin in admins:
        # Generate a unique username for UniversityAdmin
        base_username = admin.LastName.lower()
        random_suffix = ''.join(str(random.randint(0, 9)) for _ in range(4))
        username = f"{base_username}{random_suffix}"

        # Check if the username already exists
        existing_user = db.query(models.User).filter_by(username=username).first()
        while existing_user:
            random_suffix = ''.join(str(random.randint(0, 9)) for _ in range(4))
            username = f"{base_username}{random_suffix}"
            existing_user = db.query(models.User).filter_by(username=username).first()

        # Create a new User instance for UniversityAdmin
        new_user = models.User(
            first_name=admin.FirstName,
            last_name=admin.LastName,
            email=admin.Email,
            password=admin.Password,
            gender="male" if admin.Gender == 1 else "female",
            username=username,
            birthdate=admin.DateOfBirth,
            origin_address=admin.PlaceOfBirth,
            address=admin.ResidentialAddress,
            mobile_number=admin.MobileNumber,
            role='admin',
        )

        # Add the new user to the session and commit the changes
        db.add(new_user)
        db.commit()

@router.post("/upload_demo_profile/")
async def profile_upload(file: UploadFile = File(...), db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):

    if user.role not in ["admin", "officer"]:
        raise HTTPException(status_code=401, detail="Unauthorized: Access Denied")

    if file.filename.endswith('.csv'):
        df = pd.read_csv(file.file, encoding='ISO-8859-1')
    elif file.filename.endswith('.xlsx'):
        df = pd.read_excel(file.file, engine='openpyxl')
    else:
        raise HTTPException(status_code=400, detail="Upload failed: The file format is not supported.")
    
    expected_columns = ['student_number','first_name','last_name','email','gender','birthdate','mobile_number','telephone_number','headline','civil_status','date_graduated','course_code','is_international','country','region','city','barangay','origin_is_international','origin_country','origin_region','origin_city','origin_barangay', 'post_grad_act', 'unemployment_reason', 'present_employment_status', 'batch_year']
    
    validate_columns(df, expected_columns)

    # Process the data
    df = process_profile_data(df)

    existing_studnums = {alumni.student_number for alumni in db.query(models.User).all()}
    existing_emails = {alumni.email for alumni in db.query(models.User).all()}
    required_fields = ['email', 'student_number', 'birthdate', 'first_name', 'last_name',
    'course_code', 'gender', 'civil_status', 'date_graduated',
    'present_employment_status', 'batch_year']
    # Insert the data into the database
    inserted = []
    not_inserted = []  # List to store alumni that did not inserted
    incomplete_column = []

    try:
        for _, row in df.iterrows():
            if any(not row[field] for field in required_fields):
                missing_fields = [field for field in required_fields if not row[field]]
                print(f"Missing fields for row: {missing_fields}")
                incomplete_column.append(row)
                continue

            actual_course = db.query(models.Course).filter(models.Course.code == row['course_code'].upper()).first()

            if row['student_number'] in existing_studnums or row['email'] in existing_emails or not actual_course:
                if row['student_number'] in existing_studnums:
                    print(row['student_number'])
                if row['email'] in existing_emails:    
                    print(row['email'])
                not_inserted.append(row)
                continue

            # Additional Rows
            alphabet = string.ascii_letters + string.digits
            row['course'] = actual_course
            row['course_id'] = actual_course.id
            row['username'] = f"{row['last_name']}{''.join(secrets.choice(string.digits) for _ in range(4))}"
            row['password'] = utils.hash_password(''.join(secrets.choice(alphabet) for _ in range(10)))
            row['role'] = 'alumni'

            # Create the new user
            new_user_data = row.to_dict()
            new_user_data.pop('course_code', None)  # Remove 'code' key if it exists
            new_user = models.User(**new_user_data)
            db.add(new_user)
            db.commit() 
            db.refresh(new_user)
            complete = await isProfileCompleted(new_user.id, db)
            if complete:
                new_user.is_completed =  True
                db.commit()

            inserted.append(row)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Upload failed.")  
    
    try:
        # Prepare the data for the report
        data = [inserted, not_inserted, incomplete_column]
        titles = ["Inserted", "Not Inserted", "Incomplete"]

        upload_result = generate_excel(data, titles)

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
    
@router.post("/upload_education_profile/")
async def education_upload(file: UploadFile = File(...), db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    if user.role not in ["admin", "officer"]:
        raise HTTPException(status_code=401, detail="Unauthorized: Access Denied")

    if file.filename.endswith('.csv'):
        df = pd.read_csv(file.file, encoding='ISO-8859-1')
    elif file.filename.endswith('.xlsx'):
        df = pd.read_excel(file.file, engine='openpyxl')
    else:
        raise HTTPException(status_code=400, detail="Upload failed: The file format is not supported.")
    
    expected_columns = ['student_number', 'course', 'level', 'school_name', 'story', 'is_international', 'country', 'region', 'city', 'date_start', 'date_graduated']
    
    validate_columns(df, expected_columns)

    # Process the data
    df = process_education_data(df)

    # Insert the data into the database
    inserted = []
    not_inserted = []  # List to store alumni that did not inserted
    incomplete_column = []

    try:
        for _, row in df.iterrows():

            # Check if there's no column
            if not row['student_number'] or not row['date_start']:
                incomplete_column.append(row)
                continue

            actual_user = db.query(models.User).filter(models.User.student_number == row['student_number']).first()

            if not actual_user:
                not_inserted.append(row)
                continue
            
            actual_course = None

            #Check first if there's a course instance
            if row['course']:
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

            # Create the new user
            new_data = models.Education(
                course_id=actual_course.id,
                user_id=actual_user.id,
                level=row['level'],
                school_name=row['school_name'],
                story=row['story'],
                is_international=row['is_international'],
                country=row['country'],
                region=row['region'],
                city=row['city'],
                date_start=row['date_start'],
                date_graduated=row['date_graduated'],
                user=actual_user,
                course=actual_course,
            )
            db.add(new_data)
            inserted.append(row)
            db.commit()

    except Exception as e:
        raise HTTPException(status_code=400, detail="Upload failed.")

    try:
        # Prepare the data for the report
        data = [inserted, not_inserted, incomplete_column]
        titles = ["Inserted", "Not Inserted", "Incomplete"]

        user_instance = db.query(models.User).filter(models.User.id == user.id).first()

        upload_result = generate_excel(data, titles)

        # Create new UploadHistory instance
        new_upload_history = models.UploadHistory(
            type="Education",
            link=upload_result['url'],
            user_id=user.id,
            user=user_instance
        )
        db.add(new_upload_history)
        db.commit()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while generating the report: {str(e)}")
    
@router.post("/upload_achievement_profile/")
async def achievement_upload(file: UploadFile = File(...), db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    if user.role not in ["admin", "officer"]:
        raise HTTPException(status_code=401, detail="Unauthorized: Access Denied")

    if file.filename.endswith('.csv'):
        df = pd.read_csv(file.file, encoding='ISO-8859-1')
    elif file.filename.endswith('.xlsx'):
        df = pd.read_excel(file.file, engine='openpyxl')
    else:
        raise HTTPException(status_code=400, detail="Upload failed: The file format is not supported.")
    
    expected_columns = ['student_number', 'type_of_achievement', 'date_of_attainment', 'description', 'story', 'link_reference']
    
    validate_columns(df, expected_columns)

    # Process the data
    df = process_achievement_data(df)

    # Insert the data into the database
    inserted = []
    not_inserted = []  # List to store alumni that did not inserted
    incomplete_column = []

    try:
        for _, row in df.iterrows():

            # Check if required columns do have value
            if not row['student_number'] or not row['type_of_achievement']:
                incomplete_column.append(row)
                continue

            actual_user = db.query(models.User).filter(models.User.student_number == row['student_number']).first()

            # Check if there a valid user
            if not actual_user:
                not_inserted.append(row)
                continue
            

            # Create the new user
            new_data = models.Achievement(
                user_id=actual_user.id,
                type_of_achievement=row['type_of_achievement'],
                date_of_attainment=row['date_of_attainment'],
                story=row['story'],
                description=row['description'],
                link_reference=row['link_reference'],
                user=actual_user,
            )
            db.add(new_data)
            inserted.append(row)
        db.commit()

    except Exception as e:
        raise HTTPException(status_code=400, detail="Upload failed.")

    try:
        # Prepare the data for the report
        data = [inserted, not_inserted, incomplete_column]
        titles = ["Inserted", "Not Inserted", "Incomplete"]

        user_instance = db.query(models.User).filter(models.User.id == user.id).first()

        upload_result = generate_excel(data, titles)

        # Create new UploadHistory instance
        new_upload_history = models.UploadHistory(
            type="Achievement",
            link=upload_result['url'],
            user_id=user.id,
            user=user_instance
        )
        db.add(new_upload_history)
        db.commit()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while generating the report: {str(e)}")
    
@router.post("/upload_employment_profile/")
async def employment_upload(file: UploadFile = File(...), db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    if user.role not in ["admin", "officer"]:
        raise HTTPException(status_code=401, detail="Unauthorized: Access Denied")

    if file.filename.endswith('.csv'):
        df = pd.read_csv(file.file, encoding='ISO-8859-1')
    elif file.filename.endswith('.xlsx'):
        df = pd.read_excel(file.file, engine='openpyxl')
    else:
        raise HTTPException(status_code=400, detail="Upload failed: The file format is not supported.")
    
    expected_columns = ['student_number', 'job_name', 'company_name', 'date_hired', 'date_end', 'finding_job_means', 'gross_monthly_income', 'employment_contract', 'job_position', 'employer_type', 'is_international', 'country', 'region', 'city']
    
    validate_columns(df, expected_columns)

    # Process the data
    df = process_employment_data(df)
    
    required_fields = ['student_number', 'job_name', 'date_hired', 'gross_monthly_income',
    'employment_contract', 'job_position', 'employer_type', 'company_name']

    # Insert the data into the database
    inserted = []
    not_inserted = []  # List to store alumni that did not inserted
    incomplete_column = []

    for _, row in df.iterrows():
        # Check if required columns do have value
        if any(not row[field] for field in required_fields):
            missing_fields = [field for field in required_fields if not row[field]]
            print(f"Missing fields for row: {missing_fields}")
            incomplete_column.append(row)
            continue

        actual_user = db.query(models.User).filter(models.User.student_number == row['student_number']).first()
        actual_job = db.query(models.Job).filter(models.Job.name == row['job_name']).first()


        # Check if there a valid user
        if not actual_user or not actual_job:
            if not actual_job:
                print(row['job_name'])
            if not actual_user:
                print(row['student_number'])
            not_inserted.append(row)
            continue

        # Create the new user
        new_employment = models.Employment(
            user_id=actual_user.id,
            job_id=actual_job.id,
            company_name=row['company_name'],
            date_hired=row['date_hired'],
            date_end=row['date_end'],
            gross_monthly_income=row['gross_monthly_income'],
            employment_contract=row['employment_contract'],
            finding_job_means=row['finding_job_means'],
            job_position=row['job_position'],
            employer_type=row['employer_type'],
            is_international=row['is_international'],
            country=row['country'],
            region=row['region'],
            city=row['city'],
            job=actual_job,
            user=actual_user,
        )
        db.add(new_employment)
        db.commit()
        db.refresh(new_employment)
        inserted.append(row)

        user_course_classification_ids = None
        if actual_user.course and actual_user.course.classifications:
            user_course_classification_ids = {classification.id for classification in actual_user.course.classifications}

        job_classification_ids = None
        if new_employment.job and new_employment.job.classifications:
            job_classification_ids = {classification.id for classification in new_employment.job.classifications}

        if user_course_classification_ids is not None and job_classification_ids is not None:
            new_employment.aligned_with_academic_program = bool(user_course_classification_ids & job_classification_ids)
            db.commit()

        await afterEmploymentPostRoutine(actual_user.id, db)
        complete = await isProfileCompleted(actual_user.id, db)
        if complete:
            actual_user.is_completed =  True
            db.commit()
    
    try:
        # Prepare the data for the report
        data = [inserted, not_inserted, incomplete_column]
        titles = ["Inserted", "Not Inserted", "Incomplete"]

        user_instance = db.query(models.User).filter(models.User.id == user.id).first()

        upload_result = generate_excel(data, titles)

        # Create new UploadHistory instance
        new_upload_history = models.UploadHistory(
            type="Employment",
            link=upload_result['url'],
            user_id=user.id,
            user=user_instance
        )
        db.add(new_upload_history)
        db.commit()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while generating the report: {str(e)}")
    
@router.post("/upload_unclaimed_profile/")
async def unclaimed_upload(file: UploadFile = File(...), db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    if user.role not in ["admin", "officer"]:
        raise HTTPException(status_code=401, detail="Unauthorized: Access Denied")

    if file.filename.endswith('.csv'):
        df = pd.read_csv(file.file, encoding='ISO-8859-1')
    elif file.filename.endswith('.xlsx'):
        df = pd.read_excel(file.file, engine='openpyxl')
    else:
        raise HTTPException(status_code=400, detail="Upload failed: The file format is not supported.")
    
    expected_columns = ['student_number', 'first_name', 'last_name', 'birthdate', 'course_code', 'date_graduated', 'batch_year']
    
    validate_columns(df, expected_columns)

    # Process the data
    df = process_unclaimed_data(df)

    required_fields = ['student_number', 'birthdate', 'first_name', 'last_name',
    'course_code', 'batch_year']

    # Insert the data into the database
    inserted = []
    not_inserted = []  # List to store alumni that did not inserted
    incomplete_column = []

    try:
        for _, row in df.iterrows():
            #Create a random password for each users
            alphabet = string.ascii_letters + string.digits
            password = utils.hash_password(''.join(secrets.choice(alphabet) for _ in range(10))) 
            username = f"{row['last_name']}{ ''.join(secrets.choice(string.digits) for _ in range(4)) }"

            # Check if required columns do have value
            if any(not row[field] for field in required_fields):
                incomplete_column.append(row)
                continue

            actual_user = db.query(models.User).filter(models.User.student_number == row['student_number']).first()
            actual_course = db.query(models.Course).filter(models.Course.code == row['course_code'].upper()).first()

            # Check if there is an existing user already
            if actual_user or not actual_course:
                not_inserted.append(row)
                continue      

            # Create the new user
            new_data = models.User(
                student_number=row['student_number'],
                birthdate=row['birthdate'],
                first_name=row['first_name'],
                last_name=row['last_name'],
                date_graduated=row['date_graduated'],
                batch_year=row['batch_year'],
                role='unclaimed',
                password=password,
                username=username,
                course=actual_course,
                course_id=actual_course.id,
            )
            db.add(new_data)
            inserted.append(row)
        db.commit()

    except Exception as e:
        raise HTTPException(status_code=400, detail="Upload failed.")

    try:
        # Prepare the data for the report
        data = [inserted, not_inserted, incomplete_column]
        titles = ["Inserted", "Not Inserted", "Incomplete"]

        user_instance = db.query(models.User).filter(models.User.id == user.id).first()

        upload_result = generate_excel(data, titles)

        # Create new UploadHistory instance
        new_upload_history = models.UploadHistory(
            type="TwoWayLink",
            link=upload_result['url'],
            user_id=user.id,
            user=user_instance
        )
        db.add(new_upload_history)
        db.commit()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while generating the report: {str(e)}")

@router.get("/history/all")
async def get_history_all(
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    history = db.query(models.UploadHistory).all()
    db.close() 
    # Close the database session
    return history
