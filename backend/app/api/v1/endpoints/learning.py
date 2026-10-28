import uuid
from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from app.core.permissions import CurrentUser, get_current_user, require_faculty_or_admin
from app.tasks.document_processor import document_processor
from app.db.store import store

router = APIRouter()

@router.get("/learning/resources")
def get_learning_resources(user: CurrentUser = Depends(get_current_user)):
    inst_id = str(user.institution_id) if user.institution_id else "a0000000-0000-0000-0000-000000000001"
    res = []
    for lr in store.learning_resources.values():
        if user.is_super_admin or lr.get("institution_id") == inst_id:
            res.append(lr)
    return res

@router.post("/learning/resources/upload")
async def upload_learning_resource(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: str = Form(""),
    user: CurrentUser = Depends(require_faculty_or_admin),
):
    inst_id = str(user.institution_id) if user.institution_id else "a0000000-0000-0000-0000-000000000001"
    filename = file.filename or "uploaded_doc"
    ext = filename.split(".")[-1].lower()
    if ext not in ["pdf", "ppt", "pptx", "txt", "md"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed formats: PDF, PPT, PPTX.",
        )

    file_bytes = await file.read()
    if len(file_bytes) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File exceeds maximum allowed upload size (25MB).")

    new_id = str(uuid.uuid4())
    # Extract text and process chunks
    try:
        chunks = await document_processor.process_document(file_bytes, filename)
    except Exception as e:
        chunks = []

    res_obj = {
        "id": new_id,
        "institution_id": inst_id,
        "title": title or filename,
        "description": description,
        "resource_type": ext,
        "file_size_bytes": len(file_bytes),
        "mime_type": file.content_type,
        "processing_status": "completed",
        "chunks_count": len(chunks),
        "uploaded_by": str(user.id),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    store.learning_resources[new_id] = res_obj

    # Save chunks into store
    for c in chunks:
        c["resource_id"] = new_id
        store.resource_chunks.append(c)

    return res_obj

@router.get("/learning/recommendations")
def get_learning_recommendations(user: CurrentUser = Depends(get_current_user)):
    return [
        {
            "id": "rec-01",
            "title": "Mastering Dynamic Programming on Trees and Graphs",
            "category": "programming",
            "priority": "high",
            "duration": "45 mins",
            "reason": "Targeted for Google Cloud & Microsoft SDE technical rounds.",
        },
        {
            "id": "rec-02",
            "title": "Operating Systems: Virtual Memory & Page Replacement",
            "category": "technical",
            "priority": "medium",
            "duration": "30 mins",
            "reason": "Address identified 1-level gap in OS core concepts.",
        },
        {
            "id": "rec-03",
            "title": "Quantitative Aptitude: Probability & Combinatorics Shortcuts",
            "category": "aptitude",
            "priority": "medium",
            "duration": "25 mins",
            "reason": "Optimize solution speed for Tier-1 company screening tests.",
        },
    ]
