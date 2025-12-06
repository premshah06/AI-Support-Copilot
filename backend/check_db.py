#!/usr/bin/env python3
"""
Database checker script - verifies database connection and shows data
"""
from app.database import SessionLocal, engine
from app.models import Base, User, Customer, Ticket, KBArticle
from sqlalchemy import inspect

def check_database():
    print("=" * 60)
    print("DATABASE CONNECTION CHECK")
    print("=" * 60)
    
    # Check if tables exist
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    print(f"\n✓ Database connected successfully!")
    print(f"✓ Found {len(tables)} tables: {', '.join(tables)}")
    
    # Check data in each table
    db = SessionLocal()
    try:
        print("\n" + "=" * 60)
        print("DATA CHECK")
        print("=" * 60)
        
        # Users
        user_count = db.query(User).count()
        print(f"\n👥 USERS: {user_count} records")
        if user_count > 0:
            users = db.query(User).limit(5).all()
            for user in users:
                print(f"   - {user.name} ({user.email}) - Role: {user.role}")
        
        # Customers
        customer_count = db.query(Customer).count()
        print(f"\n🏢 CUSTOMERS: {customer_count} records")
        if customer_count > 0:
            customers = db.query(Customer).limit(5).all()
            for customer in customers:
                print(f"   - {customer.name} ({customer.email})")
        
        # Tickets
        ticket_count = db.query(Ticket).count()
        print(f"\n🎫 TICKETS: {ticket_count} records")
        if ticket_count > 0:
            tickets = db.query(Ticket).limit(5).all()
            for ticket in tickets:
                print(f"   - #{ticket.id}: {ticket.title[:50]}... [{ticket.status}]")
        
        # KB Articles
        kb_count = db.query(KBArticle).count()
        print(f"\n📚 KNOWLEDGE BASE: {kb_count} articles")
        if kb_count > 0:
            articles = db.query(KBArticle).limit(5).all()
            for article in articles:
                print(f"   - {article.title}")
        
        print("\n" + "=" * 60)
        if user_count == 0:
            print("⚠️  DATABASE IS EMPTY!")
            print("Run: python -m app.data.seed_demo_data")
        else:
            print("✓ Database has data and is working correctly!")
        print("=" * 60)
        
    finally:
        db.close()

if __name__ == "__main__":
    try:
        check_database()
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        print("\nThe database might not be initialized.")
        print("Try running: python -m app.data.seed_demo_data")
