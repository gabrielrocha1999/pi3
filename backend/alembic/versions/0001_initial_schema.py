"""initial schema

Revision ID: 0001
Revises:
Create Date: 2025-05-01
"""
from alembic import op
import sqlalchemy as sa

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "produtos",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("nome", sa.String(200), nullable=False),
        sa.Column("descricao", sa.String(500), nullable=True),
        sa.Column("preco", sa.Float(), nullable=False),
        sa.Column("quantidade", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("categoria", sa.String(100), nullable=True),
        sa.Column("criado_em", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("atualizado_em", sa.DateTime(timezone=True), nullable=True),
    )

    op.create_table(
        "vendas",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("produto_id", sa.Integer(), sa.ForeignKey("produtos.id"), nullable=False),
        sa.Column("quantidade", sa.Integer(), nullable=False),
        sa.Column("preco_unitario", sa.Float(), nullable=False),
        sa.Column("total", sa.Float(), nullable=False),
        sa.Column("cliente", sa.String(200), nullable=True),
        sa.Column("observacao", sa.String(500), nullable=True),
        sa.Column("criado_em", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "despesas",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("descricao", sa.String(300), nullable=False),
        sa.Column("valor", sa.Float(), nullable=False),
        sa.Column("categoria", sa.String(100), nullable=True),
        sa.Column("data_despesa", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("criado_em", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("vendas")
    op.drop_table("despesas")
    op.drop_table("produtos")
