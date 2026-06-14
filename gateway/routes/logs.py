from fastapi import APIRouter, Request, Body
from services.http_client import forward_node_request, forward_request

router = APIRouter(prefix="/api/logs", tags=["Logs"])

@router.get("")
async def get_logs(request: Request):
    return await forward_request("GET", "/api/logs", request)

@router.post("")
async def add_log(request: Request, body: dict = Body(...)):
    return await forward_node_request("POST", "/api/logs", request, body)
