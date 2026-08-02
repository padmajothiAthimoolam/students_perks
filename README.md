# Student Rewards Program

A React + TypeScript role-based school rewards application.

## User roles

- **Student:** enters marks, earns personal credits, views monthly reports, and redeems retail discount coupon rewards.
- **Principal:** views the progress, averages, earned credits, redeemed credits, and available balance of individual students in their school.
- **District Administrator:** compares progress across schools, including total credits, average performance, result volume, and coupon redemptions.

## Credit rules

- 90% or above: 20 credits
- 80%–89.9%: 15 credits
- 70%–79.9%: 10 credits
- 60%–69.9%: 5 credits
- Below 60%: 0 credits

## Retail rewards

The included coupons are demonstration data. Real deployment requires agreements with participating retailers, unique coupon issuance, expiry validation, fraud controls, and a secure redemption service.

## Run locally

```bash
npm install
npm run dev
```

## Production requirements

Replace local storage and demo role switching with a backend database and secure authentication. Add role-based authorization, school tenancy, protected APIs, audit logs, parent consent rules, retailer integrations, and privacy controls.

## State Minister Dashboard

- Separate State Minister role in the demo login
- District ranking based on the average of participating schools
- Top-performing district and top school highlighted
- Monthly performance filtering
- District, school, student, and result totals
- Expandable school ranking within each district
- Downloadable district performance CSV report
