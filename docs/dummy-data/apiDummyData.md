# Dummy API Data

Use these bodies in Postman, Thunder Client, or your frontend while testing.

## Auth

### Register Customer

```json
{
  "email": "customer@example.com",
  "password": "123456",
  "role": "CUSTOMER",
  "firstName": "Rahim",
  "lastName": "Ahmed",
  "phone": "+8801711111111",
  "city": "Dhaka",
  "country": "Bangladesh"
}
```

### Register Seller

```json
{
  "email": "seller@example.com",
  "password": "123456",
  "role": "SELLER",
  "firstName": "Karim",
  "lastName": "Motors",
  "phone": "+8801722222222",
  "address": "Mirpur Auto Market",
  "city": "Dhaka",
  "country": "Bangladesh"
}
```

### Login

```json
{
  "email": "seller@example.com",
  "password": "123456"
}
```

### Refresh Token

```json
{
  "refreshToken": "paste-refresh-token-here"
}
```

## User/Profile

### Update Account

```json
{
  "email": "new-email@example.com"
}
```

### Update Profile

```json
{
  "firstName": "Karim",
  "lastName": "Uddin",
  "phone": "+8801799999999",
  "avatar": "https://example.com/avatar.jpg",
  "address": "House 12, Road 5",
  "city": "Dhaka",
  "country": "Bangladesh"
}
```

## Cars

### Create Car

```json
{
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2020,
  "price": 22500,
  "mileage": 35000,
  "fuelType": "PETROL",
  "transmission": "AUTOMATIC",
  "condition": "USED",
  "description": "Well maintained Toyota Corolla with clean papers.",
  "images": [
    {
      "url": "https://example.com/cars/corolla-front.jpg",
      "publicId": "cars/corolla-front"
    },
    {
      "url": "https://example.com/cars/corolla-side.jpg",
      "publicId": "cars/corolla-side"
    }
  ]
}
```

### Update Car

```json
{
  "price": 21500,
  "mileage": 36000,
  "description": "Price updated. Recently serviced."
}
```

### Car Filter URLs

```text
GET /api/v1/cars?brand=Toyota
GET /api/v1/cars?minPrice=10000&maxPrice=30000
GET /api/v1/cars?fuelType=PETROL&transmission=AUTOMATIC
GET /api/v1/cars?condition=USED&page=1&limit=10
```

## Favorites

No body needed.

```text
POST /api/v1/favorites/:carId
DELETE /api/v1/favorites/:carId
```

## Orders

### Create Order

```json
{
  "carId": "paste-car-id-here",
  "currency": "usd"
}
```

## Reviews

### Create Review

```json
{
  "rating": 5,
  "comment": "Great car and smooth buying experience."
}
```

## Admin

### Update User

```json
{
  "isActive": true,
  "role": "SELLER"
}
```

### Update Car Status

```json
{
  "status": "AVAILABLE"
}
```

### Update Order Status

```json
{
  "status": "COMPLETED"
}
```

## Enum Values

### UserRole

```text
CUSTOMER
SELLER
ADMIN
```

### CarStatus

```text
AVAILABLE
PENDING
SOLD
```

### FuelType

```text
PETROL
DIESEL
HYBRID
ELECTRIC
CNG
```

### Transmission

```text
MANUAL
AUTOMATIC
```

### CarCondition

```text
NEW
USED
```

### OrderStatus

```text
PENDING
PAID
CANCELLED
COMPLETED
```

### PaymentStatus

```text
PENDING
SUCCEEDED
FAILED
REFUNDED
```
