"""create films table

Revision ID: 0001
Revises: 
Create Date: 2024-01-01 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = '0001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'film',
        sa.Column('id', sa.String(length=36), primary_key=True),
        sa.Column('manufacturer', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('type', sa.String(), nullable=False),
        sa.Column('format', sa.String(), nullable=False),
        sa.Column('iso', sa.Integer(), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False, default=0)
    )

def downgrade():
    op.drop_table('film')
