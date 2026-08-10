# Car Buy & Sell Marketplace — Prisma Model & Backend Workflow

## 1. Project Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- Stripe payments

---

# 2. Recommended Prisma Models

For the first version, I recommend **9 main models**.

### Core models

1. `User`
2. `Profile`
3. `Car`
4. `CarImage`
5. `Order`
6. `Payment`
7. `Review`
8. `Favorite`
9. `RefreshToken`

You can add more models later if the project grows.

---

# 3. Model Relationship Overview

```text
User
 ├── Profile
 ├── Cars                    (seller)
 ├── Orders                  (customer)
 ├── Reviews
 ├── Favorites
 └── RefreshTokens

Car
 ├── Seller/User
 ├── CarImages
 ├── Order
 ├── Reviews
 └── Favorites

Order
 ├── Customer/User
 ├── Car
 └── Payment
```

Basic flow:

```text
User
  |
  +---- Profile
  |
  +---- Seller ----> Car ----> CarImage
  |
  +---- Customer --> Order --> Payment
                         |
                         +--> Review
```

---

# 4. User Model

The `User` model handles authentication and authorization.

Important fields:

```text
id
email
password
role
isActive
createdAt
updatedAt
```

Recommended roles:

```text
CUSTOMER
SELLER
ADMIN
```

## Important security rule

The registration API must NEVER accept `ADMIN` from the client.

Bad:

```json
{
  "email": "test@gmail.com",
  "password": "123456",
  "role": "ADMIN"
}
```

The backend should ignore/reject the role field during registration.

Instead:

```text
POST /auth/register

{
  email,
  password,
  role: CUSTOMER or SELLER
}
```

Better yet, validate the allowed roles with Zod:

```text
CUSTOMER | SELLER
```

Then Prisma can still contain:

```text
ADMIN
```

The admin role can only be assigned manually through a controlled database/admin operation.

Example:

```sql
UPDATE "User"
SET role = 'ADMIN'
WHERE email = 'admin@example.com';
```

Do not create an endpoint such as:

```text
POST /users/change-role
```

for normal users.

---

# 5. Profile Model

Keep authentication data separate from profile information.

Example fields:

```text
id
userId
firstName
lastName
phone
avatar
address
city
country
createdAt
updatedAt
```

Relationship:

```text
User 1 ---- 1 Profile
```

This makes it easier to expand the profile later without putting everything inside `User`.

---

# 6. Car Model

This is the main marketplace model.

Recommended fields:

```text
id
sellerId
brand
model
year
price
mileage
fuelType
transmission
condition
description
status
createdAt
updatedAt
```

Example status:

```text
AVAILABLE
SOLD
PENDING
```

Example fuel types:

```text
PETROL
DIESEL
HYBRID
ELECTRIC
CNG
```

Example transmission:

```text
MANUAL
AUTOMATIC
```

Relationship:

```text
User (Seller)
      |
      | 1
      |
      | N
     Car
```

A seller can list multiple cars.

---

# 7. CarImage Model

Do not store multiple image URLs directly inside `Car`.

Use a separate model.

```text
Car
 |
 +---- CarImage
        + url
        + publicId
        + createdAt
```

Recommended fields:

```text
id
carId
url
publicId
createdAt
```

This allows:

```text
1 Car
  |
  +-- Image 1
  +-- Image 2
  +-- Image 3
  +-- Image 4
```

You can use Cloudinary, S3, or another image-storage service later.

---

# 8. Order Model

When a customer buys a car, create an `Order`.

Recommended fields:

```text
id
carId
customerId
sellerId
amount
status
createdAt
updatedAt
```

Order status:

```text
PENDING
PAID
CANCELLED
COMPLETED
```

The important relationships are:

```text
Customer ----> Order <---- Car
                    |
                    +---- Seller
```

Although `sellerId` can technically be obtained from `Car`, storing it in the order creates a useful historical snapshot of who sold the vehicle.

---

# 9. Payment Model

Keep payment information separate from the order.

Recommended fields:

```text
id
orderId
stripePaymentIntentId
amount
currency
status
paidAt
createdAt
```

Example payment status:

```text
PENDING
SUCCEEDED
FAILED
REFUNDED
```

Relationship:

```text
Order 1 ---- 1 Payment
```

The Stripe PaymentIntent ID should be stored so you can safely match Stripe events with your database records.

---

# 10. Review Model

A customer should only be able to review a car after successfully purchasing it.

Recommended fields:

```text
id
carId
customerId
orderId
rating
comment
createdAt
updatedAt
```

Example:

```text
rating = 1 to 5
```

Relationship:

```text
Customer
   |
   +---- Review ----> Car
          |
          +---- Order
```

The `orderId` is important.

It allows the backend to verify:

```text
Did this customer actually purchase this car?
```

before allowing a review.

Recommended rule:

```text
1 customer + 1 order = maximum 1 review
```

You can enforce this with a unique constraint.

---

# 11. Favorite Model

This is optional for the MVP, but highly recommended.

Customers can save cars they are interested in.

```text
id
userId
carId
createdAt
```

Relationship:

```text
Customer ---- Favorite ---- Car
```

Use a unique constraint:

```text
(userId, carId)
```

so the same customer cannot favorite the same car twice.

---

# 12. RefreshToken Model

If you use JWT access tokens + refresh tokens, store refresh tokens in the database.

Recommended fields:

```text
id
userId
token
expiresAt
createdAt
```

Relationship:

```text
User 1 ---- N RefreshToken
```

This allows multiple logged-in devices/sessions.

You can also revoke a specific refresh token.

---

# 13. Total Model Count

Recommended MVP:

```text
1. User
2. Profile
3. Car
4. CarImage
5. Order
6. Payment
7. Review
8. Favorite
9. RefreshToken
```

### Total = 9 Prisma models

For a simple first version, you could remove `Favorite` and use **8 models**.

I would personally start with the **9-model design** because it gives you a clean marketplace architecture without being unnecessarily complex.

---

# 14. Registration Workflow

## Customer registration

```text
Client
  |
  | POST /auth/register
  v
Express Controller
  |
  v
Validate request with Zod
  |
  v
Check email
  |
  v
Hash password with bcrypt
  |
  v
Create User
  |
  | role = CUSTOMER
  v
Create Profile
  |
  v
Return response
```

## Seller registration

Exactly the same flow:

```text
role = SELLER
```

The client can choose:

```text
CUSTOMER
SELLER
```

but never:

```text
ADMIN
```

The backend must enforce this, not just the frontend.

---

# 15. Admin Creation Workflow

Do NOT allow:

```text
POST /auth/register
{
  "role": "ADMIN"
}
```

Instead, create an initial admin manually.

Example:

```text
Register normal user
        |
        v
Database
        |
        v
Manually change role
        |
        v
ADMIN
```

For production, you can also create a protected admin seed script.

Example concept:

```text
prisma/seed.ts

find admin email
      |
      v
create/update user
      |
      v
role = ADMIN
```

---

# 16. Login Workflow

```text
Client
  |
  | email + password
  v
POST /auth/login
  |
  v
Find User
  |
  v
Compare password
  |
  v
Generate Access Token
  |
  +----> JWT
  |
  v
Generate Refresh Token
  |
  v
Store refresh token
  |
  v
Return tokens
```

JWT payload can contain:

```text
userId
role
```

Example:

```json
{
  "userId": "123",
  "role": "SELLER"
}
```

Do not put sensitive information such as passwords into JWT.

---

# 17. Authentication Middleware

Protected requests:

```text
Client
  |
  | Authorization: Bearer <accessToken>
  v
Express
  |
  v
authMiddleware
  |
  v
Verify JWT
  |
  v
req.user
  |
  v
Controller
```

Example:

```text
req.user = {
  id,
  role
}
```

---

# 18. Role Authorization

Create separate authorization middleware.

Example:

```text
requireRole("SELLER")
```

or:

```text
requireRole("ADMIN")
```

Example routes:

```text
POST /cars
        |
        +-- authMiddleware
        |
        +-- requireRole(SELLER)
```

Admin:

```text
DELETE /cars/:id
        |
        +-- authMiddleware
        |
        +-- requireRole(ADMIN)
```

Customer:

```text
POST /orders
        |
        +-- authMiddleware
        |
        +-- requireRole(CUSTOMER)
```

---

# 19. Seller Creates Car

```text
Seller
  |
  | POST /cars
  v
JWT Authentication
  |
  v
Check SELLER role
  |
  v
Validate car data
  |
  v
Create Car
  |
  v
Upload images
  |
  v
Create CarImage records
  |
  v
Return car
```

Example:

```text
Seller
  |
  +--> Car
        |
        +--> CarImage
        +--> CarImage
        +--> CarImage
```

---

# 20. Customer Browses Cars

Public endpoint:

```text
GET /cars
```

Useful filters:

```text
brand
model
minPrice
maxPrice
year
fuelType
transmission
condition
```

Example:

```text
GET /cars?brand=Toyota&minPrice=1000000&maxPrice=3000000
```

The response can include:

```text
car
seller information
images
average rating
review count
```

---

# 21. Customer Purchases Car

The safest flow is:

```text
Customer
   |
   | POST /orders
   v
Backend
   |
   v
Check customer authentication
   |
   v
Find Car
   |
   v
Check Car = AVAILABLE
   |
   v
Create Order
   |
   v
Create Stripe PaymentIntent
   |
   v
Save Payment
   |
   v
Return Stripe client secret
```

The frontend then uses Stripe to complete payment.

---

# 22. Stripe Payment Workflow

Recommended architecture:

```text
Frontend
   |
   | Request purchase
   v
Backend
   |
   | Create Order
   |
   | Create PaymentIntent
   v
Stripe
   |
   | client_secret
   v
Frontend
   |
   | Stripe payment
   v
Stripe
   |
   | webhook
   v
Backend
   |
   v
Verify Stripe event
   |
   v
Update Payment
   |
   v
Update Order = PAID
   |
   v
Update Car = SOLD
```

### Important

Do NOT trust the frontend to tell your backend:

```text
payment = successful
```

Use the Stripe webhook as the source of truth.

---

# 23. Stripe Webhook

Example:

```text
POST /webhooks/stripe
```

Flow:

```text
Stripe
   |
   | payment_intent.succeeded
   v
Express webhook
   |
   v
Verify Stripe signature
   |
   v
Find Payment
   |
   v
Update Payment
   |
   v
Update Order
   |
   v
Mark Car SOLD
```

This is much safer than relying only on the frontend payment response.

---

# 24. Prevent Double Purchase

This is very important.

Imagine:

```text
Customer A ---> Car X
Customer B ---> Car X
```

both try to purchase at nearly the same time.

Your backend/database must prevent both orders from successfully buying the same car.

Use a transaction and proper database constraints/locking strategy.

Conceptually:

```text
BEGIN TRANSACTION

check car availability

if AVAILABLE:
    create order
    reserve/update car

COMMIT
```

You can use Prisma transactions:

```text
prisma.$transaction(...)
```

For the production version, design the reservation/payment state carefully so a car is not accidentally sold twice.

---

# 25. Review Workflow

After payment:

```text
Customer
   |
   | POST /cars/:carId/reviews
   v
Authentication
   |
   v
Check CUSTOMER
   |
   v
Find PAID/COMPLETED Order
   |
   v
Check customer owns the order
   |
   v
Check review does not already exist
   |
   v
Create Review
```

Example:

```text
Customer A
   |
   +--> bought Toyota Corolla
             |
             +--> Review
                    rating: 5
                    comment: "Great car."
```

A customer should NOT be able to review a car they never purchased.

---

# 26. Admin Workflow

Admin can have access to:

```text
GET    /admin/users
PATCH  /admin/users/:id
DELETE /admin/users/:id

GET    /admin/cars
PATCH  /admin/cars/:id
DELETE /admin/cars/:id

GET    /admin/orders
GET    /admin/payments

DELETE /admin/reviews/:id
```

Admin role is assigned outside public registration.

---

# 27. Suggested API Structure

```text
/api/v1

/auth
    POST /register
    POST /login
    POST /refresh-token
    POST /logout

/users
    GET /me
    PATCH /me
    PATCH /me/profile

/cars
    GET /
    GET /:id
    POST /
    PATCH /:id
    DELETE /:id

/cars/:carId/reviews
    GET /
    POST /

/favorites
    GET /
    POST /:carId
    DELETE /:carId

/orders
    POST /
    GET /my-orders
    GET /:id

/payments
    GET /:orderId

/webhooks
    POST /stripe

/admin
    GET /users
    PATCH /users/:id
    DELETE /users/:id
    GET /cars
    PATCH /cars/:id
    DELETE /cars/:id
    GET /orders
```

---

# 28. Recommended Backend Folder Structure

```text
src/
│
├── app.ts
├── server.ts
│
├── config/
│   ├── env.ts
│   └── stripe.ts
│
├── modules/
│   │
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.route.ts
│   │   └── auth.validation.ts
│   │
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.route.ts
│   │
│   ├── car/
│   │   ├── car.controller.ts
│   │   ├── car.service.ts
│   │   ├── car.route.ts
│   │   └── car.validation.ts
│   │
│   ├── order/
│   │   ├── order.controller.ts
│   │   ├── order.service.ts
│   │   └── order.route.ts
│   │
│   ├── payment/
│   │   ├── payment.controller.ts
│   │   ├── payment.service.ts
│   │   └── payment.route.ts
│   │
│   ├── review/
│   │   ├── review.controller.ts
│   │   ├── review.service.ts
│   │   └── review.route.ts
│   │
│   └── admin/
│       ├── admin.controller.ts
│       ├── admin.service.ts
│       └── admin.route.ts
│
├── middleware/
│   ├── auth.ts
│   ├── role.ts
│   ├── error.ts
│   └── notFound.ts
│
├── lib/
│   ├── prisma.ts
│   └── stripe.ts
│
└── utils/
    ├── jwt.ts
    ├── password.ts
    └── response.ts
```

---

# 29. Prisma Relationship Design

High-level Prisma relationships:

```text
User
 |
 +-- Profile              1:1
 |
 +-- Cars                 1:N
 |
 +-- Orders               1:N
 |
 +-- Reviews              1:N
 |
 +-- Favorites            1:N
 |
 +-- RefreshTokens        1:N


Car
 |
 +-- Seller               N:1 User
 |
 +-- Images               1:N
 |
 +-- Order                1:1 / historical purchase
 |
 +-- Reviews              1:N
 |
 +-- Favorites            1:N


Order
 |
 +-- Customer             N:1 User
 |
 +-- Car                  N:1 Car
 |
 +-- Payment              1:1


Review
 |
 +-- Customer             N:1 User
 +-- Car                  N:1 Car
 +-- Order                N:1 Order
```

---

# 30. Complete Business Flow

The entire application can be understood as this:

```text
                    REGISTRATION
                         |
             +-----------+-----------+
             |                       |
          CUSTOMER                 SELLER
             |                       |
             +-----------+-----------+
                         |
                         v
                       LOGIN
                         |
                         v
                    JWT AUTH
                         |
             +-----------+-----------+
             |                       |
          Browse Cars           Create Car
             |                       |
             |                   Upload Images
             |                       |
             +-----------+-----------+
                         |
                         v
                    Car Available
                         |
                         v
                 Customer Purchases
                         |
                         v
                     Create Order
                         |
                         v
                 Stripe PaymentIntent
                         |
                         v
                    Stripe Payment
                         |
                         v
                   Stripe Webhook
                         |
                         v
                 Payment = SUCCEEDED
                         |
                         v
                  Order = PAID
                         |
                         v
                    Car = SOLD
                         |
                         v
                  Customer Reviews
                         |
                         v
                     Review
```

---

# 31. Recommended Development Order

Build the project in this order:

```text
1. Prisma + PostgreSQL setup
2. User model
3. Profile model
4. Registration
5. Login + JWT
6. Refresh token
7. Auth middleware
8. Role middleware
9. Car model
10. Car CRUD
11. Car images
12. Public car search/filter
13. Order model
14. Stripe PaymentIntent
15. Stripe webhook
16. Payment model
17. Mark car as SOLD
18. Review model
19. Review authorization
20. Favorite model
21. Admin APIs
22. Error handling
23. Validation
24. Testing
25. Deployment
```

---

# 32. Most Important Security Rules

### Rule 1 — Never trust role from frontend

```text
Frontend -> role = ADMIN
```

must never create an admin.

Backend only accepts:

```text
CUSTOMER
SELLER
```

during registration.

---

### Rule 2 — Never trust payment status from frontend

Use:

```text
Stripe Webhook
```

as the payment confirmation.

---

### Rule 3 — Never trust sellerId from frontend

When creating a car:

```text
sellerId = req.user.id
```

not:

```text
sellerId = req.body.sellerId
```

---

### Rule 4 — Never trust customerId from frontend

When creating an order:

```text
customerId = req.user.id
```

---

### Rule 5 — Verify ownership

Seller should only edit/delete their own cars.

Customer should only access their own orders.

---

### Rule 6 — Reviews require a real purchase

Check the customer's paid/completed order before creating a review.

---

# 33. Final Architecture

```text
                    ┌──────────────┐
                    │     User     │
                    └──────┬───────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
          Profile        Seller       Customer
                           │             │
                           v             v
                          Car          Order
                           │             │
                       CarImage       Payment
                                         │
                                       Stripe
                                         │
                                         v
                                      Webhook
                                         │
                                         v
                                       PAID
                                         │
                           ┌─────────────┘
                           v
                         Review

                         Admin
                           │
                    manually assigned
                    in database/seed
```

## Final recommendation

Start with **9 models**:

```text
User
Profile
Car
CarImage
Order
Payment
Review
Favorite
RefreshToken
```

Do not add separate `Customer` and `Seller` database models. They are both users with different roles. This keeps the schema simpler and makes role-based authorization much easier.

The important separation is:

```text
User       -> identity/authentication
Profile    -> personal information
Car        -> marketplace listing
Order      -> purchase record
Payment    -> Stripe payment record
Review     -> verified buyer feedback
Favorite   -> saved cars
RefreshToken -> authentication sessions
```
