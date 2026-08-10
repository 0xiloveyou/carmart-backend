# Car Mart API Documentation

Base URL:

```text
http://localhost:5000/api/v1
```

Protected routes require:

```text
Authorization: Bearer <accessToken>
```

## Auth Routes

### Register

```http
POST /auth/register
```

Used for creating a customer or seller account. Public registration does not allow `ADMIN`.

Allowed roles:

```text
CUSTOMER
SELLER
```

### Login

```http
POST /auth/login
```

Used for login with email and password. Returns access and refresh tokens.

### Refresh Token

```http
POST /auth/refresh-token
```

Used for generating a new access token from a valid refresh token.

### Logout

```http
POST /auth/logout
```

Used for deleting the current refresh token and clearing auth cookies.

## User Routes

### Get My Account

```http
GET /users/me
```

Used by a logged-in user to load account and profile data.

### Update My Account

```http
PATCH /users/me
```

Used to update safe account fields, such as email.

### Update My Profile

```http
PATCH /users/me/profile
```

Used to update profile fields like name, phone, avatar, address, city, and country.

## Car Routes

### Get Cars

```http
GET /cars
```

Public route for browsing available cars.

Supported query params:

```text
brand
model
minPrice
maxPrice
year
fuelType
transmission
condition
status
page
limit
```

Example:

```http
GET /cars?brand=Toyota&minPrice=10000&maxPrice=30000&page=1&limit=10
```

### Get Car Details

```http
GET /cars/:id
```

Public route for one car details, seller information, images, and reviews summary.

### Create Car

```http
POST /cars
```

Role:

```text
SELLER
```

Used by sellers to create a listing. The backend uses the logged-in seller id, not a frontend `sellerId`.

### Update Car

```http
PATCH /cars/:id
```

Roles:

```text
SELLER
ADMIN
```

Sellers can update only their own cars. Admin can update any car.

### Delete Car

```http
DELETE /cars/:id
```

Roles:

```text
SELLER
ADMIN
```

Sellers can delete only their own cars. Admin can delete any car.

## Review Routes

### Get Car Reviews

```http
GET /cars/:carId/reviews
```

Public route for loading reviews for a car.

### Create Review

```http
POST /cars/:carId/reviews
```

Role:

```text
CUSTOMER
```

Only customers with a paid or completed order for the car can review it.

## Favorite Routes

### Get My Favorites

```http
GET /favorites
```

Used by a logged-in user to load saved cars.

### Add Favorite

```http
POST /favorites/:carId
```

Used to save a car.

### Remove Favorite

```http
DELETE /favorites/:carId
```

Used to remove a saved car.

## Order Routes

### Create Order

```http
POST /orders
```

Role:

```text
CUSTOMER
```

Used by customers to start buying a car. Creates an order, reserves the car, creates a Stripe PaymentIntent, and returns a Stripe `clientSecret`.

### Get My Orders

```http
GET /orders/my-orders
```

Used by a customer to view their orders.

### Get Order Details

```http
GET /orders/:id
```

Used by the customer, seller, or admin to view an order.

### Cancel Order

```http
PATCH /orders/:id/cancel
```

Role:

```text
CUSTOMER
```

Used by a customer to cancel their own pending order.

## Payment Routes

### Get Payment By Order

```http
GET /payments/:orderId
```

Used by the customer, seller, or admin to view payment data for an order.

## Webhook Routes

### Stripe Webhook

```http
POST /webhooks/stripe
```

Used by Stripe. Do not call this from the frontend. The webhook confirms payment success/failure and updates payment, order, and car status.

## Admin Routes

All admin routes require:

```text
ADMIN
```

### Users

```http
GET /admin/users
PATCH /admin/users/:id
DELETE /admin/users/:id
```

### Cars

```http
GET /admin/cars
PATCH /admin/cars/:id
DELETE /admin/cars/:id
```

### Orders

```http
GET /admin/orders
PATCH /admin/orders/:id
```

### Payments

```http
GET /admin/payments
```

### Reviews

```http
DELETE /admin/reviews/:id
```
