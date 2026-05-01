def test_dashboard(client):
    response = client.get("/dashboard/")
    assert response.status_code == 200
    data = response.json()
    assert "faturamento_total" in data
    assert "despesas_totais" in data
    assert "saldo" in data
    assert "total_vendas" in data
    assert "produtos_cadastrados" in data
