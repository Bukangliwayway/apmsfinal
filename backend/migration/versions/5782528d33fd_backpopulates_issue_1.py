"""backpopulates issue 1

Revision ID: 5782528d33fd
Revises: 54e23c1ae950
Create Date: 2023-09-19 15:11:23.138456

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5782528d33fd'
down_revision: Union[str, None] = '54e23c1ae950'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_foreign_key(None, 'users', 'academic_programs', ['academic_program_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'users', type_='foreignkey')
    # ### end Alembic commands ###
