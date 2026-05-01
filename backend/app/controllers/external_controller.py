from fastapi import APIRouter, HTTPException
import httpx

router = APIRouter(prefix="/external", tags=["Integrações Externas"])

VIACEP_URL = "https://viacep.com.br/ws/{cep}/json/"
BRASIL_API_CNPJ_URL = "https://brasilapi.com.br/api/cnpj/v1/{cnpj}"


@router.get("/cep/{cep}")
async def consultar_cep(cep: str):
    cep_limpo = cep.replace("-", "").replace(".", "").strip()
    if len(cep_limpo) != 8 or not cep_limpo.isdigit():
        raise HTTPException(status_code=400, detail="CEP inválido. Informe 8 dígitos numéricos.")

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(VIACEP_URL.format(cep=cep_limpo))
            data = response.json()
            if data.get("erro"):
                raise HTTPException(status_code=404, detail="CEP não encontrado.")
            return data
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Serviço ViaCEP indisponível.")


@router.get("/cnpj/{cnpj}")
async def consultar_cnpj(cnpj: str):
    cnpj_limpo = cnpj.replace(".", "").replace("/", "").replace("-", "").strip()
    if len(cnpj_limpo) != 14 or not cnpj_limpo.isdigit():
        raise HTTPException(status_code=400, detail="CNPJ inválido. Informe 14 dígitos numéricos.")

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(BRASIL_API_CNPJ_URL.format(cnpj=cnpj_limpo))
            if response.status_code == 404:
                raise HTTPException(status_code=404, detail="CNPJ não encontrado.")
            return response.json()
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="Serviço BrasilAPI indisponível.")
