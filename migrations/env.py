from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

from backend.config import settings
from backend.models import Base


config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

config.set_main_option(
    "sqlalchemy.url", f"postgresql+psycopg2://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOSTNAME}:{settings.DATABASE_PORT}/{settings.POSTGRES_DB}")


def include_object(object, name, type_, reflected, compare_to):
    # List of tables to ignore
    ignored_tables = {
        'FISPDS_TrainingSeminars',
        'RISfull_manuscript',
        'SPSSubject',
        'FISPDS_TrainingSeminars'
        'RISfull_manuscript',
        'SPSSubject',
        'SPSCourseGrade',
        'SPSCurriculum',
        'FISAssignmentTypes',
        'FISPDS_TeacherInformation',
        'ix_oauth2_client_client_id',
        'oauth2_client',
        'RISannouncements',
        'FISPDS_WorkExperience',
        'SPSClassSubject',
        'FISCollaborationOpportunities',
        'SPSClassSubjectGrade',
        'FISCommittee',
        'FISEvaluations',
        'RIScopyright',
        'FISPDS_AdditionalQuestions',
        'RISresearch_types_assigned',
        'FISTeachingActivities',
        'FISPDS_Signature',
        'RISsection_assigned_prof',
        'FISPDS_OfficeShipsMemberships',
        'RIScomments',
        'ix_oauth2_token_refresh_token',
        'oauth2_token',
        'SPSClassGrade',
        'RISresearch_defense',
        'FISProfessionalDevelopment',
        'RISauthors',
        'FISFeedback',
        'FISMandatoryRequirements',
        'SPSStudentClassGrade',
        'FISTeachingAssignments',
        'FISPDS_CharacterReference',
        'FISMentoring',
        'RISrole',
        'FISPDS_ContactDetails',
        'FISAwards',
        'RISfaculty_research_papers',
        'FISAdmin',
        'FISPDS_OutstandingAchievements',
        'FISPDS_Eligibity',
        'FISPublications',
        'FISQualifications',
        'FISPDS_FamilyBackground',
        'FISPDS_VoluntaryWork',
        'RISworkflow_steps',
        'FISAdvising',
        'RISsections_course_assigned',
        'FISPDS_AgencyMembership',
        'ix_RISnavigation_role_id',
        'RISnavigation_role',
        'RISUsers',
        'FISLoginToken',
        'SPSSystemAdmin',
        'FISSystemAdmin',
        'FISFaculty',
        'RISresearch_papers',
        'RISethics',
        'RISnotifications',
        'FISConferences',
        'oauth2_code',
        'RISClass',
        'FISPDS_EducationalBackground',
        'FISPDS_PersonalDetails',
        'RISuser_role',
        'RISnavigation_class',
        'RISworkflow_class',
        'SPSClass',
        'RISworkflow',
        'SPSStudentClassSubjectGrade',
    }

    if type_ == "table" and name in ignored_tables:
        return False
    else:
        return True


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_object=include_object, 
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata,
            include_object=include_object,  
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
