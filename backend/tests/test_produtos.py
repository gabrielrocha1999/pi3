def test_criar_produto(client):
    response = client.post("/produtos/", json={
        "nome": "Caneta Azul",
        "preco": 2.50,
        "quantidade": 100,
        "categoria": "Papelaria",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["nome"] == "Caneta Azul"
    assert data["quantidade"] == 100


def test_listar_produtos(client):
    response = client.get("/produtos/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_obter_produto_inexistente(client):
    response = client.get("/produtos/99999")
    assert response.status_code == 404


def test_atualizar_produto(client):
    criado = client.post("/produtos/", json={"nome": "Lápis", "preco": 1.00, "quantidade": 50}).json()
    response = client.put(f"/produtos/{criado['id']}", json={"preco": 1.50})
    assert response.status_code == 200
    assert response.json()["preco"] == 1.50


def test_deletar_produto(client):
    criado = client.post("/produtos/", json={"nome": "Borracha", "preco": 0.75, "quantidade": 30}).json()
    response = client.delete(f"/produtos/{criado['id']}")
    assert response.status_code == 204
