"""
Seed script to populate database with initial categories and products
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
import os
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def seed_database():
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    # Clear existing data
    print("Clearing existing data...")
    await db.categories.delete_many({})
    await db.products.delete_many({})
    
    # Seed Categories
    print("Seeding categories...")
    categories = [
        {
            "id": "all",
            "name": "All Collections",
            "subcategories": [],
            "created_at": datetime.utcnow()
        },
        {
            "id": "necklace",
            "name": "Necklaces",
            "subcategories": [
                {"id": "tennis", "name": "Tennis"},
                {"id": "buttercup", "name": "Buttercup"},
                {"id": "fancy", "name": "Fancy"}
            ],
            "created_at": datetime.utcnow()
        },
        {
            "id": "bracelet",
            "name": "Bracelets",
            "subcategories": [
                {"id": "tennis", "name": "Tennis"},
                {"id": "buttercup", "name": "Buttercup"},
                {"id": "bezel", "name": "Bezel"},
                {"id": "fancy-color", "name": "Fancy with Color Diamond"},
                {"id": "fancy-design", "name": "Fancy Designs"}
            ],
            "created_at": datetime.utcnow()
        },
        {
            "id": "ring",
            "name": "Rings",
            "subcategories": [
                {"id": "eternity-round", "name": "Eternity Band - Round"},
                {"id": "eternity-emerald", "name": "Eternity Band - Emerald"},
                {"id": "fancy", "name": "Fancy Rings"}
            ],
            "created_at": datetime.utcnow()
        },
        {
            "id": "bangle",
            "name": "Bangles",
            "subcategories": [
                {"id": "half", "name": "Half Bangle"},
                {"id": "all-the-way", "name": "All the Way Bangle"}
            ],
            "created_at": datetime.utcnow()
        },
        {
            "id": "pendant",
            "name": "Pendants",
            "subcategories": [
                {"id": "cross", "name": "Cross"},
                {"id": "solitaire", "name": "Solitaire"},
                {"id": "diamond-by-yard", "name": "Diamond by Yard"},
                {"id": "fancy", "name": "Fancy"}
            ],
            "created_at": datetime.utcnow()
        }
    ]
    
    await db.categories.insert_many(categories)
    print(f"✓ Seeded {len(categories)} categories")
    
    # Seed Products
    print("Seeding products...")
    products = [
        # Necklaces - Tennis
        {
            "id": str(uuid.uuid4()),
            "name": "Classic Tennis Necklace",
            "category": "necklace",
            "subcategory": "tennis",
            "description": "",
            "price": "Starting at $8,500",
            "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
            "details": "5.0 ct total weight",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Brilliant Tennis Necklace",
            "category": "necklace",
            "subcategory": "tennis",
            "description": "",
            "price": "Starting at $12,000",
            "image": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
            "details": "7.5 ct total weight",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        # Necklaces - Buttercup
        {
            "id": str(uuid.uuid4()),
            "name": "Buttercup Diamond Necklace",
            "category": "necklace",
            "subcategory": "buttercup",
            "description": "",
            "price": "Starting at $9,800",
            "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
            "details": "6.0 ct total weight",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        # Necklaces - Fancy
        {
            "id": str(uuid.uuid4()),
            "name": "Fancy Diamond Necklace",
            "category": "necklace",
            "subcategory": "fancy",
            "description": "",
            "price": "Starting at $15,000",
            "image": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
            "details": "8.5 ct total weight",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        # Bracelets - Tennis
        {
            "id": str(uuid.uuid4()),
            "name": "Elegant Tennis Bracelet",
            "category": "bracelet",
            "subcategory": "tennis",
            "description": "",
            "price": "Starting at $6,500",
            "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
            "details": "3.5 ct total weight",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Classic Tennis Bracelet",
            "category": "bracelet",
            "subcategory": "tennis",
            "description": "",
            "price": "Starting at $5,800",
            "image": "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
            "details": "3.0 ct total weight",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        # Rings - with actual user image
        {
            "id": str(uuid.uuid4()),
            "name": "Mixed Cut Eternity Band",
            "category": "ring",
            "subcategory": "eternity-round",
            "description": "",
            "price": "Contact for pricing",
            "image": "https://customer-assets.emergentagent.com/job_luxury-jewels-33/artifacts/0gnkq5r7_R05111-US6.1527.jpg",
            "details": "2.5 ct total weight",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        # Bangles
        {
            "id": str(uuid.uuid4()),
            "name": "Half Diamond Bangle",
            "category": "bangle",
            "subcategory": "half",
            "description": "",
            "price": "Starting at $8,200",
            "image": "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
            "details": "4.5 ct total weight",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    await db.products.insert_many(products)
    print(f"✓ Seeded {len(products)} products")
    
    client.close()
    print("\\n✓ Database seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed_database())
