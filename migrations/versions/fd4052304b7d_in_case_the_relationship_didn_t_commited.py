"""in case the relationship didn't commited

Revision ID: fd4052304b7d
Revises: 1eeebeaeaf6a
Create Date: 2023-11-23 13:57:43.210770

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fd4052304b7d'
down_revision: Union[str, None] = '1eeebeaeaf6a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###