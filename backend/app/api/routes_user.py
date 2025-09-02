from fastapi import APIRouter, HTTPException
from app.models.schema import UserOut
from app.services.mem_storage import storage
from typing import Optional

router = APIRouter()

@router.get("/user", response_model=UserOut)
async def get_user_data():
    """
    Mengambil data pengguna saat ini.
    """
    # Asumsi user_id adalah 1, karena frontend mockup menggunakan data pengguna tunggal.
    user_data = storage.get_user(1)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return user_data

@router.patch("/user", response_model=UserOut)
async def update_user_data(updates: dict):
    """
    Memperbarui data pengguna.
    """
    # Anda perlu memperbarui `MemStorage` untuk menerima `updates`
    # Ini adalah contoh implementasi, Anda mungkin perlu menyesuaikan.
    user_data = storage.users.get(1)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
        
    for key, value in updates.items():
        if hasattr(user_data, key):
            setattr(user_data, key, value)
    
    return user_data