# Demo Data Guide

This document explains the demo data seeded in the application for demonstration purposes.

## Overview

The application comes with a comprehensive demo dataset that showcases all features:

- **100 realistic support tickets** with varied statuses, priorities, and categories
- **388 ticket actions** showing complete audit trails
- **5 customers** representing different segments and regions
- **4 users** (agents and admins)
- **5 knowledge base articles** for RAG functionality

## Seeding Demo Data

### Quick Start

To seed the database with demo data:

```bash
cd backend
python -m app.data.seed_demo_data
```

This will:
1. Clear existing data
2. Create 4 users (agents and admins)
3. Create 5 diverse customers
4. Generate 5 knowledge base articles
5. Generate 100 realistic tickets
6. Create action histories for each ticket

### Data Distribution

**Tickets by Status:**
- Open: ~30%
- In Progress: ~25%
- Resolved: ~30%
- Closed: ~15%

**Tickets by Priority:**
- P1 (Critical): ~12%
- P2 (High): ~43%
- P3 (Medium): ~39%
- P4 (Low): ~6%

**Tickets by Category:**
- Feature Requests: ~24%
- Billing Issues: ~20%
- Bugs: ~17%
- Integrations: ~17%
- Account Issues: ~11%
- Performance: ~7%
- Outages: ~4%

## Ticket Types

The demo data includes realistic tickets across various categories:

### Billing Issues
- Payment failures and duplicate charges
- Subscription management problems
- Invoice discrepancies

### Technical Bugs
- API errors and timeouts
- Mobile app crashes
- Dashboard loading issues
- Search functionality problems

### Service Outages
- Regional service disruptions
- Database connection issues
- CDN problems

### Feature Requests
- Dark mode
- Export functionality
- Two-factor authentication
- Bulk operations

### Account Issues
- Password reset problems
- Account lockouts
- Email verification issues

### Performance Issues
- Slow page loads
- Memory leaks
- Database query optimization

### Integration Issues
- Third-party sync failures
- Webhook delivery problems
- SSO authentication issues

## Action Histories

Each ticket includes a realistic action history:

- **Creation event**: When the ticket was created
- **Status changes**: Progression through workflow
- **Replies**: Customer communications
- **Internal notes**: Team collaboration
- **Assignments**: Ticket routing

Actions are timestamped realistically, showing tickets progressing over hours and days.

## Users

The demo includes 4 users:

1. **Alex Agent** (alex.agent@example.com) - Agent
2. **Riley Admin** (riley.admin@example.com) - Admin
3. **Sam Support** (sam.support@example.com) - Agent
4. **Jordan Tech** (jordan.tech@example.com) - Agent

## Customers

5 diverse customers representing different segments:

1. **Acme Retail Corp** - Enterprise, US, High risk (8.5)
2. **Nova Fab Systems** - Enterprise, EU, Medium risk (7.2)
3. **TechStart Inc** - SMB, US, Medium risk (6.8)
4. **Global Solutions Ltd** - Enterprise, APAC, High risk (9.1)
5. **Digital Dynamics** - SMB, EU, Low risk (5.5)

## Knowledge Base Articles

5 articles covering common topics:

1. Password reset procedures
2. API troubleshooting
3. Billing cycle information
4. SSO integration setup
5. Performance optimization

## Resetting Data

To reset and reseed the database:

```bash
cd backend
rm app/app.db  # Delete existing database
python -m app.data.seed_demo_data  # Reseed
```

## Original Sample Data

The original minimal seed data is still available:

```bash
cd backend
python -m app.data.seed_data
```

This creates only 3 tickets for basic testing.

## Demo Features Showcased

The demo data is designed to showcase:

✅ **Dashboard Metrics**
- Varied ticket counts across statuses
- Priority distribution charts
- Volume trends over 30 days

✅ **Filtering & Search**
- Multiple categories to filter
- Various priorities and statuses
- Searchable ticket titles and descriptions

✅ **Action Timelines**
- Complete audit trails
- Multiple action types
- Realistic timestamps

✅ **Customer Segmentation**
- Enterprise vs SMB customers
- Regional distribution
- Risk scoring

✅ **Ticket Variety**
- Different complexity levels
- Various technical domains
- Realistic business scenarios

## Tips for Demo

1. **Show filtering**: Filter by status, priority, or category
2. **Demonstrate search**: Search for "API", "billing", or "crash"
3. **View timelines**: Open tickets to see action histories
4. **Check metrics**: Dashboard shows realistic distributions
5. **Test AI assist**: Try AI suggestions on open tickets (requires API key)

## Customization

To customize the demo data, edit `backend/app/data/seed_demo_data.py`:

- Modify `TICKET_TEMPLATES` to add new ticket types
- Adjust `STATUS_WEIGHTS` to change distribution
- Update `REPLACEMENTS` for different placeholder values
- Change date ranges in `generate_actions_for_ticket()`

## Production Use

⚠️ **Important**: This demo data is for demonstration purposes only.

For production:
1. Use the original `seed_data.py` for minimal initial data
2. Let real tickets populate naturally
3. Remove demo customers and users
4. Clear action histories

---

**Need help?** Check the main README.md for full application documentation.
