from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List
from models import ProductModel, ProductCreate, ProductUpdate
from datetime import datetime
import os
import shutil
import uuid
from pathlib import Path

router = APIRouter(prefix="/api/products", tags=["products"])

# This will be injected from server.py
db = None

def set_db(database):
    global db
    db = database

@router.get("", response_model=List[ProductModel])
async def get_all_products():
    """Get all products"""
    products = await db.products.find().to_list(1000)
    return [ProductModel(**product) for product in products]

@router.get("/{product_id}", response_model=ProductModel)
async def get_product(product_id: str):
    """Get a single product by ID"""
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductModel(**product)

@router.get("/category/{category}", response_model=List[ProductModel])
async def get_products_by_category(category: str):
    """Get products by category"""
    products = await db.products.find({"category": category}).to_list(1000)
    return [ProductModel(**product) for product in products]

@router.get("/category/{category}/subcategory/{subcategory}", response_model=List[ProductModel])
async def get_products_by_subcategory(category: str, subcategory: str):
    """Get products by category and subcategory"""
    products = await db.products.find({"category": category, "subcategory": subcategory}).to_list(1000)
    return [ProductModel(**product) for product in products]

@router.post("", response_model=ProductModel)
async def create_product(product: ProductCreate):
    """Create a new product"""
    product_dict = product.dict()
    product_obj = ProductModel(**product_dict)
    await db.products.insert_one(product_obj.dict())
    return product_obj

@router.put("/{product_id}", response_model=ProductModel)
async def update_product(product_id: str, product_update: ProductUpdate):
    """Update a product"""
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = {k: v for k, v in product_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.products.update_one({"id": product_id}, {"$set": update_data})
    
    updated_product = await db.products.find_one({"id": product_id})
    return ProductModel(**updated_product)

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    """Delete a product"""
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    """Upload a product image"""
    # Create uploads directory if it doesn't exist
    upload_dir = Path("/app/backend/uploads")
    upload_dir.mkdir(exist_ok=True)
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = upload_dir / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return the URL path
    image_url = f"/api/uploads/{unique_filename}"
    return {"image_url": image_url}