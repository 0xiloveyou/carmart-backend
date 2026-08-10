# DriveMart API Documentation

Base URL:

```text
http://localhost:5000/api/v1
```

Use `Authorization: Bearer <accessToken>` for protected routes.

## Auth

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register as `CUSTOMER` or `SELLER`. |
| POST | `/auth/login` | Public | Login and receive access/refresh tokens. |
| POST | `/auth/refresh-token` | Public | Create a new access token from refresh token. |
| GET | `/auth/me` | Logged in | Get current user. |

## Home and Cars

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/home` | Public | Home data with limited preview sections. |
| GET | `/cars/preview` | Public | Six public preview cars for free users. |
| GET | `/cars/:id` | Public | Car details, reviews, related cars. |
| GET | `/cars` | Logged in | Full marketplace with search, filters, sorting, pagination. |
| GET | `/cars/my-listings` | Seller/Admin | Seller dashboard listings. |
| POST | `/cars` | Seller/Admin | Create a car listing. |
| PATCH | `/cars/:id` | Owner/Admin | Update a car listing. |
| DELETE | `/cars/:id` | Owner/Admin | Delete a car listing. |
| POST | `/cars/:carId/reviews` | Logged in | Add or update a review. |

Car list query examples:

```text
/cars?search=toyota&location=Dhaka&minPrice=1000000&maxPrice=5000000&sortBy=price&sortOrder=asc&page=1&limit=9
```

Filter fields include `search`, `brand`, `location`, `minPrice`, `maxPrice`, `fuelType`, `transmission`, and `status`.

## Users and Dashboard

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/users/profile` | Logged in | Get profile. |
| PATCH | `/users/profile` | Logged in | Update profile. |
| GET | `/users` | Admin | Manage users with filtering and pagination. |
| PATCH | `/users/:id` | Admin | Update user role/status/profile fields. |
| GET | `/dashboard/overview` | Seller/Admin | Overview cards and chart data. |

Admin can set any user to `ADMIN` from the database/API. Public registration cannot create admin accounts.

## Contacts

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/contacts` | Public | Submit contact form. |
| GET | `/contacts` | Admin | View contact messages. |
