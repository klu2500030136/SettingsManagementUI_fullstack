from fastapi import APIRouter, Request, Body
from services.http_client import forward_node_request

router = APIRouter(prefix="/api", tags=["Search"])

@router.post("/semantic-search")
async def semantic_search(request: Request, body: dict = Body(...)):
    return await forward_node_request("POST", "/api/semantic-search", request, body)

@router.get("/search-history")
async def search_history(request: Request):
    return await forward_node_request("GET", "/api/search-history", request)

@router.post("/embeddings/sync")
async def sync_embeddings(request: Request):
    return await forward_node_request("POST", "/api/embeddings/sync", request)

@router.post("/embeddings/seed")
async def seed_embeddings(request: Request):
    return await forward_node_request("POST", "/api/embeddings/seed", request)
