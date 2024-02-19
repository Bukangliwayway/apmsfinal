from collections import defaultdict
from fastapi.encoders import jsonable_encoder
import numpy as np
from itertools import groupby
from datetime import date, datetime, timedelta
from operator import or_
from uuid import UUID
from datetime import date, datetime
from uuid import UUID
from fastapi import Body, Query, APIRouter, File, Form, status, Depends, HTTPException, UploadFile
from backend.database import get_db
from sqlalchemy.orm import Session, aliased, joinedload
from backend.oauth2 import get_current_user
from backend import models
from typing import Annotated, Dict, List, Optional, Union
from starlette import status
from backend.schemas import UserResponse
from backend import models
from sqlalchemy import not_, and_, func, desc, case, literal_column


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
    query = db.query(
        func.count(case([(and_(
            func.lower(models.Employment.gross_monthly_income) == 'less than ₱9,100',
            models.User.is_completed,
            models.User.id == models.Employment.user_id
        ), 1)])).label('Less than ₱9,100'),

        func.count(case([(and_(
            func.lower(models.Employment.gross_monthly_income) == '₱9,100 to ₱18,200',
            models.User.is_completed,
            models.User.id == models.Employment.user_id
        ), 1)])).label('₱9,100 to ₱18,200'),

        func.count(case([(and_(
            func.lower(models.Employment.gross_monthly_income) == '₱18,200 to ₱36,400',
            models.User.is_completed,
            models.User.id == models.Employment.user_id
        ), 1)])).label('₱18,200 to ₱36,400'),

        func.count(case([(and_(
            func.lower(models.Employment.gross_monthly_income) == '₱36,400 to ₱63,700',
            models.User.is_completed,
            models.User.id == models.Employment.user_id
        ), 1)])).label('₱36,400 to ₱63,700'),

        func.count(case([(and_(
            func.lower(models.Employment.gross_monthly_income) == '₱63,700 to ₱109,200',
            models.User.is_completed,
            models.User.id == models.Employment.user_id
        ), 1)])).label('₱63,700 to ₱109,200'),

        func.count(case([(and_(
            func.lower(models.Employment.gross_monthly_income) == '₱109,200 to ₱182,000',
            models.User.is_completed,
            models.User.id == models.Employment.user_id
        ), 1)])).label('₱109,200 to ₱182,000'),

        func.count(case([(and_(
            func.lower(models.Employment.gross_monthly_income) == 'above ₱182,000',
            models.User.is_completed,
            models.User.id == models.Employment.user_id
        ), 1)])).label('Above ₱182,000')
    )

    results = query.one()

    response_data = {
        'responses': [
            {'id': key, 'label': key, 'value': value}
            for key, value in results._asdict().items()
            if value > 0
        ]
    }

    return response_data
@router.get("/overall/gender/")
async def overall_gender(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    query = db.query(
        func.count(case([(and_(
            func.lower(models.User.gender) == 'lgbtqia+',
            func.lower(models.User.role) == 'alumni',
            models.User.is_completed
        ), 1)])).label('LGBTQIA+'),
        
        func.count(case([(and_(
            func.lower(models.User.gender) == 'male',
            func.lower(models.User.role) == 'alumni',
            models.User.is_completed
        ), 1)])).label('Male'),

        func.count(case([(and_(
            func.lower(models.User.gender) == 'female',
            func.lower(models.User.role) == 'alumni',
            models.User.is_completed
        ), 1)])).label('Female')
    )

    results = query.one()

    response_data = {
        'responses': [
            {'id': key, 'label': key, 'value': value}
            for key, value in results._asdict().items()
            if value > 0
        ]
    }

    return response_data

@router.get("/overall/civil_status/")
async def overall_civil_status(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    query = db.query(
        func.count(case([(and_(
            func.lower(models.User.role) == 'alumni',
            func.lower(models.User.civil_status) == 'single',
            models.User.is_completed
        ), 1)])).label('Single'),

        func.count(case([(and_(
            func.lower(models.User.role) == 'alumni',
            func.lower(models.User.civil_status) == 'married',
            models.User.is_completed
        ), 1)])).label('Married'),

        func.count(case([(and_(
            func.lower(models.User.role) == 'alumni',
            func.lower(models.User.civil_status) == 'divorced',
            models.User.is_completed
        ), 1)])).label('Divorced'),

        func.count(case([(and_(
            func.lower(models.User.role) == 'alumni',
            func.lower(models.User.civil_status) == 'widowed',
            models.User.is_completed
        ), 1)])).label('Widowed')
    )

    results = query.one()

    response_data = {
        'responses': [
            {'id': key, 'label': key, 'value': value}
            for key, value in results._asdict().items()
            if value > 0
        ]
    }

    return response_data

@router.get("/overall/employment_status/")
async def overall_employment_status(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    query = db.query(
        func.count(case([(and_(
            func.lower(models.User.present_employment_status) == 'employed',
            func.lower(models.User.role) == 'alumni',
            models.User.is_completed
        ), 1)])).label('Employed'),

        func.count(case([(and_(
            func.lower(models.User.present_employment_status) == 'self-employed',
            func.lower(models.User.role) == 'alumni',
            models.User.is_completed
        ), 1)])).label('Self-Employed'),

        func.count(case([(and_(
            func.lower(models.User.present_employment_status) == 'never been employed',
            func.lower(models.User.role) == 'alumni',
            models.User.is_completed
        ), 1)])).label('Never been Employed'),

        func.count(case([(and_(
            func.lower(models.User.present_employment_status) == 'unable to work',
            func.lower(models.User.role) == 'alumni',
            models.User.is_completed
        ), 1)])).label('Unable to Work'),

        func.count(case([(and_(
            func.lower(models.User.present_employment_status) == 'unemployed',
            func.lower(models.User.role) == 'alumni',
            models.User.is_completed
        ), 1)])).label('Unemployed')
    )

    results = query.one()

    response_data = {
        'responses': [
            {'id': key, 'label': key, 'value': value}
            for key, value in results._asdict().items()
            if value > 0
        ]
    }

    return response_data

@router.get("/overall/employment_contract/")
async def over_employment_contract(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    query = db.query(
        func.count(case([(and_(
            func.lower(models.Employment.employment_contract) == 'regular',
            models.User.is_completed,
            models.User.id == models.Employment.user_id
        ), 1)])).label('Regular'),

        func.count(case([(and_(
            func.lower(models.Employment.employment_contract) == 'casual',
            models.User.is_completed,
            models.User.id == models.Employment.user_id
        ), 1)])).label('Casual'),

        func.count(case([(and_(
            func.lower(models.Employment.employment_contract) == 'project',
            models.User.is_completed,
            models.User.id == models.Employment.user_id
        ), 1)])).label('Project'),

        func.count(case([(and_(
            func.lower(models.Employment.employment_contract) == 'seasonal',
            models.User.is_completed,
            models.User.id == models.Employment.user_id
        ), 1)])).label('Seasonal'),

        func.count(case([(and_(
            func.lower(models.Employment.employment_contract) == 'fixed-term',
            models.User.is_completed,
            models.User.id == models.Employment.user_id
        ), 1)])).label('Fixed-term'),

        func.count(case([(and_(
            func.lower(models.Employment.employment_contract) == 'probationary',
            models.User.is_completed
        ), 1)])).label('Probationary')
    )

    results = query.one()

    response_data = {
        'responses': [
            {'id': key, 'label': key, 'value': value}
            for key, value in results._asdict().items()
            if value > 0
        ]
    }

    return response_data

@router.get("/overall/employer_type/")
async def over_employer_type(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    query = db.query(
        func.count(case([(and_(
            func.lower(models.Employment.employer_type) == 'public / government',
            models.User.is_completed,
            models.User.id == models.Employment.user_id
        ), 1)])).label('Public / Government'),

        func.count(case([(and_(
            func.lower(models.Employment.employer_type) == 'private sector',
            models.User.is_completed,
            models.User.id == models.Employment.user_id
        ), 1)])).label('Private Sector'),

        func.count(case([(and_(
            func.lower(models.Employment.employer_type) == 'non-profit / third sector',
            models.User.is_completed,
            models.User.id == models.Employment.user_id
        ), 1)])).label('Non-profit / Third sector'),

        func.count(case([(and_(
            func.lower(models.Employment.employer_type) == 'self-employed / independent',
            models.User.is_completed,
            models.User.id == models.Employment.user_id
        ), 1)])).label('Self-Employed / Independent')
    )

    results = query.one()
    
    response_data = {
        'responses': [
            {'id': key, 'label': key, 'value': value}
            for key, value in results._asdict().items()
            if value > 0
        ]
    }

    return response_data

@router.get("/course_employment_rate/")
async def over_employer_type(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    courses = db.query(models.Course).filter(models.Course.in_pupqc == True).all()

    # Fetch all alumni users with completed courses
    alumni_users = db.query(models.User)\
                      .filter(models.User.role.ilike('alumni'), models.User.is_completed == True)\
                      .options(joinedload(models.User.course))\
                      .all()

    course_employment_rate = []
    for course in courses:
        course_users = [user for user in alumni_users if user.course_id == course.id]
        course_users_employed = sum(1 for user in course_users if user.present_employment_status in ['employed', 'self-employed'])
        users_count = len(course_users)
        
        if users_count == 0:
            continue

        course_employment_rate.append({
            "course_id": course.id,
            "course_code": course.code,
            "course_name": course.name,
            "users_count": users_count,
            "users_employed": course_users_employed,
            "employment_rate": round((course_users_employed / users_count) * 100)
        })
      
    return course_employment_rate

@router.get("/course_response_rate/recent_batch/")
async def over_employer_type(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):

    # Find the recent batch year directly from the database
    recent_batch_year = db.query(func.max(models.User.batch_year)).filter(models.User.role.ilike('alumni')).scalar()

    courses = db.query(models.Course).filter(models.Course.in_pupqc == True).all()
    course_response_rate = []

    for course in courses:
        course_users = db.query(models.User)\
                         .filter(models.User.role.ilike('alumni'), models.User.course_id == course.id, models.User.batch_year == recent_batch_year)\
                         .all()
        course_users_completed = sum(1 for user in course_users if user.is_completed)
        
        if len(course_users) == 0:
            continue
        
        course_response_rate.append({
            "course_id": course.id,
            "course_name": course.name,
            "course_code": course.code,
            "users_count": len(course_users),
            "users_completed": course_users_completed,
            "response_rate": round((course_users_completed / len(course_users)) * 100) if course_users else 0
        })
      
    return course_response_rate

@router.get("/all-batches")
async def current_batches(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    batch_years = db.query(models.User.batch_year.distinct().label("batch_year")) \
                    .filter(models.User.batch_year.isnot(None)) \
                    .order_by(models.User.batch_year.desc()) \
                    .all()
    # Include "All Batch Year" at the beginning of the list
    batch_years_list = ["All Batch Year"] + [result.batch_year for result in batch_years]

    return batch_years_list

@router.get("/respondents-list/{batch_year}/{course_code}")
async def get_respondents_list(
    batch_year: str,
    course_code: str,
    db: Session = Depends(get_db),
    user: UserResponse = Depends(get_current_user)
):
    batch_year = int(batch_year) if batch_year != "All Batch Year" else batch_year

    respondents = db.query(
        models.User.id,
        models.User.username,
        models.User.first_name.label('First Name'),
        models.User.last_name.label('Last Name'),
        case([(models.User.is_completed, literal_column("'Yes'"))], else_=literal_column("'No'")).label('Completed')
    ).join(models.Course).filter(
        and_(
            models.Course.code == course_code if not course_code == 'Overall' else True,
            models.User.role.ilike('alumni'),
            models.User.batch_year == batch_year if batch_year != "All Batch Year" else True
        )
    ).order_by(models.User.is_completed).all()
    return respondents

@router.get("/course_response_rate/{batch_year}")
async def over_employer_type(batch_year:  str, db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    # Fetch all courses where in_pupqc is True
    courses_response_rate = db.query(
        models.Course.id.label('course_id'),
        models.Course.name.label('course_name'),
        models.Course.code.label('course_code'),
        func.count().label('total_alumni_count'),
        func.sum(case([(models.User.is_completed, 1)], else_=0)).label('completed_alumni_count')
    ).join(
        models.User,
        models.User.course_id == models.Course.id
    ).filter(
        models.User.role.ilike('alumni'),
        models.Course.in_pupqc == True,
        models.User.batch_year == batch_year if batch_year != "All Batch Year" else True
    ).group_by(
        models.Course.id
    ).all()

    total_users_count = 0
    total_completed_count = 0
    course_response_rate = []

    for course_data in courses_response_rate:
        users_count = course_data.total_alumni_count
        completed_count = course_data.completed_alumni_count

        total_users_count += users_count
        total_completed_count += completed_count

        if users_count > 0:
            response_rate = round((completed_count / max(users_count, 1)) * 100)
            course_response_rate.append({
                "course_id": course_data.course_id,
                "course_name": course_data.course_name,
                "course_code": course_data.course_code,
                "users_count": users_count,
                "users_completed": completed_count,
                "response_rate": response_rate,
            })

    overall_response_rate = {
        "course_id": 0,
        "course_name": "All Alumnis under this Batch",
        "course_code": "Overall",
        "users_count": total_users_count,
        "users_completed": total_completed_count,
        "response_rate": round((total_completed_count / max(total_users_count, 1)) * 100),
    }
    course_response_rate.insert(0, overall_response_rate)

    return course_response_rate

@router.get("/classification_employment_rate/")
async def classification_employment_rate(db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    # Fetching unique batch years for alumni users who have completed their profiles
    batch_years = db.query(models.User.batch_year)\
                    .filter(models.User.is_completed == True, func.lower(models.User.role) == 'alumni')\
                    .distinct().all()
    batch_years = [batch_year[0] for batch_year in batch_years]

    # Fetching employments and classifications in a single query using joins
    employments_and_classifications = db.query(models.Employment, models.Classification)\
                                        .join(models.Employment.user)\
                                        .join(models.Employment.job)\
                                        .join(models.Job.classifications)\
                                        .filter(models.User.is_completed == True, func.lower(models.User.role) == 'alumni')\
                                        .all()

    # Initializing classification list
    classification_list = [
        {
            "classification_name": classification.name,
            "classification_code": classification.code,
            **{f"batch {batch_year}": 0 for batch_year in batch_years}
        } 
        for classification in set(classification for employment, classification in employments_and_classifications)
    ]

    # Counting employments for each classification and batch year
    for employment, classification in employments_and_classifications:
        user = employment.user
        matching_item = next(
            (item for item in classification_list if item["classification_name"] == classification.name),
            None
        )
        if matching_item:
            matching_item[f"batch {user.batch_year}"] += 1

    # Filtering out classifications with no employments
    final_classification_list = [
        classification for classification in classification_list
        if any(classification[f"batch {batch_year}"] != 0 for batch_year in batch_years)
    ]

    return {'classification': final_classification_list, 'keys': {f"batch {batch_year}" for batch_year in batch_years}}

@router.get("/salary_trend/{code}/{year}")
async def salary_trend(code: Optional[str] = "default_code", year: Optional[int] = 0, db: Session = Depends(get_db), user: UserResponse = Depends(get_current_user)):
    # Fetching employments and classifications in a single query using joins
    employments_and_classifications = db.query(
        models.Employment.date_hired,
        models.Employment.date_end,
        models.Employment.gross_monthly_income
    )\
        .join(models.Employment.user)\
        .join(models.User.course)\
        .filter(
        models.User.is_completed == True,
        (models.User.batch_year == year) if year != 0 else True,
        (models.Course.code == code) if code != "default_code" else True,
        func.lower(models.User.role) == 'alumni'
    )\
        .all()
    
    if not employments_and_classifications:
        return []

    # Find the span of date_hired
    min_date = min(employment.date_hired for employment in employments_and_classifications)
    max_date = max(employment.date_hired for employment in employments_and_classifications)

    # Define the income ranges
    income_ranges = ["₱18,200 to ₱36,400", "₱36,400 to ₱63,700", "₱63,700 to ₱109,200", "₱109,200 to ₱182,000", "Above ₱182,000"]
    date_interval = (max_date - min_date) / 10

    # Initialize a defaultdict to store counts for each income range within each date segment
    income_counts_by_date_segment = defaultdict(lambda: {range: 0 for range in income_ranges})

    # Loop through employments_and_classifications and count occurrences
    for i in range(10 if date_interval.days > 0 else 1):
        date_segment = min_date + timedelta(days=int((i + 1) * date_interval.days))
        for employment in employments_and_classifications:
            if employment.date_hired > date_segment: continue
            if employment.date_end and employment.date_end < date_segment: continue
            income_counts_by_date_segment[date_segment.strftime("%m/%Y")][employment.gross_monthly_income] += 1
        sorted_income_counts = sorted(income_counts_by_date_segment.items(), key=lambda x: datetime.strptime(x[0], "%m/%Y"))

    # Convert the defaultdict to the desired list of dictionaries format
    result = [
        {
            "date_name": date_segment,
            **income_counts,
        }
        for date_segment, income_counts in sorted_income_counts
    ]

    # Return the result
    return result


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