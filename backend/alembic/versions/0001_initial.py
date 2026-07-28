"""Initial Supabase Schema

Revision ID: 0001_initial
Revises: 
Create Date: 2026-07-27 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # app_settings
    op.create_table('app_settings',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('device_id', sa.String(), nullable=False),
    sa.Column('language', sa.String(), nullable=True),
    sa.Column('theme', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_app_settings_device_id'), 'app_settings', ['device_id'], unique=True)
    op.create_index(op.f('ix_app_settings_id'), 'app_settings', ['id'], unique=False)

    # homework_history
    op.create_table('homework_history',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('device_id', sa.String(), nullable=True),
    sa.Column('future_user_id', sa.String(), nullable=True),
    sa.Column('filename', sa.String(), nullable=False),
    sa.Column('subject', sa.String(), nullable=True),
    sa.Column('worksheet_title', sa.String(), nullable=True),
    sa.Column('thumbnail_url', sa.Text(), nullable=True),
    sa.Column('question_count', sa.Integer(), nullable=True),
    sa.Column('image_width', sa.Integer(), nullable=True),
    sa.Column('image_height', sa.Integer(), nullable=True),
    sa.Column('processing_time_ms', sa.Integer(), nullable=True),
    sa.Column('status', sa.String(), nullable=True),
    sa.Column('gemini_model', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_homework_history_created_at'), 'homework_history', ['created_at'], unique=False)
    op.create_index(op.f('ix_homework_history_deleted_at'), 'homework_history', ['deleted_at'], unique=False)
    op.create_index(op.f('ix_homework_history_device_id'), 'homework_history', ['device_id'], unique=False)
    op.create_index(op.f('ix_homework_history_future_user_id'), 'homework_history', ['future_user_id'], unique=False)
    op.create_index(op.f('ix_homework_history_id'), 'homework_history', ['id'], unique=False)
    op.create_index(op.f('ix_homework_history_status'), 'homework_history', ['status'], unique=False)
    op.create_index(op.f('ix_homework_history_subject'), 'homework_history', ['subject'], unique=False)
    op.create_index(op.f('ix_homework_history_worksheet_title'), 'homework_history', ['worksheet_title'], unique=False)

    # worksheet_questions
    op.create_table('worksheet_questions',
    sa.Column('id', sa.String(), nullable=False),
    sa.Column('history_id', sa.String(), nullable=True),
    sa.Column('question_number', sa.Integer(), nullable=False),
    sa.Column('question_type', sa.String(), nullable=True),
    sa.Column('question', sa.Text(), nullable=False),
    sa.Column('answer', sa.Text(), nullable=False),
    sa.Column('write_this', sa.Text(), nullable=True),
    sa.Column('explanation', sa.JSON(), nullable=True),
    sa.Column('color', sa.String(), nullable=True),
    sa.Column('shape', sa.String(), nullable=True),
    sa.Column('metadata_json', sa.JSON(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['history_id'], ['homework_history.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_worksheet_questions_history_id'), 'worksheet_questions', ['history_id'], unique=False)
    op.create_index(op.f('ix_worksheet_questions_id'), 'worksheet_questions', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_worksheet_questions_id'), table_name='worksheet_questions')
    op.drop_index(op.f('ix_worksheet_questions_history_id'), table_name='worksheet_questions')
    op.drop_table('worksheet_questions')
    
    op.drop_index(op.f('ix_homework_history_worksheet_title'), table_name='homework_history')
    op.drop_index(op.f('ix_homework_history_subject'), table_name='homework_history')
    op.drop_index(op.f('ix_homework_history_status'), table_name='homework_history')
    op.drop_index(op.f('ix_homework_history_id'), table_name='homework_history')
    op.drop_index(op.f('ix_homework_history_future_user_id'), table_name='homework_history')
    op.drop_index(op.f('ix_homework_history_device_id'), table_name='homework_history')
    op.drop_index(op.f('ix_homework_history_deleted_at'), table_name='homework_history')
    op.drop_index(op.f('ix_homework_history_created_at'), table_name='homework_history')
    op.drop_table('homework_history')
    
    op.drop_index(op.f('ix_app_settings_id'), table_name='app_settings')
    op.drop_index(op.f('ix_app_settings_device_id'), table_name='app_settings')
    op.drop_table('app_settings')
