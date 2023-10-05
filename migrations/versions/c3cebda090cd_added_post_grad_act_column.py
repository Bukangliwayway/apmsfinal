"""added post_grad_act column

Revision ID: c3cebda090cd
Revises: cfd1f74f0798
Create Date: 2023-10-03 01:21:05.720414

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'c3cebda090cd'
down_revision: Union[str, None] = 'cfd1f74f0798'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('post_grad_act', postgresql.ARRAY(sa.String()), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'post_grad_act')
    # ### end Alembic commands ###
