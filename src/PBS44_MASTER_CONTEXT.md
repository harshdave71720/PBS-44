# PBS-44 MASTER CONTEXT

## Project Information

Project Name:
PBS-44 Society Portal

Organization:
Shri Paliwal Brahman Samaj Panchayat
44 Shreni (Reg.), Indore

Primary Objective:
Bhavan Availability & Booking Assistance System

Secondary Objective:
Society Information Portal

---

# Core Product Vision

This application is NOT intended to be a complete online booking platform.

The primary goal is:

1. Allow members and visitors to check Bhavan availability.
2. Show whether the Bhavan is:
   - Available
   - Partially Available
   - Fully Booked
   - Reserved for Society Events
3. Help visitors contact Bhavan Mantri / Kosh Mantri.
4. Allow booking requests as an optional convenience.
5. Final booking confirmation happens offline.

Actual Workflow:

User
↓
Checks Availability
↓
Contacts Bhavan Mantri / Kosh Mantri

OR

Submits Booking Request
↓
Committee Reviews
↓
Offline Coordination
↓
Final Confirmation

---

# Technology Stack

Frontend:
- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui

Deployment Target:
- Vercel

Future Data Source:
- Google Sheets (preferred)
- MongoDB Atlas (under consideration)

---

# Branding

Organization:

श्री पालीवाल ब्राह्मण समाज पंचायत
44 श्रेणी ( रजि. ), इंदौर

Theme:

- Maroon
- Gold
- Cream

Homepage Banner:

- Charbhuja Ji Image

Footer:

© 2026 Copyright. All Rights Reserved.

Designed & Developed by

Yash Ajay Dave

and

Harsh Omprakash Dave

---

# Routes

/

Homepage

/booking

Bhavan Availability

/booking-form

Booking Request Form

/samaj-ka-vidhan

Society Constitution

/varshik-utsav

Annual Events

/sampark

Contact Directory

---

# Bhavans

1. मुख्य धर्मशाला
2. देवपुरी धर्मशाला
3. गोविंद कॉलोनी धर्मशाला

---

# Availability Status Model

AVAILABLE

PHONE_RESERVATION

HALF_BHAVAN

FULL_BHAVAN

SOCIETY_EVENT

UI Display:

✅ उपलब्ध

⚠️ फोन द्वारा आरक्षण

⚠️ आंशिक उपलब्ध

❌ पूर्ण बुक

卐 समाज कार्यक्रम

---

# Completed Milestones

## Milestone 1

Foundation

- Branding
- Theme
- Header
- Footer
- Navigation

## Milestone 2

Society Information Portal

- Samaj Ka Vidhan
- Varshik Utsav
- Prabandh Karyakarini
- Sampark

## Milestone 3

Availability Module

- Multi-Bhavan Support
- Calendar View
- Month Navigation
- Availability Statuses

## Milestone 4

Booking Intelligence

- Bhavan Selection
- Membership Number Logic
- Event Type Selection
- Availability Validation
- Booking Summary
- Society Rules
- Form Validation

---

# Booking Intelligence Rules

## Sooraj Pooja

Without Lunch

Hall Only

Charge:

₹750

## Sooraj Pooja With Lunch

Half Bhavan Charges Applicable

## Marriage

Typically Full Bhavan

## Member vs Outsider

Different pricing structures apply.

---

# Pricing Notes

IMPORTANT:

Pricing engine is NOT implemented yet.

Committee discussion pending.

Create pricing definitions only.

Avoid displaying final charges.

Final charges are determined offline.

Store all future pricing logic in:

src/domain/pricing/pricing.ts

or

src/features/booking/config/pricing.ts

---

# Current Booking Process

User submits request

Status:

PENDING

Availability confirmed by:

- Bhavan Mantri
- Kosh Mantri

Offline discussion occurs.

Final charges decided offline.

Booking confirmed manually.

---

# Dharmshala Pricing Reference

## Common Charges

Utensils:

Up to 1000 persons:
₹500

Above 1000 persons:
₹1000

Cleaning:
₹500

Electricity:
₹17 per unit

These are additional charges.

---

## Main Dharmshala

Members:

Full:
₹7000

Half:
₹3500

Outsiders:

Full:
₹21000

Half:
₹11000

---

## Devpuri Dharmshala

Members:

Full:
₹4100

Half:
₹3100

Outsiders:

₹11000

---

## Govind Colony Dharmshala

Members:

Full:
₹4100

Half:
₹3100

Outsiders:

Full:
₹7100

Half:
₹5100

---

# Important Product Decisions

Availability Transparency is MORE important than Online Booking.

The website should help users answer:

"Is the Bhavan available?"

rather than:

"Can I make payment online?"

Keep workflows simple.

Optimize for senior citizens.

Maintain existing theme and UI patterns.

---

# Future Roadmap

## Milestone 5

Availability Experience Enhancement

- Contact Bhavan Mantri CTA
- Contact Kosh Mantri CTA
- Booking Process Section
- Print Availability
- Better Availability Details

## Milestone 6

Repository Abstraction

AvailabilityRepository

MockAvailabilityRepository

GoogleSheetsAvailabilityRepository

## Milestone 7

Google Sheets Integration

or

MongoDB Evaluation

## Milestone 8

Admin Portal

Bhavan Mantri

Kosh Mantri

---

# Developer Notes

Never redesign unnecessarily.

Preserve:

- Maroon / Gold / Cream theme
- Society branding
- Simple UX
- Offline coordination model

Prefer incremental enhancements over major rewrites.