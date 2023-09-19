"""brought back hashed pass denied auth0 attempt 

Revision ID: 913510565024
Revises: 7f020db9c638
Create Date: 2023-09-19 15:04:02.935235

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '913510565024'
down_revision: Union[str, None] = '7f020db9c638'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('users_auth0_user_id_key', 'users', type_='unique')
    op.drop_column('users', 'auth0_user_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('auth0_user_id', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.create_unique_constraint('users_auth0_user_id_key', 'users', ['auth0_user_id'])
    # ### end Alembic commands ###
