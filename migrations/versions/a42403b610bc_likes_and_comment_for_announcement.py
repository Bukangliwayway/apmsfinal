"""likes and comment for announcement

Revision ID: a42403b610bc
Revises: 8834da6c9842
Create Date: 2024-02-13 15:11:24.412906

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'a42403b610bc'
down_revision: Union[str, None] = '8834da6c9842'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint('APMSLike_pkey', 'APMSLike', type_='primary')
    op.add_column('APMSComment', sa.Column('ESISPostId', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'APMSComment', 'ESISAnnouncement', ['ESISPostId'], ['AnnouncementId'], ondelete='CASCADE')
    op.add_column('APMSLike', sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False))
    op.add_column('APMSLike', sa.Column('ESISPostId', sa.Integer(), nullable=True))
    op.alter_column('APMSLike', 'LikerId',
               existing_type=postgresql.UUID(),
               nullable=True)
    op.alter_column('APMSLike', 'PostId',
               existing_type=postgresql.UUID(),
               nullable=True)
    op.create_foreign_key(None, 'APMSLike', 'ESISAnnouncement', ['ESISPostId'], ['AnnouncementId'], ondelete='CASCADE')
    # ### end Alembic commands ###

def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('APMSPost', sa.Column('Public', sa.BOOLEAN(), server_default=sa.text('false'), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'APMSLike', type_='foreignkey')
    op.alter_column('APMSLike', 'PostId',
               existing_type=postgresql.UUID(),
               nullable=False)
    op.alter_column('APMSLike', 'LikerId',
               existing_type=postgresql.UUID(),
               nullable=False)
    op.drop_column('APMSLike', 'ESISPostId')
    op.drop_column('APMSLike', 'id')
    op.drop_constraint(None, 'APMSComment', type_='foreignkey')
    op.drop_column('APMSComment', 'ESISPostId')
    op.add_column('APMSAchievement', sa.Column('ESISAchievement', sa.INTEGER(), autoincrement=False, nullable=True))
    op.create_foreign_key('fk_ESISActivity_ActivityId', 'APMSAchievement', 'ESISActivity', ['ESISAchievement'], ['ActivityId'])
    op.alter_column('APMSAchievement', 'Editable',
               existing_type=sa.BOOLEAN(),
               nullable=True,
               existing_server_default=sa.text('false'))
    # ### end Alembic commands ###