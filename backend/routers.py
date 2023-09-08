import bcrypt
from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from sqlalchemy.orm import Session
from database import SessionLocal, getDB
from typing import Annotated
from typing import List
import models
import schemas
import services

user_dependency = Annotated[dict, Depends(services.get_current_user)]

alumni_router = APIRouter(prefix="/alumni", tags=["alumni"])
officer_router = APIRouter(prefix="/officer", tags=["officer"])


@alumni_router.post("/", response_model=schemas.AlumniResponse)
async def create_alumni(alumni_create: schemas.AlumniCreate ,db: Session = Depends(getDB)):
    return await services.create_alumni(db, alumni_create)

@alumni_router.get("/{alumni_id}", response_model=schemas.AlumniDisplay)
async def read_alumni(alumni_id: int, user: user_dependency, db: Session = Depends(getDB)):
    return await services.read_alumni(alumni_id, db)

@officer_router.post("/", response_model=schemas.OfficerResponse)
async def create_officer(officer_create: schemas.OfficerCreate, db: Session = Depends(getDB)):
    return await services.create_officer(db, officer_create)


# @alumni_router.get("/", response_model=List[schemas.Alumni])
# def read_alumni(user: user_dependency, skip: int = 0, limit: int = 100):
#     # Add your logic here
#     pass
#     return None


# officers_router = APIRouter(prefix="/officers", tags=["officers"])

# @officers_router.post("/", response_model=schemas.Officer)
# def create_officer(user: user_dependency, officer: schemas.OfficerCreate):
#     # Add your logic here
#     pass

# @officers_router.get("/{officer_id}", response_model=schemas.Officer)
# def read_officer(user: user_dependency, officer_id: int):
#     # Add your logic here
#     pass

# @officers_router.get("/", response_model=List[schemas.Officer])
# def read_officers(user: user_dependency, skip: int = 0, limit: int = 100):
#     # Add your logic here
#     pass