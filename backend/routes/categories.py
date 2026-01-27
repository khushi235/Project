from fastapi import APIRouter, HTTPException
from typing import List
from models import CategoryModel, CategoryCreate, CategoryUpdate

router = APIRouter(prefix="/api/categories", tags=["categories"])

# This will be injected from server.py
db = None

def set_db(database):
    global db
    db = database

@router.get("", response_model=List[CategoryModel])
async def get_all_categories():
    """Get all categories"""
    categories = await db.categories.find().to_list(1000)
    return [CategoryModel(**category) for category in categories]

@router.get("/{category_id}", response_model=CategoryModel)
async def get_category(category_id: str):
    """Get a single category by ID"""
    category = await db.categories.find_one({"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return CategoryModel(**category)

@router.post("", response_model=CategoryModel)
async def create_category(category: CategoryCreate):
    """Create a new category"""
    category_dict = category.dict()
    category_obj = CategoryModel(**category_dict)
    await db.categories.insert_one(category_obj.dict())
    return category_obj

@router.put("/{category_id}", response_model=CategoryModel)
async def update_category(category_id: str, category_update: CategoryUpdate):
    """Update a category"""
    category = await db.categories.find_one({"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = {k: v for k, v in category_update.dict().items() if v is not None}
    
    await db.categories.update_one({"id": category_id}, {"$set": update_data})
    
    updated_category = await db.categories.find_one({"id": category_id})
    return CategoryModel(**updated_category)

@router.delete("/{category_id}")
async def delete_category(category_id: str):
    """Delete a category"""
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}