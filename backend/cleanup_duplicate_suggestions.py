#!/usr/bin/env python3
"""
Script to clean up duplicate AI suggestions in the database.
Keeps only the most recent suggestion for each ticket.
"""

from app.database import SessionLocal
from app import models
from datetime import datetime, timedelta

def cleanup_duplicates():
    db = SessionLocal()
    try:
        # Get all tickets
        tickets = db.query(models.Ticket).all()
        
        total_deleted = 0
        for ticket in tickets:
            # Get all AI suggestions for this ticket
            suggestions = db.query(models.TicketAction).filter(
                models.TicketAction.ticket_id == ticket.id,
                models.TicketAction.actor_type == "AI",
                models.TicketAction.action_type == "reply_suggested"
            ).order_by(models.TicketAction.created_at.desc()).all()
            
            if len(suggestions) > 1:
                # Keep the most recent one, delete the rest
                to_delete = suggestions[1:]
                print(f"Ticket #{ticket.id}: Found {len(suggestions)} suggestions, deleting {len(to_delete)} duplicates")
                
                for suggestion in to_delete:
                    db.delete(suggestion)
                    total_deleted += 1
        
        db.commit()
        print(f"\n✅ Cleanup complete! Deleted {total_deleted} duplicate suggestions.")
        
    except Exception as e:
        print(f"❌ Error during cleanup: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🧹 Starting cleanup of duplicate AI suggestions...")
    cleanup_duplicates()
