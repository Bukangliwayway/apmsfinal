from datetime import datetime
import uuid
from pydantic import BaseModel, EmailStr, constr, validator
from fastapi import HTTPException

class UserBaseSchema(BaseModel):
    username: str
    email: EmailStr
    profile_picture: str
    first_name: str
    last_name: str
    profile_picture: str = "#"
    role: str

    class Config:
        from_attributes = True

class CreateUserSchema(UserBaseSchema):
    passwordConfirm: str
    role: str 
    verified: bool 
    password: constr(min_length=8) # type: ignore

    @validator("password")
    def validate_password_complexity(cls, value):
        # Minimum length requirement
        min_length = 8
        if len(value) < min_length:
            raise HTTPException(
                status_code=400,
                detail=f"Password must be at least {min_length} characters long.",
            )

        # Check for at least one digit
        if not any(char.isdigit() for char in value):
            raise HTTPException(
                status_code=400, detail=f"Password must contain at least one digit."
            )

        # Check for at least one special character
        special_characters = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/"
        if not any(char in special_characters for char in value):
            raise HTTPException(
                status_code=400,
                detail=f"Password must contain at least one special character.",
            )

        return value

class LoginUserSchema(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    expires: datetime 


class UserResponse(UserBaseSchema):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime