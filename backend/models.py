from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

# Category Model
class SubcategoryModel(BaseModel):
    id: str
    name: str

class CategoryModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    subcategories: List[SubcategoryModel] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CategoryCreate(BaseModel):
    name: str
    subcategories: List[SubcategoryModel] = []

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    subcategories: Optional[List[SubcategoryModel]] = None

# Product Model
class ProductModel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    subcategory: str
    description: Optional[str] = ""
    price: str
    image: Optional[str] = ""
    imageUrl: Optional[str] = ""
    details: Optional[str] = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProductCreate(BaseModel):
    name: str
    category: str
    subcategory: str
    description: Optional[str] = ""
    price: str
    image: Optional[str] = ""
    imageUrl: Optional[str] = ""
    details: Optional[str] = ""

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    subcategory: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    image: Optional[str] = None
    imageUrl: Optional[str] = None
    details: Optional[str] = None

# Contact Form Model
class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContactCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str