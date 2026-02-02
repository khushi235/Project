"""
Subcategory Pricing routes for Necklaces, Bracelets, and Bangles
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

router = APIRouter(prefix="/api/subcategory-pricing", tags=["subcategory-pricing"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME')]

class PriceRow(BaseModel):
    cttw: str
    price_hi_si: str = ""
    price_fg_si: str = ""
    price_all_way: str = ""
    price_half_way: str = ""
    price: str = ""  # Legacy field for backwards compatibility

class SubcategoryPricingCreate(BaseModel):
    category_id: str
    subcategory_id: str
    subcategory_name: str
    image_url: str
    price_table: List[PriceRow]

class SubcategoryPricingUpdate(BaseModel):
    image_url: Optional[str] = None
    price_table: Optional[List[PriceRow]] = None

@router.get("")
async def get_all_subcategory_pricing():
    """Get all subcategory pricing entries"""
    pricing_list = []
    cursor = db.subcategory_pricing.find({}, {"_id": 0})
    async for doc in cursor:
        pricing_list.append(doc)
    return pricing_list

@router.get("/{category_id}")
async def get_category_pricing(category_id: str):
    """Get all subcategory pricing for a specific category"""
    pricing_list = []
    cursor = db.subcategory_pricing.find({"category_id": category_id}, {"_id": 0})
    async for doc in cursor:
        pricing_list.append(doc)
    return pricing_list

@router.get("/{category_id}/{subcategory_id}")
async def get_subcategory_pricing(category_id: str, subcategory_id: str):
    """Get pricing for a specific subcategory"""
    pricing = await db.subcategory_pricing.find_one(
        {"category_id": category_id, "subcategory_id": subcategory_id},
        {"_id": 0}
    )
    if not pricing:
        raise HTTPException(status_code=404, detail="Subcategory pricing not found")
    return pricing

@router.post("")
async def create_subcategory_pricing(pricing: SubcategoryPricingCreate):
    """Create new subcategory pricing"""
    # Check if already exists
    existing = await db.subcategory_pricing.find_one({
        "category_id": pricing.category_id,
        "subcategory_id": pricing.subcategory_id
    })
    if existing:
        raise HTTPException(status_code=400, detail="Pricing for this subcategory already exists")
    
    pricing_doc = {
        "id": str(uuid.uuid4()),
        "category_id": pricing.category_id,
        "subcategory_id": pricing.subcategory_id,
        "subcategory_name": pricing.subcategory_name,
        "image_url": pricing.image_url,
        "price_table": [row.dict() for row in pricing.price_table],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await db.subcategory_pricing.insert_one(pricing_doc)
    del pricing_doc["_id"]
    return pricing_doc

@router.put("/{pricing_id}")
async def update_subcategory_pricing(pricing_id: str, pricing: SubcategoryPricingUpdate):
    """Update subcategory pricing"""
    update_data = {"updated_at": datetime.utcnow()}
    
    if pricing.image_url is not None:
        update_data["image_url"] = pricing.image_url
    if pricing.price_table is not None:
        update_data["price_table"] = [row.dict() for row in pricing.price_table]
    
    result = await db.subcategory_pricing.update_one(
        {"id": pricing_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Pricing not found")
    
    updated = await db.subcategory_pricing.find_one({"id": pricing_id}, {"_id": 0})
    return updated

@router.delete("/{pricing_id}")
async def delete_subcategory_pricing(pricing_id: str):
    """Delete subcategory pricing"""
    result = await db.subcategory_pricing.delete_one({"id": pricing_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Pricing not found")
    return {"message": "Pricing deleted successfully"}
