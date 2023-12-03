"""updated uploadhistory

Revision ID: f19c30014e5b
Revises: 8162be0e2904
Create Date: 2023-12-02 12:56:56.004248

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'f19c30014e5b'
down_revision: Union[str, None] = '8162be0e2904'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('upload_history', sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True))
    op.execute('ALTER TABLE upload_history ALTER COLUMN "group" TYPE INTEGER USING "group"::integer')
    op.create_foreign_key(None, 'upload_history', 'user', ['user_id'], ['id'], ondelete='CASCADE')
    op.drop_column('upload_history', 'state')
    # ### end Alembic commands ###

def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('upload_history', sa.Column('state', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'upload_history', type_='foreignkey')
    op.alter_column('upload_history', 'group',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(),
               nullable=True,
               autoincrement=True)
    op.drop_column('upload_history', 'user_id')
    # ### end Alembic commands ###
