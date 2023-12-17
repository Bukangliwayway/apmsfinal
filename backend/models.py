from fastapi import Depends
from backend.database import get_db, Base
from sqlalchemy.orm import Session
import uuid
from sqlalchemy import TIMESTAMP, Column, String, Boolean, text, Boolean, ForeignKey, Integer, Date, Text
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'user'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    role = Column(String, server_default='public', nullable=False, index=True)
    sub = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)
    reset_code = Column(String)

    #alumni information
    profile_picture = Column(String, server_default="#")
    username = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    student_number = Column(String, unique=True, index=True)
    birthdate = Column(Date)
    civil_status = Column(String)
    gender = Column(String)
    headline = Column(Text)

    #contact details
    mobile_number = Column(String)
    telephone_number = Column(String)
    email = Column(String, unique=True, index=True)

    #current residence
    is_international = Column(Boolean, nullable=False, server_default='False') 
    address = Column(String)
    country = Column(String, server_default='philippines') 
    region = Column(String)
    region_code = Column(String)
    city = Column(String)
    city_code = Column(String)
    barangay = Column(String)
    barangay_code = Column(String)

    #place of birth
    origin_is_international = Column(Boolean, nullable=False, server_default='False')
    origin_address = Column(String)
    origin_country = Column(String, server_default='philippines') 
    origin_region = Column(String)
    origin_city = Column(String)
    origin_barangay = Column(String)
    origin_region_code = Column(String)
    origin_city_code = Column(String)
    origin_barangay_code = Column(String)

    #PUPQC Education Profile
    date_graduated = Column(Date)
    post_grad_act = Column(ARRAY(String))

    #Employment Status
    present_employment_status = Column(String, server_default="unanswered")
    unemployment_reason = Column(ARRAY(String))

    course_id = Column(UUID(as_uuid=True), ForeignKey('course.id', ondelete="CASCADE"))
    course = relationship("Course", back_populates="user", uselist=False)

    education = relationship("Education", back_populates="user")
    achievement = relationship("Achievement", back_populates="user")
    employment = relationship("Employment", back_populates="user")
    upload_history = relationship("UploadHistory", back_populates="user")


class Achievement(Base):
    __tablename__ = 'achievement'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id', ondelete="CASCADE"))
    national_certification_id = Column(UUID(as_uuid=True), ForeignKey('national_certification.id', ondelete="CASCADE"))

    type_of_achievement = Column(String)
    date_of_attainment =  Column(Date)
    description = Column(String)
    story = Column(Text)
    link_reference = Column(String)
    user = relationship("User", back_populates="achievement")
    national_certification = relationship("NationalCertification", back_populates="achievements")

class NationalCertification(Base):
    __tablename__ = 'national_certification'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    name = Column(String)
    issuing_body = Column(String)
    requirements = Column(Text)
    link_reference = Column(String)
    achievements = relationship("Achievement", back_populates="national_certification")
    classifications = relationship("Classification", secondary="national_certification_classification", back_populates="national_certifications", overlaps="national_certification_classifications")
    national_certification_classifications = relationship("NationalCertificationClassification", back_populates="national_certification", overlaps="classifications")


class Education(Base):
    __tablename__ = 'education'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id', ondelete="CASCADE"))
    
    #School Info
    course_id = Column(UUID(as_uuid=True), ForeignKey('course.id', ondelete="CASCADE"))
    level = Column(String)
    school_name = Column(String)
    story = Column(Text)

    #School Address
    is_international = Column(Boolean, nullable=False, server_default='False') 
    address = Column(String)
    country = Column(String, server_default='philippines') 
    region = Column(String)
    city = Column(String)
    region_code = Column(String)
    city_code = Column(String)

    #Date
    date_start =  Column(Date)
    date_graduated = Column(Date)

    user = relationship("User", back_populates="education")
    course = relationship("Course", back_populates="education", uselist=False)

class Employment(Base):
    __tablename__ = 'employment'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id', ondelete="CASCADE"))

    #Job Informations
    job_id = Column(UUID(as_uuid=True), ForeignKey('job.id', ondelete="CASCADE"))
    company_name = Column(String)
    
    #Job Length
    date_hired = Column(Date, index=True)
    date_end = Column(Date) #null if an active job

    #Job Details
    finding_job_means = Column(String)  
    gross_monthly_income = Column(String)  
    employment_contract = Column(String) 
    job_position = Column(String) 
    employer_type = Column(String)

    #Job Address
    is_international = Column(Boolean, nullable=False, server_default='False') 
    address = Column(String, index=True)
    country = Column(String, server_default='philippines') 
    region = Column(String) 
    region_code = Column(String) 
    city = Column(String, index=True)
    city_code = Column(String)

    job = relationship("Job", uselist=False, back_populates="employment")
    user = relationship("User", back_populates="employment")

class Job(Base):
    __tablename__ = 'job'

    id =  Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    name = Column(String, nullable=False, index=True)
    employment = relationship("Employment", back_populates="job")
    classifications = relationship("Classification", secondary="job_classification", back_populates="jobs", overlaps="job_classifications")
    job_classifications = relationship("JobClassification", back_populates="job", overlaps="classifications")

class Course(Base):
    __tablename__ = 'course'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    name = Column(String, nullable=False, index=True)
    in_pupqc = Column(Boolean, nullable=False, server_default='False')
    user = relationship("User", back_populates="course")
    education = relationship("Education", back_populates="course")
    classifications = relationship("Classification", secondary="course_classification", back_populates="courses", overlaps="course_classifications")
    course_classifications = relationship("CourseClassification", back_populates="course", overlaps="classifications")

class Classification(Base):
    __tablename__ = 'classification'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    name = Column(String, nullable=False, index=True)
    code = Column(String, nullable=False, index=True, unique=True)
    courses = relationship("Course", secondary="course_classification", back_populates="classifications", overlaps="course_classifications")
    jobs = relationship("Job", secondary="job_classification", back_populates="classifications", overlaps="job_classifications")
    national_certifications = relationship("NationalCertification", secondary="national_certification_classification", back_populates="classifications", overlaps="national_certification_classifications")
    course_classifications = relationship("CourseClassification", back_populates="classification", overlaps="courses")
    job_classifications = relationship("JobClassification", back_populates="classification", overlaps="jobs")
    national_certification_classifications = relationship("NationalCertificationClassification", back_populates="classification", overlaps="national_certifications")

class CourseClassification(Base):
    __tablename__ = "course_classification"

    course_id = Column(UUID(as_uuid=True), ForeignKey('course.id', ondelete="CASCADE"), primary_key=True)
    classification_id = Column(UUID(as_uuid=True), ForeignKey('classification.id', ondelete="CASCADE"), primary_key=True)
    course = relationship("Course", back_populates="course_classifications", overlaps="classifications,courses")
    classification = relationship("Classification", back_populates="course_classifications", overlaps="classifications,courses")

class JobClassification(Base):
    __tablename__ = "job_classification"

    job_id = Column(UUID(as_uuid=True), ForeignKey('job.id', ondelete="CASCADE"), primary_key=True)
    classification_id = Column(UUID(as_uuid=True), ForeignKey('classification.id', ondelete="CASCADE"), primary_key=True)
    job = relationship("Job", back_populates="job_classifications", overlaps="classifications,jobs")
    classification = relationship("Classification", back_populates="job_classifications", overlaps="job_classifications,classifications,jobs")

class NationalCertificationClassification(Base):
    __tablename__ = "national_certification_classification"

    national_certification_id = Column(UUID(as_uuid=True), ForeignKey('national_certification.id', ondelete="CASCADE"), primary_key=True)
    classification_id = Column(UUID(as_uuid=True), ForeignKey('classification.id', ondelete="CASCADE"), primary_key=True)
    national_certification = relationship("NationalCertification", back_populates="national_certification_classifications", overlaps="classifications,national_certifications")
    classification = relationship("Classification", back_populates="national_certification_classifications", overlaps="national_certification_classifications,classifications,national_certifications")

class UploadHistory(Base):
    __tablename__ = "upload_history"

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    type = Column(String) # Upload User or Employment or Achievement
    link = Column(String) # The Cloudinary Link of the PDF table 
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id', ondelete="CASCADE")) #Uploaded by
    user = relationship("User", back_populates="upload_history")