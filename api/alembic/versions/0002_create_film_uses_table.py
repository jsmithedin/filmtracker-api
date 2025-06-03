"""create film uses table

Revision ID: 0002
Revises: 0001
Create Date: 2024-01-02 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

revision = '0002'
down_revision = '0001'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'filmuse',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('date_used', sa.Date(), nullable=False),
        sa.Column('film_id', sa.String(length=36), sa.ForeignKey('film.id'), nullable=False),
        sa.Column('camera', sa.String(), nullable=False),
        sa.Column('location', sa.String(), nullable=False),
        sa.Column('developer', sa.String(), nullable=False),
        sa.Column('notes', sa.String(), nullable=True),
    )


def downgrade():
    op.drop_table('filmuse')
