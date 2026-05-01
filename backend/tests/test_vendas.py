import pytest


@pytest.fixture()
def produto_id(client):
    response = client.post("/produtos/", json={
        "nome": "Produto Teste Venda",
        "preco": 10.00,
        "quantidade": 20,
    })
    return response.json()["id"]


def test_registrar_venda(client, produto_id):
    response = client.post("/vendas/", json={
        "produto_id": produto_id,
        "quantidade": 2,
        "cliente": "João Silva",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["total"] == 20.00


def test_venda_reduz_estoque(client, produto_id):
    estoque_antes = client.get(f"/produtos/{produto_id}").json()["quantidade"]
    client.post("/vendas/", json={"produto_id": produto_id, "quantidade": 3})
    estoque_depois = client.get(f"/produtos/{produto_id}").json()["quantidade"]
    assert estoque_depois == estoque_antes - 3


def test_venda_estoque_insuficiente(client, produto_id):
    response = client.post("/vendas/", json={"produto_id": produto_id, "quantidade": 9999})
    assert response.status_code == 422


def test_listar_vendas(client):
    response = client.get("/vendas/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
