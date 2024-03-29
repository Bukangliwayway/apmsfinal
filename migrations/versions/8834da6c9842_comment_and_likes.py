"""comment and likes

Revision ID: 8834da6c9842
Revises: a7bbb00a2297
Create Date: 2024-02-05 02:50:38.902767

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '8834da6c9842'
down_revision: Union[str, None] = 'a7bbb00a2297'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('APMSComment',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('CommenterId', postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column('PostId', postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column('Comment', sa.Text(), nullable=True),
    sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['CommenterId'], ['APMSUser.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['PostId'], ['APMSPost.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('APMSLike',
    sa.Column('LikerId', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('PostId', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['LikerId'], ['APMSUser.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['PostId'], ['APMSPost.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('LikerId', 'PostId')
    )
    
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('APMSLike')
    op.drop_table('APMSComment')
    # ### end Alembic commands ###
