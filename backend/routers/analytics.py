import numpy as np
from itertools import groupby
from datetime import date, datetime
from operator import or_
from uuid import UUID
from datetime import date, datetime
from uuid import UUID
from fastapi import Body, Query, APIRouter, File, Form, status, Depends, HTTPException, UploadFile
from backend.database import get_db
from sqlalchemy.orm import Session, aliased
from backend.oauth2 import get_current_user
from backend import models
from typing import Annotated, Dict, List, Optional, Union
from starlette import status
from backend.schemas import UserResponse
from backend import models
from sqlalchemy import not_, and_, func, desc, case


router = APIRouter()

user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get("/overall/response_rate/")
async def over_response_rate(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
  unclaimed_query = func.count(case([(func.lower(models.User.role) == 'unclaimed', 1)]))
  incomplete_query = func.count(case([(and_(func.lower(models.User.role) == 'alumni', not_(models.User.is_completed)), 1)]))
  complete_query = func.count(case([(and_(func.lower(models.User.role) == 'alumni', models.User.is_completed), 1)]))
  pending_query = func.count(case([(func.lower(models.User.role) == 'public', 1)]))

  query = db.query(
      unclaimed_query.label('Unclaimed'),
      incomplete_query.label('Incomplete'),
      complete_query.label('Complete'),
      pending_query.label('Waiting for Approval')
  )

  results = query.one()

  response_data = {
      'responses': [
          {
              'id': "Unanswered",
              'label': "Unanswered",
              'value': results.Unclaimed,
          },
          {
              'id': "Incomplete",
              'label': "Incomplete",
              'value': results.Incomplete,
          },
          {
              'id': "Complete",
              'label': "Complete",
              'value': results.Complete,
          },
          {
              'id': "Waiting for Approval",
              'label': "Waiting for Approval",
              'value': results["Waiting for Approval"],
          },
      ]
  }

  # Filter out items with len(object) equal to zero
  response_data['responses'] = [item for item in response_data['responses'] if item['value'] > 0]

  return response_data

@router.get("/overall/monthly_income/")
async def over_monthly_income(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
  minimal_query = func.count(case([(and_(func.lower(models.Employment.gross_monthly_income) == 'less than ₱9,100', models.User.is_completed, models.User.id == models.Employment.user_id), 1)]))
  low_query = func.count(case([(and_(func.lower(models.Employment.gross_monthly_income) == '₱9,100 to ₱18,200', models.User.is_completed, models.User.id == models.Employment.user_id), 1)]))
  moderate_query = func.count(case([(and_(func.lower(models.Employment.gross_monthly_income) == '₱18,200 to ₱36,400', models.User.is_completed, models.User.id == models.Employment.user_id), 1)]))
  intermediate_query = func.count(case([(and_(func.lower(models.Employment.gross_monthly_income) == '₱36,400 to ₱63,700', models.User.is_completed, models.User.id == models.Employment.user_id), 1)]))
  above_average_query = func.count(case([(and_(func.lower(models.Employment.gross_monthly_income) == '₱63,700 to ₱109,200', models.User.is_completed, models.User.id == models.Employment.user_id), 1)]))
  high_query = func.count(case([(and_(func.lower(models.Employment.gross_monthly_income) == '₱109,200 to ₱182,000', models.User.is_completed, models.User.id == models.Employment.user_id), 1)]))
  exceptional_query = func.count(case([(and_(func.lower(models.Employment.gross_monthly_income) == 'above ₱182,000', models.User.is_completed, models.User.id == models.Employment.user_id), 1)]))

  query = db.query(
      minimal_query.label('Less than ₱9,100'),
      low_query.label('₱9,100 to ₱18,200'),
      moderate_query.label('₱18,200 to ₱36,400'),
      intermediate_query.label('₱36,400 to ₱63,700'),
      above_average_query.label('₱63,700 to ₱109,200'),
      high_query.label('₱109,200 to ₱182,000'),
      exceptional_query.label('Above ₱182,000')
  )

  results = query.one()

  response_data = {
    'responses': [
        {
            'id': "Less than ₱9,100",
            'label': "Less than ₱9,100",
            'value': results["Less than ₱9,100"],
        },
        {
            'id': "₱9,100 to ₱18,200",
            'label': "₱9,100 to ₱18,200",
            'value': results["₱9,100 to ₱18,200"],
        },
        {
            'id': "₱18,200 to ₱36,400",
            'label': "₱18,200 to ₱36,400",
            'value': results["₱18,200 to ₱36,400"],
        },
        {
            'id': "₱36,400 to ₱63,700",
            'label': "₱36,400 to ₱63,700",
            'value': results["₱36,400 to ₱63,700"],
        },
        {
            'id': "₱63,700 to ₱109,200",
            'label': "₱63,700 to ₱109,200",
            'value': results["₱63,700 to ₱109,200"],
        },
        {
            'id': "₱109,200 to ₱182,000",
            'label': "₱109,200 to ₱182,000",
            'value': results["₱109,200 to ₱182,000"],
        },
        {
            'id': "Above ₱182,000",
            'label': "Above ₱182,000",
            'value': results["Above ₱182,000"],
        },
    ]
  }
  # Filter out items with len(object) equal to zero
  response_data['responses'] = [item for item in response_data['responses'] if item['value'] > 0]

  return response_data


@router.get("/overall/gender/")
async def overall_gender(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    lgbtqia_query = func.count(case([(and_(func.lower(models.User.gender) == 'lgbtqia+', 
                                       func.lower(models.User.role) == 'alumni', 
                                       models.User.is_completed), 1)]))
    male_query = func.count(case([(and_(func.lower(models.User.gender) == 'male', 
                                        func.lower(models.User.role) == 'alumni', 
                                        models.User.is_completed), 1)]))
    female_query = func.count(case([(and_(func.lower(models.User.gender) == 'female', 
                                          func.lower(models.User.role) == 'alumni', 
                                          models.User.is_completed), 1)]))

    query = db.query(
        lgbtqia_query.label('LGBTQIA+'),
        male_query.label('Male'),
        female_query.label('Female')
    )

    results = query.one()

    response_data = {
        'responses': [
            {
                'id': "LGBTQIA+",
                'label': "LGBTQIA+",
                'value': results["LGBTQIA+"],
            },
            {
                'id': "Male",
                'label': "Male",
                'value': results["Male"],
            },
            {
                'id': "Female",
                'label': "Female",
                'value': results["Female"],
            }
        ]
    }

    # Filter out items with len(object) equal to zero
    response_data['responses'] = [item for item in response_data['responses'] if item['value'] > 0]

    return response_data


@router.get("/overall/civil_status/")
async def overall_civil_status(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    single_query = func.count(case([(and_(func.lower(models.User.role) == 'alumni', 
                                          func.lower(models.User.civil_status) == 'single', 
                                          models.User.is_completed), 1)]))
    married_query = func.count(case([(and_(func.lower(models.User.role) == 'alumni', 
                                          func.lower(models.User.civil_status) == 'married', 
                                          models.User.is_completed), 1)]))
    divorced_query = func.count(case([(and_(func.lower(models.User.role) == 'alumni', 
                                            func.lower(models.User.civil_status) == 'divorced', 
                                            models.User.is_completed), 1)]))
    widowed_query = func.count(case([(and_(func.lower(models.User.role) == 'alumni', 
                                          func.lower(models.User.civil_status) == 'widowed', 
                                          models.User.is_completed), 1)]))

    query = db.query(
        single_query.label('Single'),
        married_query.label('Married'),
        divorced_query.label('Divorced'),
        widowed_query.label('Widowed')
    )

    results = query.one()

    response_data = {
        'responses': [
            {
                'id': "Single",
                'label': "Single",
                'value': results.Single,
            },
            {
                'id': "Married",
                'label': "Married",
                'value': results.Married,
            },
            {
                'id': "Divorced",
                'label': "Divorced",
                'value': results.Divorced,
            },
            {
                'id': "Widowed",
                'label': "Widowed",
                'value': results.Widowed,
            },
        ]
    }

    # Filter out items with len(object) equal to zero
    response_data['responses'] = [item for item in response_data['responses'] if item['value'] > 0]

    return response_data


@router.get("/overall/employment_status/")
async def overall_employment_status(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    employed_query = func.count(case([(and_(func.lower(models.User.present_employment_status) == 'employed', 
                                            func.lower(models.User.role) == 'alumni', 
                                            models.User.is_completed), 1)]))
    selfemployed_query = func.count(case([(and_(func.lower(models.User.present_employment_status) == 'self-employed', 
                                                func.lower(models.User.role) == 'alumni', 
                                                models.User.is_completed), 1)]))
    never_been_employed_query = func.count(case([(and_(func.lower(models.User.present_employment_status) == 'never been employed', 
                                                      func.lower(models.User.role) == 'alumni', 
                                                      models.User.is_completed), 1)]))
    unable_to_work_query = func.count(case([(and_(func.lower(models.User.present_employment_status) == 'unable to work', 
                                                  func.lower(models.User.role) == 'alumni', 
                                                  models.User.is_completed), 1)]))
    unemployed_query = func.count(case([(and_(func.lower(models.User.present_employment_status) == 'unemployed', 
                                              func.lower(models.User.role) == 'alumni', 
                                              models.User.is_completed), 1)]))

    query = db.query(
        employed_query.label('Employed'),
        selfemployed_query.label('Self-Employed'),
        never_been_employed_query.label('Never been Employed'),
        unable_to_work_query.label('Unable to Work'),
        unemployed_query.label('Unemployed')
    )

    results = query.one()

    response_data = {
        'responses': [
            {
                'id': "Employed",
                'label': "Employed",
                'value': results.Employed,
            },
            {
                'id': "Self-Employed",
                'label': "Self-Employed",
                'value': results["Self-Employed"],
            },
            {
                'id': "Never been Employed",
                'label': "Never been Employed",
                'value': results["Never been Employed"],
            },
            {
                'id': "Unable to Work",
                'label': "Unable to Work",
                'value': results["Unable to Work"],
            },
            {
                'id': "Unemployed",
                'label': "Unemployed",
                'value': results.Unemployed,
            },
        ]
    }

    # Filter out items with len(object) equal to zero
    response_data['responses'] = [item for item in response_data['responses'] if item['value'] > 0]

    return response_data


@router.get("/overall/employment_contract/")
async def over_employment_contract(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    regular_query = func.count(case([(and_(func.lower(models.Employment.employment_contract) == 'regular', models.User.is_completed, models.User.id == models.Employment.user_id), 1)]))
    casual_query = func.count(case([(and_(func.lower(models.Employment.employment_contract) == 'casual', models.User.is_completed, models.User.id == models.Employment.user_id), 1)]))
    project_query = func.count(case([(and_(func.lower(models.Employment.employment_contract) == 'project', models.User.is_completed, models.User.id == models.Employment.user_id), 1)]))
    seasonal_query = func.count(case([(and_(func.lower(models.Employment.employment_contract) == 'seasonal', models.User.is_completed, models.User.id == models.Employment.user_id), 1)]))
    fixed_term_query = func.count(case([(and_(func.lower(models.Employment.employment_contract) == 'fixed-term', models.User.is_completed, models.User.id == models.Employment.user_id), 1)]))
    probationary_query = func.count(case([(and_(func.lower(models.Employment.employment_contract) == 'probationary', models.User.is_completed), 1)]))

    query = db.query(
        regular_query.label('Regular'),
        casual_query.label('Casual'),
        project_query.label('Project'),
        seasonal_query.label('Seasonal'),
        fixed_term_query.label('Fixed-term'),
        probationary_query.label('Probationary')
    )

    results = query.one()

    response_data = {
        'responses': [
            {
                'id': "Regular",
                'label': "Regular",
                'value': results.Regular,
            },
            {
                'id': "Casual",
                'label': "Casual",
                'value': results.Casual,
            },
            {
                'id': "Project",
                'label': "Project",
                'value': results.Project,
            },
            {
                'id': "Seasonal",
                'label': "Seasonal",
                'value': results.Seasonal,
            },
            {
                'id': "Fixed-term",
                'label': "Fixed-term",
                'value': results["Fixed-term"],
            },
            {
                'id': "Probationary",
                'label': "Probationary",
                'value': results.Probationary,
            },
        ]
    }

    # Filter out items with len(object) equal to zero
    response_data['responses'] = [item for item in response_data['responses'] if item['value'] > 0]

    return response_data


@router.get("/overall/employer_type/")
async def over_employer_type(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    public_query = func.count(case([(and_(func.lower(models.Employment.employer_type) == 'public / government', models.User.is_completed, models.User.id == models.Employment.user_id), 1)]))
    private_query = func.count(case([(and_(func.lower(models.Employment.employer_type) == 'private sector', models.User.is_completed, models.User.id == models.Employment.user_id), 1)]))
    nonprofit_query = func.count(case([(and_(func.lower(models.Employment.employer_type) == 'non-profit / third sector', models.User.is_completed, models.User.id == models.Employment.user_id), 1)]))
    selfemployed_query = func.count(case([(and_(func.lower(models.Employment.employer_type) == 'self-employed / independent', models.User.is_completed, models.User.id == models.Employment.user_id), 1)]))

    query = db.query(
        public_query.label('Public / Government'),
        private_query.label('Private Sector'),
        nonprofit_query.label('Non-profit / Third sector'),
        selfemployed_query.label('Self-Employed / Independent')
    )

    results = query.one()
    response_data =  {
        'responses': [
            {
              'id': "Public / Government",
              'label': "Public / Government",
              'value': results["Public / Government"],
            },
            {
              'id': "Private Sector",
              'label': "Private Sector",
              'value': results["Private Sector"],
            },
            {
              'id': "Non-profit / Third sector",
              'label': "Non-profit / Third sector",
              'value': results["Non-profit / Third sector"],
            },
            {
              'id': "Self-Employed / Independent",
              'label': "Self-Employed / Independent",
              'value': results["Self-Employed / Independent"],
            },
        ]
    }

    # Filter out items with len(object) equal to zero
    response_data['responses'] = [item for item in response_data['responses'] if item['value'] > 0]

    return response_data

@router.get("/course_employment_rate/")
async def over_employer_type(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
  courses = db.query(models.Course).filter(models.Course.in_pupqc == True).all()
  course_employment_rate = []
  for course in courses:
      course_users = db.query(models.User).filter(and_(func.lower(models.User.role) == 'alumni', models.User.is_completed == True, models.User.course_id == course.id)).all()
      course_users_employed = len([user for user in course_users if user.present_employment_status == 'employed' or user.present_employment_status == 'self-employed'])
      if len(course_users) == 0: continue
      
      course_employment_rate.append({
            "course_id": course.id,
            "course_code": course.code,
            "users_count": len(course_users),
            "users_employed": course_users_employed,
            "employment_rate": round((course_users_employed / len(course_users)) * 100) if course_users else 0
      })
      
  return  course_employment_rate

@router.get("/course_response_rate/recent_batch/")
async def over_employer_type(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
  
  # Fetch all users ordered by batch year
  users = db.query(models.User).filter(func.lower(models.User.role) == 'alumni').order_by(desc(models.User.batch_year)).all()

  # Group users by batch year
  groups = groupby(users, key=lambda user: user.batch_year)

  for batch_year, group in groups:
      # Convert group generator to a list to get the count
      users_in_batch = list(group)
      
      if len(users_in_batch) >= 10:
          recent_batch_year = batch_year
          break

  courses = db.query(models.Course).filter(models.Course.in_pupqc == True).all()
  course_response_rate = []

  for course in courses:
      course_users = db.query(models.User).filter(and_(func.lower(models.User.role) == 'alumni', models.User.course_id == course.id, models.User.batch_year == recent_batch_year )).all()
      course_users_completed = len([user for user in course_users if user.is_completed])
      
      if len(course_users) == 0: continue
      
      course_response_rate.append({
            "course_id": course.id,
            "course_code": course.code,
            "users_count": len(course_users),
            "users_completed": course_users_completed,
            "response_rate": round((course_users_completed / len(course_users)) * 100) if course_users else 0
      })
      
  return  course_response_rate

@router.get("/classification_employment_rate/")
async def classification_employment_rate(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    employments = db.query(models.Employment).all()
    classifications = db.query(models.Classification).all()

   # Extracting unique batch_years from the User table
    batch_years = db.query(models.User.batch_year).filter(
      and_(
          models.User.is_completed == True,  # Assuming is_completed is a boolean column
          func.lower(models.User.role) == 'alumni'  # Case-insensitive comparison for role
      )
    ).distinct().all()
    batch_years = [batch_year[0] for batch_year in batch_years]

    classification_list = [
      {
          "classification_name": classification.name,
          "classification_code": classification.code,
          **{f"batch {batch_year}": 0 for batch_year in batch_years}
      } 
      for classification in classifications
    ]

    for employment in employments:
        job = employment.job
        user = employment.user
        for classification in job.classifications:
          # find matching classification in the list and increment the count
          matching_item = next(
              (item for item in classification_list if item["classification_name"] == classification.name),
              None
          )
          if matching_item and user.is_completed and user.role.lower() == 'alumni':
            matching_item[f"batch {user.batch_year}"] += 1
                
    final_classification_list = [
      classification for classification in classification_list
      if any(classification[f"batch {batch_year}"] != 0 for batch_year in batch_years)
    ]
    return {'classification': final_classification_list, 'keys': {f"batch {batch_year}" for batch_year in batch_years}}

@router.get("/employment_count_over_time/")
async def employment_count_over_time(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
  dates = set()
  users = db.query(models.User).filter(
      and_(
          models.User.is_completed == True,  # Assuming is_completed is a boolean column
          func.lower(models.User.role) == 'alumni'  # Case-insensitive comparison for role
      )
  ).all()
  for user in users:
      for employment in user.employment:
          dates.add(employment.date_hired)
          if employment.date_end is not None:
              dates.add(employment.date_end)

  # Sort the dates and split them into 12 ranges
  sorted_dates = sorted(list(dates))
  date_ranges = np.array_split(sorted_dates, 12)

  # Prepare the data structure for the graph
  data = []

  # For each course, get the number of active jobs for each date range
  courses = db.query(models.Course).all()
  for course in courses:
      course_data = {
          'id': course.code,
          'data': []
      }

      for date_range in date_ranges:
          start_of_range = date_range[0]
          end_of_range = date_range[-1]
          count = 0

          for user in users:
              for employment in user.employment:
                  if (employment.date_hired <= end_of_range and (employment.date_end is None or employment.date_end >= start_of_range)) or \
                    (employment.date_hired < start_of_range and (employment.date_end is None or (employment.date_end >= start_of_range and employment.date_end <= end_of_range))):
                      # Check if the user's course is the current one
                      if user.course_id == course.id:
                          count += 1

          course_data['data'].append({
              'x': f"{start_of_range.strftime('%m/%Y')}",
              'y': count
          })
      if count > 0:
        data.append(course_data)

  return data

@router.get("/work_alignment_over_time/")
async def work_alignment_over_time(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
  dates = set()
  users = db.query(models.User).filter(
    and_(
        models.User.is_completed == True,  # Assuming is_completed is a boolean column
        func.lower(models.User.role) == 'alumni'  # Case-insensitive comparison for role
    )
  ).all()

  for user in users:
      for employment in user.employment:
          dates.add(employment.date_hired)
          if employment.date_end is not None:
              dates.add(employment.date_end)

  # Sort the dates and split them into 12 ranges
  sorted_dates = sorted(list(dates))
  date_ranges = np.array_split(sorted_dates, 12)

  # Prepare the data structure for the graph
  data = []

  # For each course, get the number of active jobs for each date range
  courses = db.query(models.Course).all()
  for course in courses:
      course_data = {
          'id': course.code,
          'data': []
      }

      for date_range in date_ranges:
          start_of_range = date_range[0]
          end_of_range = date_range[-1]
          count = 0

          for user in users:
              for employment in user.employment:
                  if (employment.date_hired <= end_of_range and (employment.date_end is None or employment.date_end >= start_of_range)) or \
                    (employment.date_hired < start_of_range and (employment.date_end is None or (employment.date_end >= start_of_range and employment.date_end <= end_of_range))):
                      # Check if the user's course is the current one
                      if user.course_id == course.id and employment.aligned_with_academic_program:
                          count += 1

          course_data['data'].append({
              'x': f"{start_of_range.strftime('%m/%Y')}",
              'y': count
          })

      if count > 0:
        data.append(course_data)


  return data


