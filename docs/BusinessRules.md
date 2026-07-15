# PBS-44 Business Rules

## Availability Input

- `eventType`
- `date`
- `timeSlot`
- `foodRequired`
- `existingBookings[]`

## Availability Output

- `AVAILABLE`
- `PARTIALLY_AVAILABLE`
- `KITCHEN_COORDINATION_REQUIRED`
- `CONFLICT_REVIEW_REQUIRED`
- `FULLY_OCCUPIED`

## Rule Set

1. **Sooraj Pooja**
   - Preferred area: `SPH`

2. **Sooraj Pooja + Lunch**
   - Preferred areas: `SPH + FLW`

3. **Shraddha Paksh**
   - Multiple bookings are allowed.
   - One booking may use `GF`.
   - Another booking may use `FLW`.

4. **Birthday Party**
   - Usually expected in `EVENING` slot.

5. **Kitchen (critical shared resource)**
   - If another **approved** booking already owns kitchen for the same date and slot:
     - Return `KITCHEN_COORDINATION_REQUIRED`
     - Do **not** auto-approve.
