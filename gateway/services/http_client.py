import httpx
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse, Response
from config.settings import settings
import logging


logger = logging.getLogger(__name__)

HOP_BY_HOP_HEADERS = {
    "connection",
    "content-length",
    "host",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
}

async def forward_request(method: str, path: str, request: Request, body: dict = None):
    url = f"{settings.SPRING_BOOT_URL}{path}"
    
    # Forward application headers, notably Authorization, without hop-by-hop headers.
    headers = {
        key: value
        for key, value in request.headers.items()
        if key.lower() not in HOP_BY_HOP_HEADERS
    }
    
    try:
        async with httpx.AsyncClient(timeout=settings.TIMEOUT_SECONDS) as client:
            response = await client.request(
                method=method,
                url=url,
                headers=headers,
                json=body,
                params=dict(request.query_params)
            )
            
            if response.status_code >= 400:
                logger.error(f"Downstream error {response.status_code} at {url}: {response.text}")
                try:
                    detail = response.json()
                except Exception:
                    detail = {"message": response.text}
                return JSONResponse(status_code=response.status_code, content=detail)

            if not response.content:
                return None

            if "application/json" in response.headers.get("content-type", ""):
                return response.json()

            return Response(
                content=response.content,
                status_code=response.status_code,
                media_type=response.headers.get("content-type"),
            )

    except httpx.ConnectError as e:
        logger.error(f"Connection error to downstream {url}: {str(e)}")
        raise HTTPException(status_code=503, detail="Downstream service unavailable")
    except httpx.TimeoutException as e:
        logger.error(f"Timeout connecting to downstream {url}: {str(e)}")
        raise HTTPException(status_code=504, detail="Downstream service timeout")

async def forward_node_request(method: str, path: str, request: Request, body: dict = None):
    url = f"{settings.NODE_SERVICE_URL}{path}"
    
    headers = {
        key: value
        for key, value in request.headers.items()
        if key.lower() not in HOP_BY_HOP_HEADERS
    }
    
    try:
        async with httpx.AsyncClient(timeout=settings.TIMEOUT_SECONDS) as client:
            response = await client.request(
                method=method,
                url=url,
                headers=headers,
                json=body,
                params=dict(request.query_params)
            )
            
            if response.status_code >= 400:
                logger.error(f"Downstream Node.js error {response.status_code} at {url}: {response.text}")
                try:
                    detail = response.json()
                except Exception:
                    detail = {"message": response.text}
                return JSONResponse(status_code=response.status_code, content=detail)

            if not response.content:
                return None

            if "application/json" in response.headers.get("content-type", ""):
                return response.json()

            return Response(
                content=response.content,
                status_code=response.status_code,
                media_type=response.headers.get("content-type"),
            )

    except httpx.ConnectError as e:
        logger.error(f"Connection error to downstream Node.js {url}: {str(e)}")
        raise HTTPException(status_code=503, detail="Downstream Node.js service unavailable")
    except httpx.TimeoutException as e:
        logger.error(f"Timeout connecting to downstream Node.js {url}: {str(e)}")
        raise HTTPException(status_code=504, detail="Downstream Node.js service timeout")
