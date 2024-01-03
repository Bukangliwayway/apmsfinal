"""changes in post tables

Revision ID: ed87a08b3f2c
Revises: b988cbf3f5cb
Create Date: 2024-01-03 09:03:35.965425

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'ed87a08b3f2c'
down_revision: Union[str, None] = 'b988cbf3f5cb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('donation',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column('fundraising_id', postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column('comment', sa.Text(), nullable=True),
    sa.Column('proof_of_donation', sa.String(), nullable=True),
    sa.Column('donation_amount', sa.Integer(), server_default='0', nullable=True),
    sa.Column('approved_by_user_id', postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column('approved_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['approved_by_user_id'], ['user.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['fundraising_id'], ['fundraising.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('fundraising_donation')
    op.add_column('event', sa.Column('start_date', sa.Date(), nullable=True))
    op.add_column('event', sa.Column('end_date', sa.Date(), nullable=True))
    op.drop_column('event', 'event_date')
    op.drop_column('fundraising', 'start_date')
    op.drop_column('fundraising', 'end_date')
    op.add_column('post', sa.Column('content_date', sa.Date(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('post', 'content_date')
    op.add_column('fundraising', sa.Column('end_date', sa.DATE(), autoincrement=False, nullable=True))
    op.add_column('fundraising', sa.Column('start_date', sa.DATE(), autoincrement=False, nullable=True))
    op.add_column('event', sa.Column('event_date', sa.DATE(), autoincrement=False, nullable=True))
    op.drop_column('event', 'end_date')
    op.drop_column('event', 'start_date')
    op.create_table('fundraising_donation',
    sa.Column('id', postgresql.UUID(), autoincrement=False, nullable=False),
    sa.Column('user_id', postgresql.UUID(), autoincrement=False, nullable=True),
    sa.Column('fundraising_id', postgresql.UUID(), autoincrement=False, nullable=True),
    sa.Column('comment', sa.TEXT(), autoincrement=False, nullable=True),
    sa.Column('donation_amount', sa.INTEGER(), server_default=sa.text('0'), autoincrement=False, nullable=True),
    sa.Column('approved_by_user_id', postgresql.UUID(), autoincrement=False, nullable=True),
    sa.Column('approved_at', postgresql.TIMESTAMP(timezone=True), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['approved_by_user_id'], ['user.id'], name='fundraising_donation_approved_by_user_id_fkey', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['fundraising_id'], ['fundraising.id'], name='fundraising_donation_fundraising_id_fkey', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='fundraising_donation_user_id_fkey', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id', name='fundraising_donation_pkey')
    )
    op.drop_table('donation')
    # ### end Alembic commands ###
