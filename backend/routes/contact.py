from fastapi import APIRouter, HTTPException
from typing import List
from models import ContactSubmission, ContactCreate

router = APIRouter(prefix="/api/contact", tags=["contact"])

# This will be injected from server.py
db = None

def set_db(database):
    global db
    db = database

@router.post("", response_model=ContactSubmission)
async def submit_contact_form(contact: ContactCreate):
    """Submit a contact form"""
    contact_dict = contact.dict()
    contact_obj = ContactSubmission(**contact_dict)
    await db.contacts.insert_one(contact_obj.dict())
    return contact_obj

@router.get("", response_model=List[ContactSubmission])
async def get_all_contacts():
    """Get all contact submissions"""
    contacts = await db.contacts.find().sort("created_at", -1).to_list(1000)
    return [ContactSubmission(**contact) for contact in contacts]

@router.get("/{contact_id}", response_model=ContactSubmission)
async def get_contact(contact_id: str):
    """Get a single contact submission"""
    contact = await db.contacts.find_one({"id": contact_id})
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return ContactSubmission(**contact)

@router.delete("/{contact_id}")
async def delete_contact(contact_id: str):
    """Delete a contact submission"""
    result = await db.contacts.delete_one({"id": contact_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Contact deleted successfully"}