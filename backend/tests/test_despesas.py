def test_criar_despesa(client):
    response = client.post("/despesas/", json={
        "descricao": "Aluguel",
        "valor": 1500.00,
        "categoria": "Fixo",
    })
    assert response.status_code == 201
    data = response.json()
    assert data["valor"] == 1500.00


def test_listar_despesas(client):
    response = client.get("/despesas/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_atualizar_despesa(client):
    criada = client.post("/despesas/", json={"descricao": "Internet", "valor": 200.00}).json()
    response = client.put(f"/despesas/{criada['id']}", json={"valor": 250.00})
    assert response.status_code == 200
    assert response.json()["valor"] == 250.00


def test_deletar_despesa(client):
    criada = client.post("/despesas/", json={"descricao": "Água", "valor": 80.00}).json()
    response = client.delete(f"/despesas/{criada['id']}")
    assert response.status_code == 204


def test_despesa_inexistente(client):
    response = client.get("/despesas/99999")
    assert response.status_code == 404
