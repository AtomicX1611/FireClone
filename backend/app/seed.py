"""
seed.py — Seeds the database with 6 realistic meetings.
Run from the backend/ directory:
    python -m app.seed
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, date, timedelta
from app.database import SessionLocal, engine, Base
import app.models  # noqa — registers all models
from app.models.meeting import Meeting
from app.models.participant import Participant
from app.models.transcript_segment import TranscriptSegment
from app.models.meeting_summary import MeetingSummary
from app.models.action_item import ActionItem

Base.metadata.create_all(bind=engine)

MEETINGS_DATA = [
    # ─── 1. Engineering Sprint Planning ────────────────────────────────────────
    {
        "title": "Q3 Engineering Sprint Planning",
        "date": datetime.now() - timedelta(days=1, hours=2),
        "duration_seconds": 3240,  # 54 min
        "participants": [
            {"name": "Alex Rivera", "email": "alex@acme.com", "color": "#6C47FF"},
            {"name": "Priya Sharma", "email": "priya@acme.com", "color": "#FF6B6B"},
            {"name": "Marcus Chen", "email": "marcus@acme.com", "color": "#4ECDC4"},
            {"name": "Jordan Kim", "email": "jordan@acme.com", "color": "#FFE66D"},
        ],
        "transcript": [
            {"speaker": "Alex Rivera", "color": "#6C47FF", "start": 0, "end": 18, "text": "Good morning everyone. Let's kick off our Q3 sprint planning. We've got a packed agenda today — user authentication refactor, payment gateway migration, and the new dashboard analytics feature."},
            {"speaker": "Priya Sharma", "color": "#FF6B6B", "start": 19, "end": 42, "text": "Before we dive in, I want to flag a blocker from last sprint. The third-party auth SDK we're using is deprecated and our security scan flagged it as critical. We need to prioritize this migration to Auth0."},
            {"speaker": "Marcus Chen", "color": "#4ECDC4", "start": 43, "end": 78, "text": "Agreed on the Auth0 migration. I've already scoped it out — it's roughly 8 story points. We'll need to update the token validation logic across 12 API endpoints and coordinate a maintenance window for the cutover. I can own this with Jordan's help on the frontend token refresh flow."},
            {"speaker": "Jordan Kim", "color": "#FFE66D", "start": 79, "end": 105, "text": "Happy to help on the frontend side. The React context and localStorage management will need a full rewrite, but I can pair program with Marcus to make it smooth. I'm also concerned about the payment gateway migration timeline — Stripe's new API has some breaking changes in their webhook event structure."},
            {"speaker": "Alex Rivera", "color": "#6C47FF", "start": 106, "end": 130, "text": "Good catch on the Stripe webhooks. Let's timebox the payment migration to a dedicated spike this sprint and not commit to full delivery. Priya, can you lead the technical design doc for the Stripe v3 migration?"},
            {"speaker": "Priya Sharma", "color": "#FF6B6B", "start": 131, "end": 160, "text": "Absolutely. I'll draft the technical design doc by Wednesday and share it for async review. I'm thinking we handle the webhook signature verification separately from the API client migration — that way we can ship incrementally and roll back if needed."},
            {"speaker": "Marcus Chen", "color": "#4ECDC4", "start": 161, "end": 195, "text": "That's a solid approach, Priya. I'll add the auth migration tickets to the board and set up the Auth0 tenant in our staging environment today. Jordan, can you review the Postman collection I'll update for the new token endpoints?"},
            {"speaker": "Jordan Kim", "color": "#FFE66D", "start": 196, "end": 220, "text": "Sure. Also, for the dashboard analytics feature — are we still planning to use Recharts or are we switching to Nivo? I started a prototype with Recharts last week and the performance is solid even with 10k data points."},
            {"speaker": "Alex Rivera", "color": "#6C47FF", "start": 221, "end": 255, "text": "Let's stick with Recharts for now, Jordan. We can revisit if we hit performance issues at scale. I want to make sure we have working end-to-end analytics charts by the sprint demo. Marketing is presenting our Q3 metrics to the board the following week."},
            {"speaker": "Priya Sharma", "color": "#FF6B6B", "start": 256, "end": 290, "text": "One more thing — we need to decide on our release cadence for this sprint. I propose we do a mid-sprint deploy on Thursday to ship the auth migration, then a final deploy on Friday two weeks from now for analytics and payment. This gives us time to catch issues in staging."},
            {"speaker": "Marcus Chen", "color": "#4ECDC4", "start": 291, "end": 315, "text": "That release plan works for me. I'll set up the deployment checklist and coordinate with DevOps on the maintenance window notifications. Should we send user emails for the auth migration downtime or just update the status page?"},
            {"speaker": "Alex Rivera", "color": "#6C47FF", "start": 316, "end": 340, "text": "Update the status page and post in the #engineering Slack channel 24 hours before. No user emails needed for this one — estimated downtime is under 10 minutes. Alright, let's wrap up. Great planning session everyone. Marcus, send the sprint board link after standup."},
        ],
        "summary": {
            "overview": "The Q3 sprint planning meeting covered three major initiatives: Auth0 migration from a deprecated auth SDK (flagged as a critical security issue), Stripe payment gateway API v3 migration, and new dashboard analytics charts using Recharts. The team agreed to a phased release strategy with a mid-sprint deploy for auth and a final deploy for analytics. Marcus will own the auth backend migration with Jordan on the frontend, and Priya will lead the Stripe technical design doc.",
            "key_topics": ["Auth0 Migration", "Stripe API v3", "Dashboard Analytics", "Sprint Planning", "Release Cadence", "Security"],
            "chapters": [
                {"title": "Auth SDK Security Blocker", "start_time": 19, "summary": "Priya flagged a critical security issue with the deprecated auth SDK, prompting immediate prioritization of Auth0 migration (8 story points)."},
                {"title": "Payment Gateway Migration", "start_time": 106, "summary": "Stripe v3 API has breaking webhook changes; team agreed to a spike this sprint rather than full delivery. Priya to draft technical design doc."},
                {"title": "Dashboard Analytics Feature", "start_time": 196, "summary": "Recharts chosen for analytics charts. Working end-to-end demo required by sprint end for board presentation."},
                {"title": "Release Planning & Wrap-up", "start_time": 256, "summary": "Two-deploy cadence agreed: auth migration on Thursday mid-sprint, analytics + payments final deploy two weeks out."},
            ],
        },
        "action_items": [
            {"text": "Set up Auth0 tenant in staging environment", "assignee": "Marcus Chen", "due_date": date.today() + timedelta(days=1), "completed": True},
            {"text": "Draft Stripe v3 technical design document", "assignee": "Priya Sharma", "due_date": date.today() + timedelta(days=2), "completed": False},
            {"text": "Review Postman collection for new token endpoints", "assignee": "Jordan Kim", "due_date": date.today() + timedelta(days=3), "completed": False},
            {"text": "Set up deployment checklist and coordinate DevOps maintenance window", "assignee": "Marcus Chen", "due_date": date.today() + timedelta(days=5), "completed": False},
            {"text": "Complete Recharts analytics prototype with real API data", "assignee": "Jordan Kim", "due_date": date.today() + timedelta(days=7), "completed": False},
        ],
    },

    # ─── 2. Product Review ──────────────────────────────────────────────────────
    {
        "title": "Product Review — New Onboarding Flow",
        "date": datetime.now() - timedelta(days=3, hours=1),
        "duration_seconds": 2700,  # 45 min
        "participants": [
            {"name": "Sarah Mitchell", "email": "sarah@acme.com", "color": "#6C47FF"},
            {"name": "David Okafor", "email": "david@acme.com", "color": "#FF6B6B"},
            {"name": "Emma Larsson", "email": "emma@acme.com", "color": "#4ECDC4"},
            {"name": "Raj Patel", "email": "raj@acme.com", "color": "#A8E6CF"},
        ],
        "transcript": [
            {"speaker": "Sarah Mitchell", "color": "#6C47FF", "start": 0, "end": 20, "text": "Thanks for joining the product review. Today we're walking through the new onboarding flow designs that Emma's team has been working on. Our current activation rate is 34% at day 7 — we're targeting 55% with these changes."},
            {"speaker": "Emma Larsson", "color": "#4ECDC4", "start": 21, "end": 55, "text": "Thanks Sarah. So the core problem we identified in user research is that new users don't understand the value proposition until after they've set up their first workspace, which takes too long. Our solution is a progressive onboarding with three phases: instant wow moment, guided setup, and habit formation."},
            {"speaker": "David Okafor", "color": "#FF6B6B", "start": 56, "end": 85, "text": "I love the 'instant wow moment' concept. Can you walk us through what that looks like in the design? From a growth perspective, the faster we can show value, the better our trial-to-paid conversion. We saw a 40% lift in similar experiments at my previous company."},
            {"speaker": "Emma Larsson", "color": "#4ECDC4", "start": 86, "end": 120, "text": "Absolutely. The wow moment is a pre-populated demo workspace that appears immediately on signup — no setup required. The user lands on a fully-featured workspace with sample data, can play with all the features, and then we prompt them to 'make it yours' by importing their own data or inviting teammates."},
            {"speaker": "Raj Patel", "color": "#A8E6CF", "start": 121, "end": 150, "text": "That's a smart approach — similar to Notion's approach with templates. From the engineering side, I want to flag that generating personalized demo workspaces at scale will require some thought. Are we cloning from a master template, or generating dynamically based on the user's industry during signup?"},
            {"speaker": "Sarah Mitchell", "color": "#6C47FF", "start": 151, "end": 175, "text": "Great question, Raj. We're planning to clone from master templates, and we'll have 5 industry verticals: SaaS, agency, consulting, e-commerce, and enterprise. The industry selection happens on the signup page — just one extra field."},
            {"speaker": "David Okafor", "color": "#FF6B6B", "start": 176, "end": 205, "text": "One concern from a data perspective — if users see sample data that's too generic, it might feel fake and break trust. Can we make the sample data feel more realistic? Maybe use company names and personas from their LinkedIn or Google profile during OAuth signup?"},
            {"speaker": "Emma Larsson", "color": "#4ECDC4", "start": 206, "end": 235, "text": "We considered that, David. We're cautious about using personal data without explicit consent, especially for GDPR compliance. Our compromise is to use the user's first name throughout the demo workspace — so it says 'Hi Emma, here's your team meeting' — which feels personalized without pulling sensitive data."},
            {"speaker": "Raj Patel", "color": "#A8E6CF", "start": 236, "end": 265, "text": "That's a clean solution. On the engineering timeline, the template cloning system is about 2 weeks of backend work. If we start this sprint, we can have a beta ready for A/B testing in 6 weeks. I'd suggest we start with just 2 verticals — SaaS and agency — to validate before building all 5."},
            {"speaker": "Sarah Mitchell", "color": "#6C47FF", "start": 266, "end": 295, "text": "Perfect. Let's go with SaaS and agency for v1. David, can you set up the A/B test framework for this? We'll want to measure time-to-first-value, day-7 retention, and trial conversion rate as our primary metrics."},
            {"speaker": "David Okafor", "color": "#FF6B6B", "start": 296, "end": 320, "text": "On it. I'll configure the experiment in our analytics platform with a 50/50 split — new flow versus control. I'll have the event tracking spec ready by end of week so engineering can instrument the new screens correctly."},
        ],
        "summary": {
            "overview": "The product review focused on a new three-phase onboarding flow designed to increase day-7 activation from 34% to 55%. The key innovation is an 'instant wow moment' — a pre-populated demo workspace using industry-specific templates (starting with SaaS and Agency verticals). The team agreed on a personalization strategy using only the user's first name to maintain GDPR compliance. Engineering estimates 2 weeks for the template cloning backend, with A/B testing readiness in 6 weeks.",
            "key_topics": ["Onboarding Flow", "Activation Rate", "Demo Workspace", "A/B Testing", "GDPR Compliance", "Template System"],
            "chapters": [
                {"title": "Current Activation Problem", "start_time": 0, "summary": "Day-7 activation rate is 34%; target is 55%. New users don't see value before completing lengthy workspace setup."},
                {"title": "Three-Phase Onboarding Design", "start_time": 21, "summary": "Emma presented a progressive onboarding: instant wow moment (demo workspace), guided setup, and habit formation phases."},
                {"title": "Personalization & GDPR", "start_time": 176, "summary": "Team agreed to use only the user's first name for personalization, avoiding sensitive data to stay GDPR compliant."},
                {"title": "Engineering Timeline & A/B Test", "start_time": 236, "summary": "2-week backend build; v1 launches with SaaS and Agency templates only. David to configure 50/50 A/B test measuring time-to-value, retention, and conversion."},
            ],
        },
        "action_items": [
            {"text": "Configure A/B test framework with 50/50 split for new onboarding flow", "assignee": "David Okafor", "due_date": date.today() + timedelta(days=3), "completed": False},
            {"text": "Write event tracking spec for new onboarding screens", "assignee": "David Okafor", "due_date": date.today() + timedelta(days=5), "completed": False},
            {"text": "Begin template cloning system backend development", "assignee": "Raj Patel", "due_date": date.today() + timedelta(days=14), "completed": False},
            {"text": "Create SaaS and Agency demo workspace template content", "assignee": "Emma Larsson", "due_date": date.today() + timedelta(days=7), "completed": True},
        ],
    },

    # ─── 3. Client Demo — TechCorp ──────────────────────────────────────────────
    {
        "title": "TechCorp Enterprise Demo & Discovery Call",
        "date": datetime.now() - timedelta(days=5, hours=3),
        "duration_seconds": 3600,  # 60 min
        "participants": [
            {"name": "James Carter", "email": "james@acme.com", "color": "#6C47FF"},
            {"name": "Lisa Wong", "email": "lisa@acme.com", "color": "#FF6B6B"},
            {"name": "Michael Torres (TechCorp)", "email": "m.torres@techcorp.com", "color": "#4ECDC4"},
            {"name": "Nina Patel (TechCorp)", "email": "n.patel@techcorp.com", "color": "#FFE66D"},
        ],
        "transcript": [
            {"speaker": "James Carter", "color": "#6C47FF", "start": 0, "end": 22, "text": "Michael, Nina, great to finally meet you both. James Carter here, Head of Enterprise Sales. I have Lisa Wong, our Solutions Engineer, joining me today. We're excited to walk you through how Acme Platform is already helping companies like yours."},
            {"speaker": "Michael Torres (TechCorp)", "color": "#4ECDC4", "start": 23, "end": 55, "text": "Thanks for setting this up, James. I'm Michael, CTO at TechCorp. We have about 800 engineers globally and we've been evaluating developer productivity tools for the past quarter. Nina is our Head of Engineering Operations and she'll be leading the vendor evaluation."},
            {"speaker": "Nina Patel (TechCorp)", "color": "#FFE66D", "start": 56, "end": 90, "text": "Hi Lisa, hi James. Quick context on our challenges: we're dealing with significant developer context-switching — our engineers are bouncing between 12 different tools daily. We're seeing productivity losses especially around code review cycles and deployment coordination. We need something that consolidates our workflow."},
            {"speaker": "Lisa Wong", "color": "#FF6B6B", "start": 91, "end": 130, "text": "Nina, that resonates strongly with what we hear from our enterprise clients. Let me show you the unified workspace. This is where all your team's activity surfaces — PRs, deployments, incidents, and standup updates all in one view. Your engineers only need this one tab to get full context on any project."},
            {"speaker": "Michael Torres (TechCorp)", "color": "#4ECDC4", "start": 131, "end": 165, "text": "That's impressive. What does the integration story look like? We're running GitHub Enterprise, Jira, Datadog, and PagerDuty. We've had bad experiences with tools that claim to integrate but the integrations are shallow or break constantly."},
            {"speaker": "Lisa Wong", "color": "#FF6B6B", "start": 166, "end": 200, "text": "All four of those are tier-1 integrations for us — they're deeply integrated, not just webhook listeners. For GitHub Enterprise specifically, we pull PR context, review status, CI/CD pipeline data, and auto-populate standup items from merged PRs. For Jira, we have bi-directional sync at the ticket level."},
            {"speaker": "Nina Patel (TechCorp)", "color": "#FFE66D", "start": 201, "end": 230, "text": "The bi-directional Jira sync is something we haven't seen done well by anyone. Can you show us a live demo of that? Specifically, if I update a ticket status in Jira, how quickly does it reflect in your platform and vice versa?"},
            {"speaker": "Lisa Wong", "color": "#FF6B6B", "start": 231, "end": 265, "text": "Absolutely — let me pull up the live demo environment. So here I'm updating a Jira ticket from 'In Review' to 'Done'... and you can see it reflected here in under 2 seconds. In the reverse direction, if I mark a PR as merged here, the associated Jira ticket auto-transitions to 'Done'. The sync runs on webhooks so it's near real-time."},
            {"speaker": "Michael Torres (TechCorp)", "color": "#4ECDC4", "start": 266, "end": 295, "text": "That's exactly what we need. What's your enterprise pricing model? We'd be looking at somewhere between 750 and 850 seats. And do you have dedicated support for enterprise customers or is it shared support?"},
            {"speaker": "James Carter", "color": "#6C47FF", "start": 296, "end": 330, "text": "For 800 seats, you'd be in our Enterprise tier. Pricing is volume-based — I'll send you a custom quote after this call, but ballpark you're looking at $28-32 per seat per month, billed annually. Enterprise tier includes a dedicated Customer Success Manager, a 4-hour SLA for P1 issues, and a private Slack channel with our support team."},
            {"speaker": "Nina Patel (TechCorp)", "color": "#FFE66D", "start": 331, "end": 365, "text": "The dedicated CSM and Slack channel are important to us. What does your security compliance look like? We need SOC 2 Type II, and we have a hard requirement for data residency in the US — our engineering data cannot leave US servers."},
            {"speaker": "Lisa Wong", "color": "#FF6B6B", "start": 366, "end": 395, "text": "We're SOC 2 Type II certified — I'll send the report directly after this call. For data residency, we have a US-only hosting option on AWS us-east-1 and us-west-2. We can add a contractual data residency clause to the enterprise agreement. All customer data is encrypted at rest with AES-256 and in transit with TLS 1.3."},
            {"speaker": "Michael Torres (TechCorp)", "color": "#4ECDC4", "start": 396, "end": 425, "text": "That addresses our security requirements. Next steps — I'd like to do a 30-day pilot with 50 engineers from our platform team before any enterprise commitment. Can you facilitate that?"},
            {"speaker": "James Carter", "color": "#6C47FF", "start": 426, "end": 455, "text": "Absolutely. We can have a pilot environment provisioned within 48 hours. I'll loop in your CSM candidate immediately. I'll send the pilot agreement and SOC 2 report today. Nina, what's the best way to coordinate with your team for the technical setup?"},
        ],
        "summary": {
            "overview": "TechCorp enterprise discovery call with CTO Michael Torres and Head of Engineering Operations Nina Patel. TechCorp has 800 engineers struggling with context-switching across 12 tools. Lisa Wong demonstrated deep integrations with GitHub Enterprise, Jira (bi-directional sync), Datadog, and PagerDuty. Key requirements confirmed: SOC 2 Type II, US data residency, dedicated CSM, and 4-hour P1 SLA. TechCorp requested a 30-day pilot with 50 engineers; James will provision environment within 48 hours and send pricing quote and SOC 2 report.",
            "key_topics": ["Enterprise Sales", "Jira Integration", "Security Compliance", "Pilot Program", "Pricing", "Data Residency"],
            "chapters": [
                {"title": "Discovery & Pain Points", "start_time": 23, "summary": "TechCorp engineers context-switch across 12 tools daily. 800-engineer organization seeking workflow consolidation for code review and deployment coordination."},
                {"title": "Platform Demo", "start_time": 91, "summary": "Lisa demonstrated unified workspace and live bi-directional Jira sync — updating in under 2 seconds in both directions."},
                {"title": "Security & Compliance", "start_time": 331, "summary": "SOC 2 Type II certified, US-only AWS hosting available, AES-256 encryption. Contractual data residency clause can be added to enterprise agreement."},
                {"title": "Next Steps — Pilot", "start_time": 396, "summary": "30-day pilot approved for 50 engineers. Environment provisioned within 48 hours. James to send quote and SOC 2 report today."},
            ],
        },
        "action_items": [
            {"text": "Send custom pricing quote for 800 seats (Enterprise tier)", "assignee": "James Carter", "due_date": date.today() + timedelta(days=1), "completed": True},
            {"text": "Send SOC 2 Type II report to TechCorp", "assignee": "Lisa Wong", "due_date": date.today() + timedelta(days=1), "completed": True},
            {"text": "Provision 30-day pilot environment for 50 TechCorp engineers", "assignee": "James Carter", "due_date": date.today() + timedelta(days=2), "completed": False},
            {"text": "Assign and introduce dedicated CSM to TechCorp team", "assignee": "James Carter", "due_date": date.today() + timedelta(days=3), "completed": False},
            {"text": "Draft pilot agreement and send to Nina Patel for legal review", "assignee": "James Carter", "due_date": date.today() + timedelta(days=2), "completed": False},
        ],
    },

    # ─── 4. All-Hands ───────────────────────────────────────────────────────────
    {
        "title": "August All-Hands — Company Update",
        "date": datetime.now() - timedelta(days=7, hours=5),
        "duration_seconds": 4500,  # 75 min
        "participants": [
            {"name": "CEO — Aisha Nakamura", "email": "aisha@acme.com", "color": "#6C47FF"},
            {"name": "CFO — Robert Klein", "email": "robert@acme.com", "color": "#FF6B6B"},
            {"name": "VP Engineering — Tomas Novak", "email": "tomas@acme.com", "color": "#4ECDC4"},
            {"name": "VP Product — Grace Huang", "email": "grace@acme.com", "color": "#FFE66D"},
            {"name": "VP Sales — Derek Barnes", "email": "derek@acme.com", "color": "#A8E6CF"},
        ],
        "transcript": [
            {"speaker": "CEO — Aisha Nakamura", "color": "#6C47FF", "start": 0, "end": 35, "text": "Good morning everyone. Welcome to our August all-hands. We've had an incredible quarter and I want to take time to celebrate our wins before we look ahead. First and most importantly — we crossed $10M ARR last week. That's a company milestone we've been working toward for 3 years."},
            {"speaker": "CFO — Robert Klein", "color": "#FF6B6B", "start": 36, "end": 75, "text": "To add some color to that milestone: we grew ARR by 127% year-over-year, our net revenue retention is 118%, which means our existing customers are expanding faster than we're losing any. Gross margins improved from 68% to 74% this quarter, primarily driven by infrastructure cost optimizations the engineering team delivered."},
            {"speaker": "VP Engineering — Tomas Novak", "color": "#4ECDC4", "start": 76, "end": 110, "text": "Thanks Robert. I want to acknowledge the infrastructure work — the team rearchitected our database sharding strategy which reduced our AWS spend by $180k annually. We also shipped 3 major platform features this quarter: the workflow automation engine, the API v2 with GraphQL support, and the embedded analytics SDK. All three are generating meaningful upsell revenue."},
            {"speaker": "VP Product — Grace Huang", "color": "#FFE66D", "start": 111, "end": 150, "text": "On the product side, our NPS jumped from 32 to 51 this quarter — a huge improvement driven by the onboarding redesign and the response time improvements Tomas's team delivered. We launched in 3 new verticals: healthcare, legal, and real estate. Healthcare is already our fastest-growing segment at 34% of new logo ARR."},
            {"speaker": "VP Sales — Derek Barnes", "color": "#A8E6CF", "start": 151, "end": 185, "text": "Healthcare growth is real — we closed 8 healthcare enterprise accounts this quarter including two Fortune 500 hospital systems. Our average contract value grew from $28k to $41k annually. Pipeline for Q4 is the strongest we've ever seen: $4.2M in qualified pipeline against a $1.8M target. We're on track for a record quarter."},
            {"speaker": "CEO — Aisha Nakamura", "color": "#6C47FF", "start": 186, "end": 220, "text": "That's phenomenal, Derek. I want to talk about what's ahead. We're raising a Series B in Q4. The round will be $30-35M and will fund international expansion — starting with UK and Germany in Q1, and APAC in Q3 of next year. This is the biggest opportunity in our company's history."},
            {"speaker": "CFO — Robert Klein", "color": "#FF6B6B", "start": 221, "end": 255, "text": "For context on the Series B: at our current growth rate and NRR, we're targeting a valuation in the $150-200M range. We've had term sheets from three top-tier firms. We should have a signed term sheet by end of September. This capital will let us hire 80 people across engineering, sales, and customer success over the next 18 months."},
            {"speaker": "VP Engineering — Tomas Novak", "color": "#4ECDC4", "start": 256, "end": 290, "text": "On the hiring front, engineering will grow from 45 to 85 people. We're adding two new teams: an AI/ML team focused on predictive analytics, and a platform reliability team. We'll also be opening a second engineering hub in Lisbon — combination of timezone coverage and access to incredible talent."},
            {"speaker": "VP Product — Grace Huang", "color": "#FFE66D", "start": 291, "end": 325, "text": "Product will go from 12 to 20 people. Our roadmap priorities for next year are: a mobile app, enterprise SSO and SCIM provisioning, and a major AI features push using our proprietary data. We have a unique dataset after 3 years that can power genuinely differentiated AI features."},
            {"speaker": "CEO — Aisha Nakamura", "color": "#6C47FF", "start": 326, "end": 360, "text": "I want to close by saying — this company is built by every single person on this call. The $10M ARR is your achievement, not just the leadership team's. We're going to keep building something extraordinary together. Q&A is now open — drop questions in the chat or unmute."},
        ],
        "summary": {
            "overview": "Acme crossed $10M ARR at 127% year-over-year growth with 118% net revenue retention and improved gross margins (68%→74%). Healthcare is the fastest-growing vertical. The company is raising a Series B of $30-35M in Q4 targeting $150-200M valuation. Proceeds will fund UK/Germany expansion in Q1, APAC in Q3 next year, and 80 new hires across engineering, sales, and customer success.",
            "key_topics": ["$10M ARR Milestone", "Series B Fundraise", "Healthcare Vertical", "International Expansion", "Engineering Hiring", "NPS Improvement"],
            "chapters": [
                {"title": "Q3 Financial Results", "start_time": 0, "summary": "$10M ARR milestone, 127% YoY growth, 118% NRR, margins improved to 74%. Infrastructure rearchitecture saved $180k/yr."},
                {"title": "Product & Customer Success", "start_time": 111, "summary": "NPS improved from 32 to 51. Healthcare, legal, and real estate verticals launched. Healthcare already 34% of new logo ARR."},
                {"title": "Sales Momentum", "start_time": 151, "summary": "8 healthcare enterprise accounts closed; ACV grew from $28k to $41k. Q4 pipeline at $4.2M vs $1.8M target."},
                {"title": "Series B & Future Plans", "start_time": 186, "summary": "$30-35M Series B targeting close in September. UK/Germany in Q1, APAC Q3. 80 hires across engineering, sales, CS."},
            ],
        },
        "action_items": [
            {"text": "Finalize Series B pitch deck for investor meetings", "assignee": "CFO — Robert Klein", "due_date": date.today() + timedelta(days=5), "completed": False},
            {"text": "Post all-hands recording and summary to internal wiki", "assignee": "CEO — Aisha Nakamura", "due_date": date.today() + timedelta(days=2), "completed": True},
            {"text": "Draft Lisbon engineering hub job descriptions", "assignee": "VP Engineering — Tomas Novak", "due_date": date.today() + timedelta(days=10), "completed": False},
            {"text": "Share Q4 pipeline breakdown with all-hands slide deck", "assignee": "VP Sales — Derek Barnes", "due_date": date.today() + timedelta(days=3), "completed": True},
        ],
    },

    # ─── 5. Design Review ───────────────────────────────────────────────────────
    {
        "title": "Mobile App Design Review — v1 Mockups",
        "date": datetime.now() - timedelta(days=10, hours=4),
        "duration_seconds": 2400,  # 40 min
        "participants": [
            {"name": "Sofia Andersen", "email": "sofia@acme.com", "color": "#6C47FF"},
            {"name": "Liam O'Brien", "email": "liam@acme.com", "color": "#FF6B6B"},
            {"name": "Yuna Park", "email": "yuna@acme.com", "color": "#4ECDC4"},
        ],
        "transcript": [
            {"speaker": "Sofia Andersen", "color": "#6C47FF", "start": 0, "end": 25, "text": "Let's start the design review. Liam has the v1 mockups ready for the mobile app. This is our first pass at the core screens — home feed, notifications, and the main workspace view. We have 45 minutes so let's give thorough feedback."},
            {"speaker": "Liam O'Brien", "color": "#FF6B6B", "start": 26, "end": 65, "text": "Thanks, Sofia. I'll share my screen. So the design philosophy for mobile is 'desktop power, mobile simplicity'. The home feed shows the 5 most recent items with a persistent bottom navigation for the 4 main sections. I've used a card-based layout with swipe actions — right to complete, left to snooze."},
            {"speaker": "Yuna Park", "color": "#4ECDC4", "start": 66, "end": 95, "text": "The swipe actions are intuitive. I have two concerns though. First, the bottom navigation has 4 items but our analytics show users primarily use only 2 features on mobile — home and notifications. Are we overcomplicating the nav? Second, the card shadows feel very heavy for a productivity app."},
            {"speaker": "Liam O'Brien", "color": "#FF6B6B", "start": 96, "end": 125, "text": "On the nav — I can simplify to 3 items: Home, Notifications, and a More menu for secondary features. That keeps the primary interactions front-and-center. On the shadows — I can reduce the elevation from 4dp to 1dp and use a more subtle border instead. Let me pull up the lighter version."},
            {"speaker": "Sofia Andersen", "color": "#6C47FF", "start": 126, "end": 158, "text": "The lighter card version looks much better. I also want to talk about typography — the body text at 14sp feels too small for a thumb-friendly experience. iOS Human Interface Guidelines recommend 17sp for body text on mobile. Can we bump that up?"},
            {"speaker": "Yuna Park", "color": "#4ECDC4", "start": 159, "end": 190, "text": "Agreed on the typography. Also, for accessibility — are we meeting WCAG AA contrast ratios on the gray text in the card subtitles? On the light background version it looks borderline. I'd hate to fail accessibility audit after launch."},
            {"speaker": "Liam O'Brien", "color": "#FF6B6B", "start": 191, "end": 220, "text": "Good catch on accessibility. I'll run the full color contrast check with Stark before the next review. The gray subtitle color is #9CA3AF on white — I believe that's 3.2:1 contrast ratio which is below the 4.5:1 WCAG AA requirement. I'll update to #6B7280 which clears the threshold."},
            {"speaker": "Sofia Andersen", "color": "#6C47FF", "start": 221, "end": 250, "text": "Great catch and quick fix. Last topic — animations. The screen transitions look smooth but the notification badge animation feels too aggressive. Can we dial it back? A subtle scale from 0.9 to 1.0 is enough. We don't want the app to feel flashy — it's a productivity tool."},
            {"speaker": "Yuna Park", "color": "#4ECDC4", "start": 251, "end": 275, "text": "Totally agree on the animations. Less is more for productivity apps. One final thought — have we considered haptic feedback for the swipe actions? On iOS, haptics make swipe interactions feel much more satisfying and reduce errors by giving tactile confirmation."},
            {"speaker": "Liam O'Brien", "color": "#FF6B6B", "start": 276, "end": 300, "text": "Haptics are a great idea, Yuna. I'll spec out the haptic feedback patterns and we can prototype them in the Figma interactions once the visual design is locked. I'll incorporate all today's feedback and share the v2 mockups by Friday for async review before we hand off to development."},
        ],
        "summary": {
            "overview": "Design review of v1 mobile app mockups focused on the home feed, notifications, and workspace view. Key feedback: simplify bottom nav from 4 to 3 items, increase body text from 14sp to 17sp, fix WCAG AA contrast on subtitle text (#9CA3AF → #6B7280), reduce card elevation from 4dp to 1dp, tone down notification badge animation, and add haptic feedback specs for swipe actions. Liam will ship v2 mockups by Friday.",
            "key_topics": ["Mobile Design", "Typography", "Accessibility", "WCAG Compliance", "Navigation", "Haptic Feedback"],
            "chapters": [
                {"title": "Home Feed & Navigation", "start_time": 26, "summary": "Card-based layout with swipe actions. Navigation simplified from 4 to 3 items based on mobile usage analytics."},
                {"title": "Typography & Visual Weight", "start_time": 126, "summary": "Body text increased to 17sp per iOS HIG. Card elevation reduced from 4dp to 1dp for cleaner productivity aesthetic."},
                {"title": "Accessibility Audit", "start_time": 159, "summary": "Gray subtitle color #9CA3AF fails WCAG AA (3.2:1 ratio). Updated to #6B7280 which clears 4.5:1 threshold. Stark accessibility check required."},
                {"title": "Animations & Haptics", "start_time": 221, "summary": "Notification badge animation toned down. Haptic feedback specs added for swipe actions. V2 mockups due Friday."},
            ],
        },
        "action_items": [
            {"text": "Run WCAG color contrast check with Stark plugin", "assignee": "Liam O'Brien", "due_date": date.today() + timedelta(days=1), "completed": True},
            {"text": "Update subtitle color to #6B7280 across all mobile mockups", "assignee": "Liam O'Brien", "due_date": date.today() + timedelta(days=2), "completed": True},
            {"text": "Spec haptic feedback patterns for swipe actions", "assignee": "Liam O'Brien", "due_date": date.today() + timedelta(days=4), "completed": False},
            {"text": "Share v2 mobile mockups for async review", "assignee": "Liam O'Brien", "due_date": date.today() + timedelta(days=5), "completed": False},
            {"text": "Review v2 mockups and consolidate feedback", "assignee": "Sofia Andersen", "due_date": date.today() + timedelta(days=7), "completed": False},
        ],
    },

    # ─── 6. Weekly Standup ──────────────────────────────────────────────────────
    {
        "title": "Engineering Weekly Standup — Week 32",
        "date": datetime.now() - timedelta(hours=4),
        "duration_seconds": 1200,  # 20 min
        "participants": [
            {"name": "Alex Rivera", "email": "alex@acme.com", "color": "#6C47FF"},
            {"name": "Priya Sharma", "email": "priya@acme.com", "color": "#FF6B6B"},
            {"name": "Marcus Chen", "email": "marcus@acme.com", "color": "#4ECDC4"},
            {"name": "Jordan Kim", "email": "jordan@acme.com", "color": "#FFE66D"},
        ],
        "transcript": [
            {"speaker": "Alex Rivera", "color": "#6C47FF", "start": 0, "end": 20, "text": "Alright, quick standup. Let's keep it tight — yesterday, today, blockers. Marcus, you start."},
            {"speaker": "Marcus Chen", "color": "#4ECDC4", "start": 21, "end": 55, "text": "Yesterday I finished the Auth0 tenant setup in staging and ran integration tests — all passing. Today I'm writing the migration scripts for the existing user token store. Blocker: I need the JWT secret rotation schedule from DevOps before I can write the cutover script. Pinged them on Slack but no response yet."},
            {"speaker": "Alex Rivera", "color": "#6C47FF", "start": 56, "end": 70, "text": "I'll loop in the DevOps lead directly — expect a response within the hour. Priya, go ahead."},
            {"speaker": "Priya Sharma", "color": "#FF6B6B", "start": 71, "end": 105, "text": "Yesterday I drafted 60% of the Stripe v3 technical design doc. Today I'm finishing the webhook section and writing the rollback playbook. No blockers, but I'd love 30 minutes with Jordan this afternoon to walk through the webhook event structure changes — they affect the frontend payment status display."},
            {"speaker": "Jordan Kim", "color": "#FFE66D", "start": 106, "end": 135, "text": "I'm free at 3pm, Priya — let's do it. Yesterday I built the Recharts line chart component for the analytics dashboard. Today I'm wiring up the date range picker to the chart data feed. Blocker: the analytics API endpoint isn't returning data for date ranges longer than 90 days — getting a 504 timeout. Marcus, is that a known issue?"},
            {"speaker": "Marcus Chen", "color": "#4ECDC4", "start": 136, "end": 165, "text": "Yes, I saw that yesterday. The query isn't using the partition index correctly for large date ranges. It's a quick fix — I'll send you a patch in the next hour. The query needs a compound index on (user_id, created_at) that I missed in the initial migration."},
            {"speaker": "Alex Rivera", "color": "#6C47FF", "start": 166, "end": 195, "text": "Good catch and quick resolution. Two things from me: I reviewed the sprint board this morning — we're on track. Also, reminder that we have a code freeze at 5pm Thursday for the auth migration deploy. No PRs merged after that. I'll send the deploy runbook by tomorrow morning."},
            {"speaker": "Priya Sharma", "color": "#FF6B6B", "start": 196, "end": 215, "text": "Noted on the code freeze. Should we also pause the Stripe work during the auth deploy window? The payment flow touches some of the same session management code."},
            {"speaker": "Alex Rivera", "color": "#6C47FF", "start": 216, "end": 235, "text": "Good thinking, Priya. Yes — freeze all payment-related PRs from Thursday 5pm until Friday 10am after we've confirmed the auth migration is stable. Alright, that's a wrap. Good standup everyone — Jordan and Marcus, pair up on that index fix."},
        ],
        "summary": {
            "overview": "Engineering standup for Week 32. Marcus is unblocked on Auth0 migration pending JWT rotation schedule from DevOps (Alex escalating). Priya is 60% done with Stripe v3 design doc; will sync with Jordan at 3pm on webhook changes. Jordan identified a 504 timeout bug in the analytics API for date ranges >90 days — Marcus has a fix (compound index patch). Code freeze confirmed Thursday 5pm for auth migration, with payment PRs also frozen until Friday 10am.",
            "key_topics": ["Auth0 Migration", "Stripe Integration", "Analytics Bug", "Code Freeze", "Sprint Progress"],
            "chapters": [
                {"title": "Auth0 Migration Update", "start_time": 21, "summary": "Auth0 staging setup complete, integration tests passing. Blocked on JWT secret rotation schedule from DevOps."},
                {"title": "Stripe Design Doc", "start_time": 71, "summary": "Priya 60% done with Stripe v3 doc; webhook section remaining. Syncing with Jordan at 3pm on frontend impact."},
                {"title": "Analytics API Bug", "start_time": 106, "summary": "504 timeout for date ranges >90 days. Root cause: missing compound index on (user_id, created_at). Marcus sending patch within the hour."},
                {"title": "Code Freeze & Deploy Plan", "start_time": 166, "summary": "Auth migration deploy Thursday 5pm. Code freeze from 5pm Thu to 10am Fri. Payment PRs also frozen during window."},
            ],
        },
        "action_items": [
            {"text": "Escalate JWT rotation schedule request to DevOps lead", "assignee": "Alex Rivera", "due_date": date.today(), "completed": True},
            {"text": "Send compound index patch for analytics API 504 timeout", "assignee": "Marcus Chen", "due_date": date.today(), "completed": True},
            {"text": "Finish Stripe v3 technical design doc (webhook section + rollback playbook)", "assignee": "Priya Sharma", "due_date": date.today() + timedelta(days=1), "completed": False},
            {"text": "Send deploy runbook for auth migration", "assignee": "Alex Rivera", "due_date": date.today() + timedelta(days=1), "completed": False},
        ],
    },
]


def seed():
    db = SessionLocal()
    try:
        # Check if already seeded
        existing = db.query(Meeting).count()
        if existing > 0:
            print(f"Database already has {existing} meeting(s). Skipping seed.")
            return

        print("Seeding database with 6 meetings...")

        for i, data in enumerate(MEETINGS_DATA):
            # Create meeting
            meeting = Meeting(
                title=data["title"],
                date=data["date"],
                duration_seconds=data["duration_seconds"],
            )
            db.add(meeting)
            db.flush()

            # Create participants
            for p in data["participants"]:
                participant = Participant(
                    meeting_id=meeting.id,
                    name=p["name"],
                    email=p.get("email"),
                    color=p["color"],
                )
                db.add(participant)

            # Create transcript segments
            for j, seg in enumerate(data["transcript"]):
                segment = TranscriptSegment(
                    meeting_id=meeting.id,
                    speaker_name=seg["speaker"],
                    speaker_color=seg["color"],
                    start_time=seg["start"],
                    end_time=seg["end"],
                    text=seg["text"],
                    sequence=j,
                )
                db.add(segment)

            # Create summary
            s = data["summary"]
            chapters = [
                {"title": c["title"], "start_time": c["start_time"], "summary": c["summary"]}
                for c in s["chapters"]
            ]
            summary = MeetingSummary(
                meeting_id=meeting.id,
                overview=s["overview"],
                key_topics=s["key_topics"],
                chapters=chapters,
            )
            db.add(summary)

            # Create action items
            for ai in data["action_items"]:
                action_item = ActionItem(
                    meeting_id=meeting.id,
                    text=ai["text"],
                    assignee=ai.get("assignee"),
                    due_date=ai.get("due_date"),
                    completed=ai.get("completed", False),
                )
                db.add(action_item)

            print(f"  [OK] Seeded: {data['title']}")

        db.commit()
        print("\nDatabase seeded successfully with 6 meetings!")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
