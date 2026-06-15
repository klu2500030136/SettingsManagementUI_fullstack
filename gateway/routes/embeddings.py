from fastapi import APIRouter, Request, Body
from services.http_client import forward_node_request

router = APIRouter(prefix="/api/embeddings", tags=["Settings Embeddings"])

@router.get("")
async def get_embeddings(request: Request):
    return await forward_node_request("GET", "/api/embeddings", request)

@router.post("")
async def add_embedding(request: Request, body: dict = Body(...)):
    return await forward_node_request("POST", "/api/embeddings", request, body)
