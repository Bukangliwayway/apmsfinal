from datetime import date, datetime
from operator import or_
from uuid import UUID
from datetime import date, datetime
from uuid import UUID
from fastapi import Body, Query, APIRouter, File, Form, status, Depends, HTTPException, UploadFile
from backend.database import get_db
from sqlalchemy.orm import Session
from backend.oauth2 import get_current_user
from backend import models
from typing import Annotated, Dict, List, Optional, Union
from starlette import status
from backend.schemas import UserResponse
from backend import models
from sqlalchemy import not_, and_, func



router = APIRouter()

user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/overall/response_rate/")
async def over_response_rate(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    unclaimed = db.query(models.User).filter(func.lower(models.User.role) == 'unclaimed').all()
    incomplete = db.query(models.User).filter(and_(
        func.lower(models.User.role) == 'alumni',
        not_(models.User.is_completed)
    )).all()
    complete = db.query(models.User).filter(and_(
        func.lower(models.User.role) == 'alumni',
        models.User.is_completed
    )).all()
    pending = db.query(models.User).filter(func.lower(models.User.role) == 'public').all()

    return {
        'responses': [
            {
              'id': "Unanswered",
              'label': "Unanswered",
              'value': len(unclaimed),
            },
            {
              'id': "Incomplete",
              'label': "Incomplete",
              'value': len(incomplete),
            },
            {
              'id': "Complete",
              'label': "Complete",
              'value': len(complete),
            },
            {
              'id': "Waiting for Approval",
              'label': "Waiting for Approval",
              'value': len(pending),
            },
        ]
    }

@router.get("/overall/monthly_income/")
async def over_monthly_income(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    Minimal = db.query(models.Employment).\
            join(models.Employment.user).\
            filter(and_(
                func.lower(models.Employment.gross_monthly_income) == 'less than ₱9,100',
                models.User.is_completed
            )).all()

    Low = db.query(models.Employment).\
            join(models.Employment.user).\
            filter(and_(
                func.lower(models.Employment.gross_monthly_income) == '₱9,100 to ₱18,200',
                models.User.is_completed
                
            )).all()

    Moderate = db.query(models.Employment).\
            join(models.Employment.user).\
            filter(and_(
                func.lower(models.Employment.gross_monthly_income) == '₱18,200 to ₱36,400',
                models.User.is_completed
                
            )).all()

    Intermediate = db.query(models.Employment).\
            join(models.Employment.user).\
            filter(and_(
                func.lower(models.Employment.gross_monthly_income) == '₱36,400 to ₱63,700',
                models.User.is_completed
                
            )).all()

    AboveAverage = db.query(models.Employment).\
            join(models.Employment.user).\
            filter(and_(
                func.lower(models.Employment.gross_monthly_income) == '₱63,700 to ₱109,200',
                models.User.is_completed
                
            )).all()

    High = db.query(models.Employment).\
            join(models.Employment.user).\
            filter(and_(
                func.lower(models.Employment.gross_monthly_income) == '₱109,200 to ₱182,000',
                models.User.is_completed
                
            )).all()

    Exceptional = db.query(models.Employment).\
            join(models.Employment.user).\
            filter(and_(
                func.lower(models.Employment.gross_monthly_income) == 'above ₱182,000',
                models.User.is_completed
                
            )).all()
      
    return {
        'responses': [
            {
              'id': "Less than ₱9,100",
              'label': "Less than ₱9,100",
              'value': len(Minimal),
            },
            {
              'id': "₱9,100 to ₱18,200",
              'label': "₱9,100 to ₱18,200",
              'value': len(Low),
            },
            {
              'id': "₱18,200 to ₱36,400",
              'label': "₱18,200 to ₱36,400",
              'value': len(Moderate),
            },
            {
              'id': "₱36,400 to ₱63,700",
              'label': "₱36,400 to ₱63,700",
              'value': len(Intermediate),
            },
            {
              'id': "₱63,700 to ₱109,200",
              'label': "₱63,700 to ₱109,200",
              'value': len(AboveAverage),
            },
            {
              'id': "₱109,200 to ₱182,000",
              'label': "₱109,200 to ₱182,000",
              'value': len(High),
            },
            {
              'id': "Above ₱182,000",
              'label': "Above ₱182,000",
              'value': len(Exceptional),
            },
        ]
    }

@router.get("/overall/gender/")
async def overall_gender(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    lgbt = db.query(models.User).filter(and_(
        func.lower(models.User.gender) == 'lgbtqia+',
        func.lower(models.User.role) == 'alumni',
        models.User.is_completed
    )).all()

    male = db.query(models.User).filter(and_(
        func.lower(models.User.gender) == 'male',
        func.lower(models.User.role) == 'alumni',
        models.User.is_completed
    )).all()

    female = db.query(models.User).filter(and_(
        func.lower(models.User.gender) == 'female',
        func.lower(models.User.role) == 'alumni',
        models.User.is_completed
    )).all()
    return {
        'responses': [
            {
              'id': "LGBTQIA+",
              'label': "LGBTQIA+",
              'value': len(lgbt),
            },
            {
              'id': "Male",
              'label': "Male",
              'value': len(male),
            },
            {
              'id': "Female",
              'label': "Female",
              'value': len(female),
            },
        ]
    }

@router.get("/overall/civil_status/")
async def overall_civil_status(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    single = db.query(models.User).filter(and_(func.lower(models.User.role) == 'alumni', func.lower(models.User.civil_status) == 'single', models.User.is_completed)).all()
    married = db.query(models.User).filter(and_(func.lower(models.User.role) == 'alumni', func.lower(models.User.civil_status) == 'married', models.User.is_completed)).all()
    divorced = db.query(models.User).filter(and_(func.lower(models.User.role) == 'alumni', func.lower(models.User.civil_status) == 'divorced', models.User.is_completed)).all()
    widowed = db.query(models.User).filter(and_(func.lower(models.User.role) == 'alumni', func.lower(models.User.civil_status) == 'widowed', models.User.is_completed)).all()

    return {
        'responses': [
            {
              'id': "Single",
              'label': "Single",
              'value': len(single),
            },
            {
              'id': "Married",
              'label': "Married",
              'value': len(married),
            },
            {
              'id': "Divorced",
              'label': "Divorced",
              'value': len(divorced),
            },
            {
              'id': "Widowed",
              'label': "Widowed",
              'value': len(widowed),
            },
        ]
    }

@router.get("/overall/employment_status/")
async def overall_employment_status(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    employed = db.query(models.User).filter(and_(
        func.lower(models.User.present_employment_status) == 'employed',
        func.lower(models.User.role) == 'alumni',
        models.User.is_completed
    )).all()

    selfemployed = db.query(models.User).filter(and_(
        func.lower(models.User.present_employment_status) == 'self-employed',
        func.lower(models.User.role) == 'alumni',
        models.User.is_completed
    )).all()

    neverbeenemployed = db.query(models.User).filter(and_(
        func.lower(models.User.present_employment_status) == 'never been employed',
        func.lower(models.User.role) == 'alumni',
        models.User.is_completed
    )).all()

    unabletowork = db.query(models.User).filter(and_(
        func.lower(models.User.present_employment_status) == 'unable to work',
        func.lower(models.User.role) == 'alumni',
        models.User.is_completed
    )).all()

    unemployed = db.query(models.User).filter(and_(
        func.lower(models.User.present_employment_status) == 'unemployed',
        func.lower(models.User.role) == 'alumni',
        models.User.is_completed
    )).all()
    return {
        'responses': [
            {
              'id': "Employed",
              'label': "Employed",
              'value': len(employed),
            },
            {
              'id': "Self-Employed",
              'label': "Self-Employed",
              'value': len(selfemployed),
            },
            {
              'id': "Never been Employed",
              'label': "Never been Employed",
              'value': len(neverbeenemployed),
            },
            {
              'id': "Unable to Work",
              'label': "Unable to Work",
              'value': len(unabletowork),
            },
            {
              'id': "Unemployed",
              'label': "Unemployed",
              'value': len(unemployed),
            },
        ]
    }

@router.get("/overall/employment_contract/")
async def over_employment_contract(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    
    Regular = db.query(models.Employment).\
            join(models.Employment.user).\
            filter(and_(
                func.lower(models.Employment.employment_contract) == 'regular',
                models.User.is_completed
            )).all()

    Casual = db.query(models.Employment).\
            join(models.Employment.user).\
            filter(and_(
                func.lower(models.Employment.employment_contract) == 'casual',
                models.User.is_completed
            )).all()

    Project = db.query(models.Employment).\
            join(models.Employment.user).\
            filter(and_(
                func.lower(models.Employment.employment_contract) == 'project',
                models.User.is_completed
            )).all()

    Seasonal = db.query(models.Employment).\
            join(models.Employment.user).\
            filter(and_(
                func.lower(models.Employment.employment_contract) == 'seasonal',
                models.User.is_completed
            )).all()

    FixedTerm = db.query(models.Employment).\
            join(models.Employment.user).\
            filter(and_(
                func.lower(models.Employment.employment_contract) == 'fixed-term',
                models.User.is_completed
            )).all()

    Probationary = db.query(models.Employment).\
            join(models.Employment.user).\
            filter(and_(
                func.lower(models.Employment.employment_contract) == 'probationary',
                models.User.is_completed
            )).all()
    return {
        'responses': [
            {
              'id': "Regular",
              'label': "Regular",
              'value': len(Regular),
            },
            {
              'id': "Casual",
              'label': "Casual",
              'value': len(Casual),
            },
            {
              'id': "Project",
              'label': "Project",
              'value': len(Project),
            },
            {
              'id': "Seasonal",
              'label': "Seasonal",
              'value': len(Seasonal),
            },
            {
              'id': "Fixed-term",
              'label': "Fixed-term",
              'value': len(FixedTerm),
            },
            {
              'id': "Probationary",
              'label': "Probationary",
              'value': len(Probationary),
            },
          ]
    }

@router.get("/overall/employer_type/")
async def over_employer_type(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    Public = db.query(models.Employment).\
            join(models.Employment.user).\
            filter(and_(
                func.lower(models.Employment.employer_type) == 'public / government',
                models.User.is_completed
            )).all()

    Private = db.query(models.Employment).\
            join(models.Employment.user).\
            filter(and_(
                func.lower(models.Employment.employer_type) == 'private sector',
                models.User.is_completed
            )).all()

    Nonprofit = db.query(models.Employment).\
            join(models.Employment.user).\
            filter(and_(
                func.lower(models.Employment.employer_type) == 'non-profit / third sector',
                models.User.is_completed
            )).all()

    Selfemployed = db.query(models.Employment).\
            join(models.Employment.user).\
            filter(and_(
                func.lower(models.Employment.employer_type) == 'self-employed / independent',
                models.User.is_completed
            )).all()
     
    return {
        'responses': [
            {
              'id': "Public / Government",
              'label': "Public / Government",
              'value': len(Public),
            },
            {
              'id': "Private Sector",
              'label': "Private Sector",
              'value': len(Private),
            },
            {
              'id': "Non-profit / Third sector",
              'label': "Non-profit / Third sector",
              'value': len(Nonprofit),
            },
            {
              'id': "Self-Employed / Independent",
              'label': "Self-Employed / Independent",
              'value': len(Selfemployed),
            },
        ]
    }
