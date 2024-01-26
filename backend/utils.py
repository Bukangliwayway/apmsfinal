from datetime import timedelta, datetime
from jose import JWTError, jwt
from passlib.context import CryptContext
from backend import models, schemas
from sqlalchemy.orm import Session
from backend.config import settings
import json
from passlib.hash import pbkdf2_sha256
from werkzeug.security import check_password_hash, generate_password_hash
import random
from backend import schemas, models

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return generate_password_hash(password)

def verify_password(*, password: str="", unhashed_original: str="", hashed_password: str):
    if unhashed_original: return unhashed_original == hash_password
    return check_password_hash(hashed_password,password)

def authenticate_user(*, username: str, password: str="", hashedPassword: str="", db: Session):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        user = db.query(models.User).filter(models.User.email == username).first()
        if not user:
            user = db.query(models.UniversityAdmin).filter(models.UniversityAdmin.Email == username).first()
            if user:
                username =  user.LastName
                base_username = user.LastName
                random_suffix = ''.join(str(random.randint(0, 9)) for _ in range(4))
                username = f"{base_username}{random_suffix}"

                # Check if the username already exists
                existing_user = db.query(models.User).filter_by(username=username).first()
                while existing_user:
                    random_suffix = ''.join(str(random.randint(0, 9)) for _ in range(4))
                    username = f"{base_username}{random_suffix}"
                    existing_user = db.query(models.User).filter_by(username=username).first()

                new_user = models.User(
                    first_name=user.FirstName,
                    last_name=user.LastName,
                    email=user.Email,
                    password=user.Password,
                    gender="male" if user.Gender == 1 else "female",
                    username=username,
                    birthdate=user.DateOfBirth,
                    origin_address=user.PlaceOfBirth,
                    address=user.ResidentialAddress,
                    mobile_number=user.MobileNumber,
                    role='admin',
                )
                db.add(new_user)
                db.commit()

                if hashedPassword:
                    if hashedPassword == user.Password:
                        return user
                
                if not check_password_hash(user.Password, password):
                    return False
                return user
            else:
                user = db.query(models.Student).filter(models.Student.Email == username).first()
                if user:
                    username =  user.LastName
                    base_username = user.LastName
                    random_suffix = ''.join(str(random.randint(0, 9)) for _ in range(4))
                    username = f"{base_username}{random_suffix}"

                    # Check if the username already exists
                    existing_user = db.query(models.User).filter_by(username=username).first()
                    while existing_user:
                        random_suffix = ''.join(str(random.randint(0, 9)) for _ in range(4))
                        username = f"{base_username}{random_suffix}"
                        existing_user = db.query(models.User).filter_by(username=username).first()

                    batch = (
                        db.query(models.Metadata.Batch)
                        .join(models.CourseEnrolled, models.Metadata.CourseId == models.CourseEnrolled.CourseId)
                        .filter(models.CourseEnrolled.StudentId == user.StudentId)
                        .join(models.StudentClassSubjectGrade, models.StudentClassSubjectGrade.StudentId == models.CourseEnrolled.StudentId)
                        .join(models.ClassSubject, models.StudentClassSubjectGrade.ClassSubjectId == models.ClassSubject.ClassSubjectId)
                        .join(models.Class, models.ClassSubject.ClassId == models.Class.ClassId)
                        .first()
                    )

                    courseId = db.query(models.Course.id).filter(models.CourseEnrolled.StudentId == user.id).first()
                    new_user = models.User(
                        student_number=user.StudentNumber,
                        first_name=user.FirstName,
                        last_name=user.LastName,
                        email=user.Email,
                        password=user.Password,
                        gender="male" if user.Gender == 1 else "female",
                        username=username,
                        birthdate=user.DateOfBirth,
                        origin_address=user.PlaceOfBirth,
                        address=user.ResidentialAddress,
                        mobile_number=user.MobileNumber,
                        course_id=courseId,
                        batch_year=batch,
                        role='alumni',
                    )

                    db.add(new_user)
                    db.commmit()

                    if hashedPassword:
                        if hashedPassword == user.Password:
                            return user
                    
                    if not check_password_hash(user.Password, password):
                        return False
                    return user


                else:
                    return False
    if hashedPassword:
        if hashedPassword == user.password:
            return user
    
    if not check_password_hash(user.password, password):
        return False
    return user

def create_token(user: models.User, is_refresh=False):
    expiration = settings.REFRESH_TOKEN_EXPIRES_IN if is_refresh else settings.ACCESS_TOKEN_EXPIRES_IN 
    user_obj = schemas.UserBaseSchema.model_validate(user.__dict__)
    payload = {"sub": json.dumps(user_obj.model_dump()), "exp": datetime.utcnow() + timedelta(minutes=expiration)}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def token_return(*, token: str, is_refresh=False, role: str, verified: str = "incomplete"):
    expiration = settings.REFRESH_TOKEN_EXPIRES_IN if is_refresh else settings.ACCESS_TOKEN_EXPIRES_IN 
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": role,
        "verified": verified,
        "expires": datetime.utcnow() + timedelta(minutes=expiration)
    }