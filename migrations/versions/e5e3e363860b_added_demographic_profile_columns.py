"""added demographic profile columns

Revision ID: e5e3e363860b
Revises: 0a75274169cc
Create Date: 2023-10-10 15:07:10.797241

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e5e3e363860b'
down_revision: Union[str, None] = '0a75274169cc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('headline', sa.Text(), nullable=True))
    op.add_column('users', sa.Column('region', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'region')
    op.drop_column('users', 'headline')
    # ### end Alembic commands ###
