from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import Optional

from app.database.database import get_db
from app.services.history_service import HistoryService
from app.schemas.history import HistoryResponseSchema, HistoryListResponse

router = APIRouter(prefix="/history", tags=["History"])

@router.get("", response_model=HistoryListResponse)
def list_histories(
    skip: int = 0, 
    limit: int = 20, 
    x_device_id: Optional[str] = Header(None, description="Unique Device ID"),
    x_workspace_id: Optional[str] = Header(None, description="Workspace ID"),
    db: Session = Depends(get_db)
):
    print(f"Queried workspace_id: {x_workspace_id}")
    history_service = HistoryService(db)
    device_id = x_device_id or "anonymous_device"
    items, total = history_service.list_history(device_id=device_id, skip=skip, limit=limit, workspace_id=x_workspace_id)
    return HistoryListResponse(items=items, total=total)

@router.get("/{id}", response_model=HistoryResponseSchema)
def get_history(id: str, db: Session = Depends(get_db)):
    history_service = HistoryService(db)
    record = history_service.get_history(id)
    if not record:
        raise HTTPException(status_code=404, detail="History record not found")
    return record

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_history(
    id: str, 
    x_device_id: Optional[str] = Header(None, description="Unique Device ID"),
    x_workspace_id: Optional[str] = Header(None, description="Workspace ID"),
    db: Session = Depends(get_db)
):
    print(f"Deleted workspace_id: {x_workspace_id}")
    history_service = HistoryService(db)
    device_id = x_device_id or "anonymous_device"
    success = history_service.delete_history(id, device_id=device_id, workspace_id=x_workspace_id)
    if not success:
        raise HTTPException(status_code=404, detail="History record not found or unauthorized")
    return None

@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def delete_all_history(
    x_device_id: Optional[str] = Header(None, description="Unique Device ID"),
    x_workspace_id: Optional[str] = Header(None, description="Workspace ID"),
    db: Session = Depends(get_db)
):
    print(f"Deleted all workspace_id: {x_workspace_id}")
    history_service = HistoryService(db)
    device_id = x_device_id or "anonymous_device"
    history_service.delete_all_history(device_id=device_id, workspace_id=x_workspace_id)
    return None
