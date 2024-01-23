from backend.database import get_db, engine
from datetime import datetime
import random
from backend import models
from sqlalchemy.event import listens_for
from sqlalchemy.orm import relationship, Session, sessionmaker


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@listens_for(models.CourseEnrolled, 'after_update')
def alumni_listenner(mapper, connection, target):
    # Check if the status has changed to 1 (graduated)
    if target.Status == 1:
        # Access the session from the target
        db = SessionLocal()

        # Fetch the corresponding student and course information
        student = db.query(models.Student).get(target.StudentId)
        course = db.query(models.Course).get(target.CourseId)
        email = student.email
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
            .filter(models.CourseEnrolled.StudentId == student.StudentId)
            .join(models.StudentClassSubjectGrade, models.StudentClassSubjectGrade.StudentId == models.CourseEnrolled.StudentId)
            .join(models.ClassSubject, models.StudentClassSubjectGrade.ClassSubjectId == models.ClassSubject.ClassSubjectId)
            .join(models.Class, models.ClassSubject.ClassId == models.Class.ClassId)
            .first()
        )

        if result:
            batch = result[0]
            print(f"The batch for StudentId {target.StudentId} is: {batch}")
            print(student)

        # Create a new User instance
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

@listens_for(models.UniversityAdmin, 'after_insert')
def admin_listenner(mapper, connection, target):
    # Access the session from the target
    db = SessionLocal()
    print('natry na ni joc hehzi')
    # Generate a unique username for UniversityAdmin
    base_username = target.LastName.lower()
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
        first_name=target.FirstName,
        last_name=target.LastName,
        email=target.Email,
        password=target.Password,
        gender="male" if target.Gender == 1 else "female",
        username=username,
        birthdate=target.DateOfBirth,
        origin_address=target.PlaceOfBirth,
        address=target.ResidentialAddress,
        mobile_number=target.MobileNumber,
        role='admin',
    )

    # Add the new user to the session and commit the changes
    db.add(new_user)
    db.commit()

