"""updates with enums 4

Revision ID: 2db958219c63
Revises: 3611a485e73b
Create Date: 2023-09-14 15:44:21.637276

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '2db958219c63'
down_revision: Union[str, None] = '3611a485e73b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('academic_programs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_academic_programs_id'), 'academic_programs', ['id'], unique=False)
    op.create_index(op.f('ix_academic_programs_name'), 'academic_programs', ['name'], unique=True)
    op.create_table('anonymous_feedbacks',
    sa.Column('area', sa.String(), nullable=True),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('star_rating', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('message', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('prc_certifications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('board_name', sa.String(), nullable=True),
    sa.Column('prc_title', sa.String(), nullable=True),
    sa.Column('logo', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('board_name'),
    sa.UniqueConstraint('prc_title')
    )
    op.create_table('alumni_certifications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('prc_certification_id', sa.Integer(), nullable=False),
    sa.Column('certificate_number', sa.String(), nullable=True),
    sa.Column('certification_date', sa.Date(), nullable=True),
    sa.Column('certification_authority', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['prc_certification_id'], ['prc_certifications.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('employment',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('alumni_id', sa.Integer(), nullable=True),
    sa.Column('company_name', sa.String(), nullable=False),
    sa.Column('job_title', sa.String(), nullable=False),
    sa.Column('date_hired', sa.Date(), nullable=False),
    sa.Column('date_end', sa.Date(), nullable=True),
    sa.Column('classification', sa.String(), nullable=True),
    sa.Column('aligned_with_academic_program', sa.Boolean(), nullable=True),
    sa.Column('gross_monthly_income', sa.String(), nullable=True),
    sa.Column('employment_contract', sa.String(), nullable=True),
    sa.Column('job_level_position', sa.String(), nullable=True),
    sa.Column('type_of_employer', sa.String(), nullable=True),
    sa.Column('location_of_employment', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('deleted_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['alumni_id'], ['alumni.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('feedbacks',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('alumni_id', sa.Integer(), nullable=True),
    sa.Column('area', sa.String(), nullable=False),
    sa.Column('star_rating', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('message', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('deleted_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['alumni_id'], ['alumni.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('special_skills_certifications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('alumni_id', sa.Integer(), nullable=True),
    sa.Column('file_name', sa.String(), nullable=False),
    sa.Column('file_url', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('deleted_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['alumni_id'], ['alumni.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_index('ix_officers_id', table_name='officers')
    op.drop_table('officers')
    op.add_column('alumni', sa.Column('student_number', sa.String(), nullable=False))
    op.add_column('alumni', sa.Column('birthdate', sa.Date(), nullable=False))
    op.add_column('alumni', sa.Column('first_name', sa.String(), nullable=False))
    op.add_column('alumni', sa.Column('last_name', sa.String(), nullable=False))
    op.add_column('alumni', sa.Column('middle_name', sa.String(), nullable=True))
    op.add_column('alumni', sa.Column('region', sa.String(), nullable=True))
    op.add_column('alumni', sa.Column('district', sa.String(), nullable=True))
    op.add_column('alumni', sa.Column('city', sa.String(), nullable=True))
    op.add_column('alumni', sa.Column('barangay', sa.String(), nullable=True))
    op.add_column('alumni', sa.Column('year_graduated', sa.Integer(), nullable=False))
    op.add_column('alumni', sa.Column('telephone_number', sa.String(), nullable=True))
    op.add_column('alumni', sa.Column('mobile_number', sa.String(), nullable=True))
    op.add_column('alumni', sa.Column('email_address', sa.String(), nullable=True))
    op.add_column('alumni', sa.Column('civil_status', sa.String(), nullable=True))
    op.add_column('alumni', sa.Column('sex', sa.String(), nullable=True))
    op.add_column('alumni', sa.Column('academic_program_id', sa.Integer(), nullable=True))
    op.add_column('alumni', sa.Column('prc_certified', sa.Boolean(), nullable=True))
    op.add_column('alumni', sa.Column('civil_service_eligibility', sa.Boolean(), nullable=True))
    op.add_column('alumni', sa.Column('present_employment_status', sa.String(), nullable=True))
    op.create_unique_constraint(None, 'alumni', ['student_number'])
    op.create_foreign_key(None, 'alumni', 'academic_programs', ['academic_program_id'], ['id'])
    op.drop_column('alumni', 'degree')
    op.drop_column('alumni', 'course')
    op.drop_column('alumni', 'batch_year')
    op.add_column('users', sa.Column('created_at', sa.DateTime(), nullable=True))
    op.add_column('users', sa.Column('updated_at', sa.DateTime(), nullable=True))
    op.add_column('users', sa.Column('deleted_at', sa.DateTime(), nullable=True))
    op.add_column('users', sa.Column('is_alumni', sa.Boolean(), nullable=True))
    op.add_column('users', sa.Column('is_officer', sa.Boolean(), nullable=True))
    op.drop_column('users', 'date_created')
    op.drop_column('users', 'date_updated')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('date_updated', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.add_column('users', sa.Column('date_created', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
    op.drop_column('users', 'is_officer')
    op.drop_column('users', 'is_alumni')
    op.drop_column('users', 'deleted_at')
    op.drop_column('users', 'updated_at')
    op.drop_column('users', 'created_at')
    op.add_column('alumni', sa.Column('batch_year', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('alumni', sa.Column('course', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('alumni', sa.Column('degree', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'alumni', type_='foreignkey')
    op.drop_constraint(None, 'alumni', type_='unique')
    op.drop_column('alumni', 'present_employment_status')
    op.drop_column('alumni', 'civil_service_eligibility')
    op.drop_column('alumni', 'prc_certified')
    op.drop_column('alumni', 'academic_program_id')
    op.drop_column('alumni', 'sex')
    op.drop_column('alumni', 'civil_status')
    op.drop_column('alumni', 'email_address')
    op.drop_column('alumni', 'mobile_number')
    op.drop_column('alumni', 'telephone_number')
    op.drop_column('alumni', 'year_graduated')
    op.drop_column('alumni', 'barangay')
    op.drop_column('alumni', 'city')
    op.drop_column('alumni', 'district')
    op.drop_column('alumni', 'region')
    op.drop_column('alumni', 'middle_name')
    op.drop_column('alumni', 'last_name')
    op.drop_column('alumni', 'first_name')
    op.drop_column('alumni', 'birthdate')
    op.drop_column('alumni', 'student_number')
    op.create_table('officers',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('is_admin', sa.BOOLEAN(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name='officers_user_id_fkey', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='officers_pkey'),
    sa.UniqueConstraint('user_id', name='officers_user_id_key')
    )
    op.create_index('ix_officers_id', 'officers', ['id'], unique=False)
    op.drop_table('special_skills_certifications')
    op.drop_table('feedbacks')
    op.drop_table('employment')
    op.drop_table('alumni_certifications')
    op.drop_table('prc_certifications')
    op.drop_table('anonymous_feedbacks')
    op.drop_index(op.f('ix_academic_programs_name'), table_name='academic_programs')
    op.drop_index(op.f('ix_academic_programs_id'), table_name='academic_programs')
    op.drop_table('academic_programs')
    # ### end Alembic commands ###
