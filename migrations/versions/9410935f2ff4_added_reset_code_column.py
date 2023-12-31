"""added reset_code column

Revision ID: 9410935f2ff4
Revises: fce986221019
Create Date: 2023-12-09 04:53:00.273386

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9410935f2ff4'
down_revision: Union[str, None] = 'fce986221019'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('reset_code', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'reset_code')
    # ### end Alembic commands ###
