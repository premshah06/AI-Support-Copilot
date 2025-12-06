"""
Enhanced seed data script for demo application
Generates 100 realistic tickets with varied statuses, priorities, and action histories
"""

from __future__ import annotations

import random
from datetime import datetime, timedelta
from pathlib import Path

from sqlalchemy.orm import Session

from ..auth import get_password_hash
from ..config import get_settings
from ..database import SessionLocal, engine
from ..models import Base, Customer, KBArticle, Ticket, TicketAction, User

settings = get_settings()

# Realistic ticket templates
TICKET_TEMPLATES = [
    # Billing Issues
    {
        "title": "Payment failed but card was charged",
        "description": "Customer reports payment failure on checkout, but credit card shows pending charge of ${amount}.",
        "category": "billing",
        "priority": "P2",
    },
    {
        "title": "Duplicate charge on invoice #{invoice}",
        "description": "Customer was charged twice for the same invoice. Need to process refund for duplicate transaction.",
        "category": "billing",
        "priority": "P2",
    },
    {
        "title": "Unable to update payment method",
        "description": "Customer cannot update credit card information. Getting error 'Invalid card details' with valid card.",
        "category": "billing",
        "priority": "P3",
    },
    {
        "title": "Subscription not cancelled after request",
        "description": "Customer requested cancellation {days} days ago but is still being charged monthly.",
        "category": "billing",
        "priority": "P2",
    },
    # Technical Issues
    {
        "title": "API returning 500 errors for /users endpoint",
        "description": "Multiple customers reporting 500 Internal Server Error when calling GET /api/users. Started approximately {hours} hours ago.",
        "category": "bug",
        "priority": "P1",
    },
    {
        "title": "Dashboard not loading - infinite spinner",
        "description": "User dashboard shows loading spinner indefinitely. Console shows CORS error from api.example.com.",
        "category": "bug",
        "priority": "P2",
    },
    {
        "title": "Mobile app crashes on {feature}",
        "description": "iOS app version {version} crashes when user attempts to {action}. Affects approximately {percent}% of users.",
        "category": "bug",
        "priority": "P1",
    },
    {
        "title": "Data export feature timing out",
        "description": "Large data exports (>10k records) are timing out after 30 seconds. Need to implement background job processing.",
        "category": "bug",
        "priority": "P3",
    },
    {
        "title": "Search functionality returning incorrect results",
        "description": "Search query '{query}' returns unrelated results. Elasticsearch index may need reindexing.",
        "category": "bug",
        "priority": "P3",
    },
    # Service Outages
    {
        "title": "Service outage in {region} region",
        "description": "Monitoring detected increased error rates and latency for API requests in {region}. Investigating root cause.",
        "category": "outage",
        "priority": "P1",
    },
    {
        "title": "Database connection pool exhausted",
        "description": "Application unable to acquire database connections. Connection pool at maximum capacity of {max_conn} connections.",
        "category": "outage",
        "priority": "P1",
    },
    {
        "title": "CDN cache invalidation not working",
        "description": "Static assets not updating after deployment. CDN cache invalidation requests failing with 403 Forbidden.",
        "category": "outage",
        "priority": "P2",
    },
    # Feature Requests
    {
        "title": "Add dark mode to dashboard",
        "description": "Multiple customers requesting dark mode option for dashboard. Would improve usability for users working in low-light environments.",
        "category": "feature_request",
        "priority": "P3",
    },
    {
        "title": "Export data to {format} format",
        "description": "Customer needs ability to export reports in {format} format for integration with {tool}.",
        "category": "feature_request",
        "priority": "P4",
    },
    {
        "title": "Add two-factor authentication",
        "description": "Enterprise customers requesting 2FA support for enhanced security. Should support TOTP and SMS methods.",
        "category": "feature_request",
        "priority": "P2",
    },
    {
        "title": "Bulk operations for {entity}",
        "description": "Need ability to perform bulk updates/deletes on {entity}. Current UI only supports one-at-a-time operations.",
        "category": "feature_request",
        "priority": "P3",
    },
    # Account Issues
    {
        "title": "Cannot access account - password reset not working",
        "description": "Customer not receiving password reset emails. Checked spam folder. Email address verified as correct.",
        "category": "account",
        "priority": "P2",
    },
    {
        "title": "Account locked after failed login attempts",
        "description": "User account locked due to multiple failed login attempts. Customer confirms they were trying correct password.",
        "category": "account",
        "priority": "P3",
    },
    {
        "title": "Email verification link expired",
        "description": "New user unable to verify email address. Verification link expired before they could click it.",
        "category": "account",
        "priority": "P3",
    },
    # Performance Issues
    {
        "title": "Page load time increased to {seconds}s",
        "description": "Dashboard page load time increased from 2s to {seconds}s. Affecting user experience significantly.",
        "category": "performance",
        "priority": "P2",
    },
    {
        "title": "Memory leak in {service} service",
        "description": "{service} service memory usage growing continuously. Requires restart every {hours} hours to prevent OOM errors.",
        "category": "performance",
        "priority": "P1",
    },
    {
        "title": "Database queries running slowly",
        "description": "Query performance degraded. {query_name} query taking {seconds}s, previously took <1s. May need index optimization.",
        "category": "performance",
        "priority": "P2",
    },
    # Integration Issues
    {
        "title": "{integration} integration not syncing",
        "description": "Data sync with {integration} failing. Last successful sync was {hours} hours ago. Error: '{error}'",
        "category": "integration",
        "priority": "P2",
    },
    {
        "title": "Webhook delivery failures to {endpoint}",
        "description": "Webhooks to {endpoint} failing with timeout errors. Customer endpoint may be down or rate limiting.",
        "category": "integration",
        "priority": "P3",
    },
    {
        "title": "SSO authentication failing for {provider}",
        "description": "Single sign-on with {provider} returning 'Invalid SAML response'. Configuration may have changed.",
        "category": "integration",
        "priority": "P2",
    },
]

# Replacement values for templates
REPLACEMENTS = {
    "amount": ["$49.99", "$99.99", "$149.99", "$299.99", "$499.99"],
    "invoice": ["INV-2024-001", "INV-2024-045", "INV-2024-089", "INV-2024-123"],
    "days": ["3", "5", "7", "10", "14"],
    "hours": ["2", "4", "6", "12", "24"],
    "feature": ["login", "checkout", "profile update", "file upload", "search"],
    "version": ["2.1.0", "2.2.0", "2.3.1", "3.0.0"],
    "action": ["upload a photo", "submit a form", "view analytics", "export data"],
    "percent": ["15", "25", "40", "60"],
    "query": ["user search", "product lookup", "order history", "customer data"],
    "region": ["us-west-2", "us-east-1", "eu-west-1", "ap-southeast-1"],
    "max_conn": ["100", "200", "500"],
    "format": ["CSV", "Excel", "PDF", "JSON"],
    "tool": ["Excel", "Tableau", "Power BI", "Google Sheets"],
    "entity": ["users", "products", "orders", "invoices"],
    "seconds": ["8", "12", "15", "20"],
    "service": ["api-gateway", "worker", "scheduler", "notification"],
    "query_name": ["user_search", "order_lookup", "analytics_report"],
    "integration": ["Salesforce", "HubSpot", "Slack", "Stripe", "Zendesk"],
    "endpoint": ["https://api.customer.com/webhooks", "https://hooks.example.com/events"],
    "provider": ["Okta", "Auth0", "Azure AD", "Google Workspace"],
    "error": ["Connection timeout", "Invalid credentials", "Rate limit exceeded"],
}

STATUSES = ["open", "in_progress", "resolved", "closed"]
STATUS_WEIGHTS = [0.3, 0.25, 0.3, 0.15]  # More open/in_progress for realistic demo

ACTION_TEMPLATES = {
    "created": "Ticket created by {user}",
    "status_changed": "Status changed from {old_status} to {new_status}",
    "priority_changed": "Priority changed from {old_priority} to {new_priority}",
    "reply_sent": "Reply sent to customer: {reply}",
    "note_added": "Internal note: {note}",
    "assigned": "Ticket assigned to {assignee}",
}

REPLY_TEMPLATES = [
    "Thank you for reporting this issue. We're investigating and will update you shortly.",
    "We've identified the root cause and are working on a fix. ETA: {eta}",
    "This has been resolved. Please verify and let us know if you continue to experience issues.",
    "We need additional information to proceed. Can you provide {info_needed}?",
    "This is a known issue tracked in ticket #{ticket_ref}. We'll update you when it's resolved.",
]

NOTE_TEMPLATES = [
    "Escalated to engineering team for investigation",
    "Waiting for customer response",
    "Duplicate of ticket #{ticket_ref}",
    "Requires database migration to fix",
    "Scheduled for next release",
    "Customer confirmed issue is resolved",
]


def generate_ticket_content(template: dict) -> dict:
    """Generate ticket with realistic content by replacing placeholders"""
    title = template["title"]
    description = template["description"]
    
    # Replace placeholders with random values
    for key, values in REPLACEMENTS.items():
        placeholder = f"{{{key}}}"
        if placeholder in title or placeholder in description:
            value = random.choice(values)
            title = title.replace(placeholder, value)
            description = description.replace(placeholder, value)
    
    return {
        "title": title,
        "description": description,
        "category": template["category"],
        "priority": template["priority"],
    }


def generate_actions_for_ticket(ticket_id: int, status: str, created_at: datetime) -> list[TicketAction]:
    """Generate realistic action history for a ticket"""
    actions = []
    current_time = created_at
    
    # Always start with creation
    actions.append(TicketAction(
        ticket_id=ticket_id,
        actor_type="human",
        action_type="created",
        content="Ticket created",
        created_at=current_time,
    ))
    
    # Add 2-5 actions based on status
    num_actions = random.randint(2, 5) if status != "open" else random.randint(0, 2)
    
    for _ in range(num_actions):
        current_time += timedelta(hours=random.randint(1, 24))
        
        action_type = random.choice(["status_changed", "reply_sent", "note_added", "assigned"])
        
        if action_type == "reply_sent":
            reply = random.choice(REPLY_TEMPLATES)
            reply = reply.replace("{eta}", random.choice(["2 hours", "24 hours", "2 days"]))
            reply = reply.replace("{info_needed}", random.choice(["logs", "screenshots", "steps to reproduce"]))
            reply = reply.replace("{ticket_ref}", str(random.randint(1, 100)))
            content = reply
            actor_type = "human"
        elif action_type == "note_added":
            note = random.choice(NOTE_TEMPLATES)
            note = note.replace("{ticket_ref}", str(random.randint(1, 100)))
            content = note
            actor_type = "human"
        elif action_type == "status_changed":
            old_status = random.choice(["open", "in_progress"])
            new_status = status if random.random() > 0.5 else "in_progress"
            content = f"Status changed from {old_status} to {new_status}"
            actor_type = "human"
        else:  # assigned
            content = f"Ticket assigned to agent"
            actor_type = "human"
        
        actions.append(TicketAction(
            ticket_id=ticket_id,
            actor_type=actor_type,
            action_type=action_type,
            content=content,
            created_at=current_time,
        ))
    
    return actions


def seed_demo_data() -> None:
    """Seed database with 100 realistic demo tickets"""
    Base.metadata.create_all(bind=engine)
    
    with SessionLocal() as db:
        # Clear existing data
        print("Clearing existing data...")
        db.query(TicketAction).delete()
        db.query(Ticket).delete()
        db.query(Customer).delete()
        db.query(KBArticle).delete()
        db.query(User).delete()
        db.commit()
        
        # Seed users (password: demo123)
        print("Seeding users...")
        users = [
            User(name="Alex Agent", email="alex.agent@example.com", role="agent", hashed_password=get_password_hash("demo123")),
            User(name="Riley Admin", email="riley.admin@example.com", role="admin", hashed_password=get_password_hash("demo123")),
            User(name="Sam Support", email="sam.support@example.com", role="agent", hashed_password=get_password_hash("demo123")),
            User(name="Jordan Tech", email="jordan.tech@example.com", role="agent", hashed_password=get_password_hash("demo123")),
        ]
        db.add_all(users)
        db.commit()
        
        # Seed customers
        print("Seeding customers...")
        customers = [
            Customer(
                name="Acme Retail Corp",
                email="ops@acme-retail.com",
                segment="Enterprise",
                region="US",
                risk_score=8.5,
            ),
            Customer(
                name="Nova Fab Systems",
                email="engineering@novafab.com",
                segment="Enterprise",
                region="EU",
                risk_score=7.2,
            ),
            Customer(
                name="TechStart Inc",
                email="support@techstart.io",
                segment="SMB",
                region="US",
                risk_score=6.8,
            ),
            Customer(
                name="Global Solutions Ltd",
                email="it@globalsolutions.com",
                segment="Enterprise",
                region="APAC",
                risk_score=9.1,
            ),
            Customer(
                name="Digital Dynamics",
                email="admin@digitaldynamics.com",
                segment="SMB",
                region="EU",
                risk_score=5.5,
            ),
        ]
        db.add_all(customers)
        db.commit()
        
        # Seed KB articles
        print("Seeding knowledge base articles...")
        kb_articles = [
            KBArticle(
                title="How to reset your password",
                body="To reset your password: 1. Click 'Forgot Password' on login page. 2. Enter your email. 3. Check your inbox for reset link. 4. Click link and create new password.",
                tags="password,account,security",
            ),
            KBArticle(
                title="Troubleshooting API 500 errors",
                body="If you're receiving 500 errors: 1. Check API status page. 2. Verify your API key is valid. 3. Review request payload format. 4. Check rate limits. 5. Contact support if issue persists.",
                tags="api,errors,troubleshooting",
            ),
            KBArticle(
                title="Understanding billing cycles",
                body="Billing occurs on the same day each month. Charges appear 1-2 days after billing date. Pro-rated charges apply for mid-cycle upgrades. Refunds processed within 5-7 business days.",
                tags="billing,payments,subscription",
            ),
            KBArticle(
                title="Setting up SSO integration",
                body="To configure SSO: 1. Navigate to Settings > Security. 2. Click 'Configure SSO'. 3. Enter your IdP metadata URL. 4. Map user attributes. 5. Test with a user account. 6. Enable for organization.",
                tags="sso,security,integration",
            ),
            KBArticle(
                title="Performance optimization best practices",
                body="Optimize performance by: 1. Enabling caching. 2. Using pagination for large datasets. 3. Implementing database indexes. 4. Minimizing API calls. 5. Using CDN for static assets.",
                tags="performance,optimization,best-practices",
            ),
        ]
        db.add_all(kb_articles)
        db.commit()
        
        # Generate 100 tickets
        print("Generating 100 demo tickets...")
        tickets = []
        all_actions = []
        
        for i in range(100):
            # Pick random template and generate content
            template = random.choice(TICKET_TEMPLATES)
            ticket_data = generate_ticket_content(template)
            
            # Random status with realistic distribution
            status = random.choices(STATUSES, weights=STATUS_WEIGHTS)[0]
            
            # Random created date within last 30 days
            days_ago = random.randint(0, 30)
            hours_ago = random.randint(0, 23)
            created_at = datetime.now() - timedelta(days=days_ago, hours=hours_ago)
            updated_at = created_at + timedelta(hours=random.randint(1, 48))
            
            # Create ticket
            ticket = Ticket(
                title=ticket_data["title"],
                description=ticket_data["description"],
                status=status,
                priority=ticket_data["priority"],
                category=ticket_data["category"],
                created_by_user_id=random.choice([1, 2, 3, 4]),
                customer_id=random.choice([c.id for c in customers]),
                created_at=created_at,
                updated_at=updated_at,
            )
            tickets.append(ticket)
        
        # Add all tickets
        db.add_all(tickets)
        db.commit()
        
        # Generate actions for each ticket
        print("Generating action histories...")
        for ticket in tickets:
            actions = generate_actions_for_ticket(ticket.id, ticket.status, ticket.created_at)
            all_actions.extend(actions)
        
        db.add_all(all_actions)
        db.commit()
        
        print(f"\n✅ Successfully seeded demo database!")
        print(f"   - {len(users)} users")
        print(f"   - {len(customers)} customers")
        print(f"   - {len(kb_articles)} KB articles")
        print(f"   - {len(tickets)} tickets")
        print(f"   - {len(all_actions)} ticket actions")
        print(f"\nDatabase: {settings.database_url}")


if __name__ == "__main__":
    seed_demo_data()
