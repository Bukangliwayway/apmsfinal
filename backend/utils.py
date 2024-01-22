from datetime import timedelta, datetime
from jose import JWTError, jwt
from passlib.context import CryptContext
from backend import models, schemas
from sqlalchemy.orm import Session
from backend.config import settings
import json
from passlib.hash import pbkdf2_sha256
from werkzeug.security import check_password_hash, generate_password_hash



bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return generate_password_hash(password)
    # return bcrypt_context.hash(password)


def verify_password(*, password: str="", unhashed_original: str="", hashed_password: str):
    if unhashed_original: return unhashed_original == hash_password
    return check_password_hash(hashed_password,password)
    # return bcrypt_context.verify(password, hashed_password)

def authenticate_user(*, username: str, password: str="", hashedPassword: str="", db: Session):
    user = db.query(models.User).filter(models.User.username == username).first()
    
    if not user:
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