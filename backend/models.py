from fastapi import Body, Query, APIRouter, File, Form, status, Depends, HTTPException, UploadFile
from backend.database import get_db, engine
from datetime import datetime
import random
from fastapi import Depends
from sqlalchemy.event import listens_for
from backend.database import get_db, Base
import uuid
from sqlalchemy import TIMESTAMP, Column, String, Boolean, text, Boolean, ForeignKey, Integer, Date, Text, DateTime, Float
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship, Session, sessionmaker
from sqlalchemy.sql import func



class User(Base):
    __tablename__ = 'APMSUser'
    id = Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column('created_at', TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column('updated_at', TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column('deleted_at', TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    role = Column('Role', String, server_default='public', nullable=False, index=True)
    sub = Column('Sub', String, unique=True, index=True)
    password = Column('Password', String, nullable=False)
    reset_code = Column('ResetCode', String)
    is_completed = Column('IsCompleted', Boolean, nullable=False, server_default='False') 

    # Alumni information
    profile_picture = Column('ProfilePicture', String, server_default="#")
    username = Column('Username', String, unique=True, index=True)
    first_name = Column('FirstName', String)
    last_name = Column('LastName', String)
    student_number = Column('StudentNumber', String, unique=True, index=True)
    birthdate = Column('Birthdate', Date)
    civil_status = Column('CivilStatus', String)
    gender = Column('Gender', String)
    headline = Column('Headline', Text)

    # Contact details
    mobile_number = Column('MobileNumber', String)
    telephone_number = Column('TelephoneNumber', String)
    email = Column('Email', String, unique=True, index=True)

    # Current residence
    is_international = Column('IsInternational', Boolean, nullable=False, server_default='False') 
    address = Column('Address', String)
    country = Column('Country', String, server_default='philippines') 
    region = Column('Region', String)
    region_code = Column('RegionCode', String)
    city = Column('City', String)
    city_code = Column('CityCode', String)
    barangay = Column('Barangay', String)
    barangay_code = Column('BarangayCode', String)

    # Place of birth
    origin_is_international = Column('OriginIsInternational', Boolean, nullable=False, server_default='False')
    origin_address = Column('OriginAddress', String)
    origin_country = Column('OriginCountry', String, server_default='philippines') 
    origin_region = Column('OriginRegion', String)
    origin_city = Column('OriginCity', String)
    origin_barangay = Column('OriginBarangay', String)
    origin_region_code = Column('OriginRegionCode', String)
    origin_city_code = Column('OriginCityCode', String)
    origin_barangay_code = Column('OriginBarangayCode', String)

    # PUPQC Education Profile
    date_graduated = Column('DateGraduated', Date)
    batch_year = Column('BatchYear', Integer)
    post_grad_act = Column('PostGradAct', ARRAY(String))

    # Employment Status
    present_employment_status = Column('PresentEmploymentStatus', String, server_default="unanswered")
    unemployment_reason = Column('UnemploymentReason', ARRAY(String))

    course_id = Column('CourseId', Integer, ForeignKey('SPSCourse.CourseId', ondelete="CASCADE"))
    course = relationship("Course", back_populates="user", uselist=False)

    education = relationship("Education", back_populates="user")
    achievements = relationship("Achievement", back_populates="user")
    employment = relationship("Employment", back_populates="user")
    upload_history = relationship("UploadHistory", back_populates="user")
    post = relationship("Post", back_populates="uploader")
    interests_in_events = relationship("UserInterestEvent", back_populates="user")
    donations = relationship("Donation", back_populates="user", foreign_keys="Donation.user_id")
    approved_donations = relationship("Donation", back_populates="approver", foreign_keys="Donation.approver_id")
    like = relationship("Like", back_populates="liker")
    comment = relationship("Comment", back_populates="commenter")



class ESISAnnouncement(Base):
    __tablename__ = 'ESISAnnouncement'

    AnnouncementId = Column(Integer, primary_key=True, autoincrement=True)
    Title = Column(String)
    Content = Column(Text)
    CreatorId = Column(String)
    IsLive = Column(Boolean)
    Slug = Column(String)
    Created = Column(DateTime(timezone=True), server_default=func.now())
    Updated = Column(DateTime(timezone=True), onupdate=func.now())
    Recipient = Column(String)
    ImageUrl = Column(Text)
    ImageId = Column(String)
    ProjectId = Column(Integer)

class RISUsers(Base):
    __tablename__ = 'RISUsers'

    id = Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column('student_id', Integer, ForeignKey('SPSStudent.StudentId', ondelete="CASCADE"))

class RISauthors(Base):
    __tablename__ = 'RISauthors'

    id = Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    research_paper_id = Column('research_paper_id',  UUID(as_uuid=True), ForeignKey('RISresearch_papers.id', ondelete="CASCADE"))
    user_id = Column('user_id', UUID(as_uuid=True), ForeignKey('RISUsers.id', ondelete="CASCADE"))

class RISresearch_papers(Base):
    __tablename__ = 'RISresearch_papers'

    id = Column('id', UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column('title', String)
    research_type = Column('research_type', String)
    status = Column('status', String)
    file_path = Column('file_path', String)
    research_adviser = Column('research_adviser', String)
    extension = Column('extension', String)

class Student(Base):
    __tablename__ = 'SPSStudent'

    StudentId = Column(Integer, primary_key=True, autoincrement=True)
    StudentNumber = Column(String(30), unique=True, nullable=False)
    FirstName = Column(String(50), nullable=False)
    LastName = Column(String(50), nullable=False)
    MiddleName = Column(String(50))
    Email = Column(String(50), unique=True, nullable=False)
    Password = Column(String(256), nullable=False)
    Gender = Column(Integer, nullable=True)
    DateOfBirth = Column(Date)
    PlaceOfBirth = Column(String(50))
    ResidentialAddress = Column(String(50))
    MobileNumber = Column(String(11))
    enrollment = relationship("CourseEnrolled", back_populates="student")  # Add this line

class UniversityAdmin(Base):
    __tablename__ = 'SPSUniversityAdmin'

    UnivAdminId = Column(Integer, primary_key=True, autoincrement=True)
    UnivAdminNumber = Column(String(30), unique=True)
    FirstName = Column(String(50), nullable=False)
    LastName = Column(String(50), nullable=False)
    MiddleName = Column(String(50))
    Email = Column(String(50), unique=True, nullable=False)
    Password = Column(String(256), nullable=False)
    Gender = Column(Integer)
    DateOfBirth = Column(Date)
    PlaceOfBirth = Column(String(50))
    ResidentialAddress = Column(String(50))
    MobileNumber = Column(String(11))
    IsActive = Column(Boolean, default=True)



class Course(Base):
    __tablename__ = 'SPSCourse'

    id = Column('CourseId', Integer, primary_key=True, autoincrement=True)
    code = Column('CourseCode', String(10), unique=True)
    name = Column('Name', String(200), nullable=False)
    description = Column('Description', String(200))
    in_pupqc = Column('IsValidPUPQCCourses', Boolean, nullable=False, server_default='True')
    created_at = Column('created_at', DateTime, nullable=False, server_default='now()')
    updated_at = Column('updated_at', DateTime, nullable=False, server_default='now()')
    user = relationship("User", back_populates="course")
    education = relationship("Education", back_populates="course")
    classifications = relationship("Classification", secondary="APMSCourseClassification", back_populates="courses", overlaps="course_classifications")
    course_classifications = relationship("CourseClassification", back_populates="course", overlaps="classifications")
    enrollment = relationship("CourseEnrolled", back_populates="course")

class CourseEnrolled(Base):
    __tablename__ = 'SPSCourseEnrolled'

    CourseId = Column('CourseId', Integer, ForeignKey('SPSCourse.CourseId', ondelete="CASCADE"), primary_key=True)
    StudentId = Column('StudentId', Integer, ForeignKey('SPSStudent.StudentId', ondelete="CASCADE"), primary_key=True)
    DateEnrolled = Column('DateEnrolled', Date)
    Status = Column('Status', Integer, nullable=False)  # (0 - Not Graduated/Continuing ||  1 - Graduated  ||  2 - Drop  ||  3 - Transfer Course || 4 - Transfer School)
    CurriculumYear = Column('CurriculumYear', Integer, nullable=False)
    created_at = Column('created_at', DateTime, nullable=False, server_default='now()')
    updated_at = Column('updated_at', DateTime, nullable=False, server_default='now()')
    student = relationship("Student", back_populates="enrollment")
    course = relationship("Course", back_populates="enrollment") 

# Metadata containing the details of class such as Year, Semester, Batch and Course
class Metadata(Base):
    __tablename__ = 'SPSMetadata'

    MetadataId = Column(Integer, primary_key=True, autoincrement=True) # Unique Identifier
    CourseId = Column(Integer, ForeignKey('SPSCourse.CourseId', ondelete="CASCADE")) # Course References
    Year = Column(Integer, nullable=False) # (1, 2, 3, 4) - Current year of the class 
    Semester = Column(Integer, nullable=False) # (1, 2, 3) - Current semester of class
    Batch = Column(Integer, nullable=False) # (2019, 2020, 2021, ...) - Batch of the class
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)


class Achievement(Base):
    __tablename__ = 'APMSAchievement'

    id = Column('id', UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column('created_at', TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column('updated_at', TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column('deleted_at', TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    user_id = Column('UserId', UUID(as_uuid=True), ForeignKey('APMSUser.id', ondelete="CASCADE"))
    national_certification_id = Column('NationalCertificationId', UUID(as_uuid=True), ForeignKey('APMSNationalCertification.id', ondelete="CASCADE"))

    type_of_achievement = Column('TypeOfAchievement', String)
    date_of_attainment = Column('DateOfAttainment', Date)
    description = Column('Description', String)
    story = Column('Story', Text)
    link_reference = Column('LinkReference', String)
    third_party = Column('ThirdParty',Boolean, nullable=False, server_default='False') 

    user = relationship("User", back_populates="achievements")
    national_certification = relationship("NationalCertification", back_populates="achievements")

class NationalCertification(Base):
    __tablename__ = 'APMSNationalCertification'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    name = Column('Name', String)
    issuing_body = Column('IssuingBody', String)
    requirements = Column('Requirements', Text)
    link_reference = Column('LinkReference', String)
    achievements = relationship("Achievement", back_populates="national_certification")
    classifications = relationship("Classification", secondary="APMSNationalCertificationClassification", back_populates="national_certifications", overlaps="national_certification_classifications")
    national_certification_classifications = relationship("NationalCertificationClassification", back_populates="national_certification", overlaps="classifications")

class Education(Base):
    __tablename__ = 'APMSEducation'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    user_id = Column('UserId', UUID(as_uuid=True), ForeignKey('APMSUser.id', ondelete="CASCADE"))
    
    #School Info
    course_id = Column('CourseId', Integer, ForeignKey('SPSCourse.CourseId', ondelete="CASCADE"))
    level = Column('Level', String)
    school_name = Column('SchoolName',String)
    story = Column('Story', Text)

    #School Address
    is_international = Column('IsInternational',Boolean, nullable=False, server_default='False') 
    address = Column('Address',String)
    country = Column('Country',String, server_default='philippines') 
    region = Column('Region',String)
    city = Column('City',String)
    region_code = Column('RegionCode',String)
    city_code = Column('CityCode',String)

    #Date
    date_start =  Column('DateStart',Date)
    date_graduated = Column('DateGraduated', Date)

    user = relationship("User", back_populates="education")
    course = relationship("Course", back_populates="education", uselist=False)

class Employment(Base):
    __tablename__ = 'APMSEmployment'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    user_id = Column('UserId', UUID(as_uuid=True), ForeignKey('APMSUser.id', ondelete="CASCADE"))

    aligned_with_academic_program = Column('AlignedWithAcademicProgram',Boolean, nullable=False, server_default='False') 

    #Job Informations
    job_id = Column('JobId', UUID(as_uuid=True), ForeignKey('APMSJob.id', ondelete="CASCADE"))
    company_name = Column('CompanyName',String)
    
    #Job Length
    date_hired = Column('DateHired',Date, index=True)
    date_end = Column('DateEnd',Date) #null if an active job

    #Job Details
    finding_job_means = Column('FindingJobMeans',String)  
    gross_monthly_income = Column('GrossMonthlyIncome',String)  
    employment_contract = Column('EmploymentContract',String) 
    job_position = Column('JobPosition',String) 
    employer_type = Column('EmployerType',String)

    #Job Address
    is_international = Column('IsInternational',Boolean, nullable=False, server_default='False') 
    address = Column('Address',String)
    country = Column('Country',String, server_default='philippines') 
    region = Column('Region',String)
    city = Column('City',String)
    region_code = Column('RegionCode',String)
    city_code = Column('CityCode',String)

    job = relationship("Job", uselist=False, back_populates="employment")
    user = relationship("User", back_populates="employment")


class Job(Base):
    __tablename__ = 'APMSJob'

    id =  Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    name = Column('Name',String, nullable=False, index=True)
    employment = relationship("Employment", back_populates="job")
    classifications = relationship("Classification", secondary="APMSJobClassification", back_populates="jobs", overlaps="job_classifications")
    job_classifications = relationship("JobClassification", back_populates="job", overlaps="classifications")

class Classification(Base):
    __tablename__ = 'APMSClassification'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    name = Column('Name',String, nullable=False, index=True)
    code = Column('Code',String, nullable=False, index=True, unique=True)
    courses = relationship("Course", secondary="APMSCourseClassification", back_populates="classifications", overlaps="course_classifications")
    jobs = relationship("Job", secondary="APMSJobClassification", back_populates="classifications", overlaps="job_classifications")
    national_certifications = relationship("NationalCertification", secondary="APMSNationalCertificationClassification", back_populates="classifications", overlaps="national_certification_classifications")
    course_classifications = relationship("CourseClassification", back_populates="classification", overlaps="courses")
    job_classifications = relationship("JobClassification", back_populates="classification", overlaps="jobs")
    national_certification_classifications = relationship("NationalCertificationClassification", back_populates="classification", overlaps="national_certifications")

class CourseClassification(Base):
    __tablename__ = "APMSCourseClassification"
    course_id = Column('CourseId',Integer, ForeignKey('SPSCourse.CourseId', ondelete="CASCADE"), primary_key=True)
    classification_id = Column('ClassificationId', UUID(as_uuid=True), ForeignKey('APMSClassification.id', ondelete="CASCADE"), primary_key=True)
    course = relationship("Course", back_populates="course_classifications", overlaps="classifications,courses")
    classification = relationship("Classification", back_populates="course_classifications", overlaps="classifications,courses")

class JobClassification(Base):
    __tablename__ = "APMSJobClassification"

    job_id = Column('JobId',UUID(as_uuid=True), ForeignKey('APMSJob.id', ondelete="CASCADE"), primary_key=True)
    classification_id = Column('ClassificationId',UUID(as_uuid=True), ForeignKey('APMSClassification.id', ondelete="CASCADE"), primary_key=True)
    job = relationship("Job", back_populates="job_classifications", overlaps="classifications,jobs")
    classification = relationship("Classification", back_populates="job_classifications", overlaps="job_classifications,classifications,jobs")

class NationalCertificationClassification(Base):
    __tablename__ = "APMSNationalCertificationClassification"

    national_certification_id = Column('NationalCertificationId',UUID(as_uuid=True), ForeignKey('APMSNationalCertification.id', ondelete="CASCADE"), primary_key=True)
    classification_id = Column('ClassificationId',UUID(as_uuid=True), ForeignKey('APMSClassification.id', ondelete="CASCADE"), primary_key=True)
    national_certification = relationship("NationalCertification", back_populates="national_certification_classifications", overlaps="classifications,national_certifications")
    classification = relationship("Classification", back_populates="national_certification_classifications", overlaps="national_certification_classifications,classifications,national_certifications")

class UploadHistory(Base):
    __tablename__ = "APMSUploadHistory"

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    type = Column('Type',String) # Upload User or Employment or Achievement
    link = Column('Link',String) # The Cloudinary Link of the PDF table 
    user_id = Column('UserId',UUID(as_uuid=True), ForeignKey('APMSUser.id', ondelete="CASCADE")) #Uploaded by
    user = relationship("User", back_populates="upload_history")

class Post(Base):
    __tablename__ = 'APMSPost'
    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    deleted_at = Column(TIMESTAMP(timezone=True))  # Deletion timestamp (null if not deleted)
    title = Column('Title',String)
    content = Column('Content',Text)
    post_type = Column('PostType',String)  # Discriminator column
    img_link = Column('ImgLink',String)
    uploader_id = Column('UploaderId',UUID(as_uuid=True), ForeignKey('APMSUser.id', ondelete="CASCADE"))
    uploader = relationship("User", back_populates="post")
    like = relationship("Like", back_populates="post")
    comment = relationship("Comment", back_populates="post")

    __mapper_args__ = {
        'polymorphic_identity': 'post',
        'polymorphic_on': post_type
    }

class Announcement(Post):
    __tablename__ = 'APMSAnnouncement'
    id = Column(UUID(as_uuid=True), ForeignKey('APMSPost.id', ondelete="CASCADE"), primary_key=True)
    __mapper_args__ = {'polymorphic_identity': 'announcement'}

class News(Post):
    __tablename__ = 'APMSNews'
    id = Column(UUID(as_uuid=True), ForeignKey('APMSPost.id', ondelete="CASCADE"), primary_key=True)
    __mapper_args__ = {'polymorphic_identity': 'news'}

class Event(Post):
    __tablename__ = 'APMSEvent'
    id = Column(UUID(as_uuid=True), ForeignKey('APMSPost.id', ondelete="CASCADE"), primary_key=True)
    content_date = Column('ContentDate',Date)
    end_date = Column('EndDate',Date) # if event is longer than a day
    interested_count = Column('InterestedCount',Integer,server_default='0')
    interested_users = relationship("UserInterestEvent", back_populates="event")
    __mapper_args__ = {'polymorphic_identity': 'event'}

class Like(Base):
    __tablename__ = 'APMSLike'

    liker_id = Column('LikerId',UUID(as_uuid=True), ForeignKey('APMSUser.id', ondelete="CASCADE"), primary_key=True) #Uploaded by
    post_id = Column('PostId',UUID(as_uuid=True), ForeignKey('APMSPost.id', ondelete="CASCADE"), primary_key=True) #Uploaded by
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    post = relationship("Post", back_populates="like")
    liker = relationship("User", back_populates="like")

class Comment(Base):
    __tablename__ = 'APMSComment'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    commenter_id = Column('CommenterId',UUID(as_uuid=True), ForeignKey('APMSUser.id', ondelete="CASCADE")) #Uploaded by
    post_id = Column('PostId',UUID(as_uuid=True), ForeignKey('APMSPost.id', ondelete="CASCADE")) #Uploaded by
    comment = Column('Comment',Text)
    created_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    updated_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))
    post = relationship("Post", back_populates="comment")
    commenter = relationship("User", back_populates="comment")

class Donation(Base):
    __tablename__ = 'APMSDonation'

    id = Column(UUID(as_uuid=True), default=uuid.uuid4, primary_key=True)
    user_id = Column('UserId',UUID(as_uuid=True), ForeignKey('APMSUser.id', ondelete="CASCADE"))
    approver_id = Column('ApproverId',UUID(as_uuid=True), ForeignKey('APMSUser.id', ondelete="CASCADE"))
    fundraising_id = Column('FundraisingId',UUID(as_uuid=True), ForeignKey('APMSFundraising.id', ondelete="CASCADE"))
    comment = Column('Comment',Text)
    proof_of_donation = Column('ProofOfDonation',String) # must be a link
    donation_amount = Column('DonationAmount',Integer,server_default='0')
    approved_at = Column(TIMESTAMP(timezone=True), nullable=False, server_default=text("now()"))

    user = relationship("User", back_populates="donations", foreign_keys=[user_id])
    approver = relationship("User", back_populates="approved_donations", foreign_keys=[approver_id])
    fundraising = relationship("Fundraising", back_populates="donations", foreign_keys=[fundraising_id])


class Fundraising(Post):
    __tablename__ = 'APMSFundraising'
    id = Column(UUID(as_uuid=True), ForeignKey('APMSPost.id', ondelete="CASCADE"), primary_key=True)
    goal_amount = Column('GoalAmount',Integer)
    total_collected = Column('TotalCollected',Integer,server_default='0')
    fulfilled = Column('Fulfilled',Boolean, nullable=False, server_default='False')
    donors_count = Column('DonorsCount',Integer,server_default='0')
    donations = relationship("Donation", back_populates="fundraising")
    __mapper_args__ = {'polymorphic_identity': 'fundraising'}


class UserInterestEvent(Base):
    __tablename__ = 'APMSUserInterestEvent'

    user_id = Column('UserId',UUID(as_uuid=True), ForeignKey('APMSUser.id', ondelete="CASCADE"), primary_key=True)
    event_id = Column('EventId',UUID(as_uuid=True), ForeignKey('APMSEvent.id', ondelete="CASCADE"), primary_key=True)

    user = relationship("User", back_populates="interests_in_events")
    event = relationship("Event", back_populates="interested_users")


class ClassSubject(Base):
    __tablename__ = 'SPSClassSubject'

    ClassSubjectId = Column(Integer, primary_key=True, autoincrement=True) 
    ClassId = Column(Integer, ForeignKey('SPSClass.ClassId', ondelete="CASCADE")) # Referencing to the Class
    Schedule = Column(String(100), nullable=True) # Schedule of Subjects
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)



# Student Class Grade contains the average grade of student in class
class StudentClassSubjectGrade(Base):
    __tablename__ = 'SPSStudentClassSubjectGrade'

    # StudentClassSubjectGradeId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ClassSubjectId = Column(Integer, ForeignKey('SPSClassSubject.ClassSubjectId', ondelete="CASCADE"), primary_key=True) # Reference to the class subject
    StudentId = Column(Integer, ForeignKey('SPSStudent.StudentId', ondelete="CASCADE"), primary_key=True) # Referencing to the student in subject taken
    Grade = Column(Float) # Students Grade
    DateEnrolled = Column(Date) # Date enrolled in the subject
    AcademicStatus = Column(Integer) # (1 - Passed, 2 - Failed, 3 - Incomplete or INC,  4 - Withdrawn, 5 - ReEnroll )
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

class Class(Base):
    __tablename__ = 'SPSClass'

    ClassId = Column(Integer, primary_key=True, autoincrement=True)
    MetadataId = Column(Integer, ForeignKey('SPSMetadata.MetadataId', ondelete="CASCADE")) # Metadata containing details of class year, semester, batch, course
    Section = Column(Integer) # Section of the class
    IsGradeFinalized = Column(Boolean, default=False) # Checker if the grade is Finalized
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)


class SASSAddSubjects(Base):
    __tablename__ = 'SASSAddSubjects'

    updated_at = Column(TIMESTAMP)
    Subject = Column(String(255))
    StudentId = Column(Integer, primary_key=True, index=True)
    Status = Column(String(50))
    ServiceDetails = Column(Text)
    SenderName = Column(String(100))
    SenderContactNo = Column(String(20))
    Remarks = Column(Text)
    PaymentFile = Column(String(255))
    FacultyRole = Column(String(50))
    created_at = Column(TIMESTAMP)
    AddSubjectId = Column(Integer)