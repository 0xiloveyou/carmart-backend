# API Response Templates

These templates show the response shape you can use when designing the frontend.

## Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": {}
}
```

## Success Response With Pagination

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cars retrieved successfully",
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

## Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "name": "Error",
  "errorCode": null,
  "message": "Something went wrong",
  "error": "Stack trace in development"
}
```

## Auth Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": "user-id",
      "email": "seller@example.com",
      "role": "SELLER",
      "isActive": true,
      "createdAt": "2026-08-09T10:00:00.000Z",
      "updatedAt": "2026-08-09T10:00:00.000Z",
      "profile": {
        "id": "profile-id",
        "userId": "user-id",
        "firstName": "Karim",
        "lastName": "Motors",
        "phone": "+8801722222222",
        "avatar": null,
        "address": "Mirpur Auto Market",
        "city": "Dhaka",
        "country": "Bangladesh",
        "createdAt": "2026-08-09T10:00:00.000Z",
        "updatedAt": "2026-08-09T10:00:00.000Z"
      }
    },
    "accessToken": "jwt-access-token",
    "refreshToken": "jwt-refresh-token"
  }
}
```

## User Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": "user-id",
    "email": "customer@example.com",
    "role": "CUSTOMER",
    "isActive": true,
    "createdAt": "2026-08-09T10:00:00.000Z",
    "updatedAt": "2026-08-09T10:00:00.000Z",
    "profile": {
      "id": "profile-id",
      "userId": "user-id",
      "firstName": "Rahim",
      "lastName": "Ahmed",
      "phone": "+8801711111111",
      "avatar": null,
      "address": null,
      "city": "Dhaka",
      "country": "Bangladesh",
      "createdAt": "2026-08-09T10:00:00.000Z",
      "updatedAt": "2026-08-09T10:00:00.000Z"
    }
  }
}
```

## Car Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Car retrieved successfully",
  "data": {
    "id": "car-id",
    "sellerId": "seller-id",
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2020,
    "price": "22500",
    "mileage": 35000,
    "fuelType": "PETROL",
    "transmission": "AUTOMATIC",
    "condition": "USED",
    "description": "Well maintained Toyota Corolla with clean papers.",
    "status": "AVAILABLE",
    "createdAt": "2026-08-09T10:00:00.000Z",
    "updatedAt": "2026-08-09T10:00:00.000Z",
    "seller": {
      "id": "seller-id",
      "email": "seller@example.com",
      "role": "SELLER",
      "profile": {}
    },
    "images": [
      {
        "id": "image-id",
        "carId": "car-id",
        "url": "https://example.com/cars/corolla-front.jpg",
        "publicId": "cars/corolla-front",
        "createdAt": "2026-08-09T10:00:00.000Z"
      }
    ],
    "reviews": [],
    "averageRating": 0,
    "reviewCount": 0
  }
}
```

## Cars List Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Cars retrieved successfully",
  "data": [
    {
      "id": "car-id",
      "brand": "Toyota",
      "model": "Corolla",
      "year": 2020,
      "price": "22500",
      "mileage": 35000,
      "fuelType": "PETROL",
      "transmission": "AUTOMATIC",
      "condition": "USED",
      "status": "AVAILABLE",
      "images": [],
      "seller": {},
      "averageRating": 0,
      "reviewCount": 0
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1
  }
}
```

## Order Response

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Order created successfully",
  "data": {
    "id": "order-id",
    "carId": "car-id",
    "customerId": "customer-id",
    "sellerId": "seller-id",
    "amount": "22500",
    "status": "PENDING",
    "createdAt": "2026-08-09T10:00:00.000Z",
    "updatedAt": "2026-08-09T10:00:00.000Z",
    "car": {},
    "customer": {},
    "seller": {},
    "payment": {
      "id": "payment-id",
      "orderId": "order-id",
      "stripePaymentIntentId": "pi_xxxxxxxxx",
      "amount": "22500",
      "currency": "usd",
      "status": "PENDING",
      "paidAt": null,
      "createdAt": "2026-08-09T10:00:00.000Z",
      "updatedAt": "2026-08-09T10:00:00.000Z"
    },
    "clientSecret": "pi_xxxxxxxxx_secret_xxxxxxxxx"
  }
}
```

## Favorite Response

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Favorite saved successfully",
  "data": {
    "id": "favorite-id",
    "userId": "user-id",
    "carId": "car-id",
    "createdAt": "2026-08-09T10:00:00.000Z",
    "car": {}
  }
}
```

## Review Response

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Review created successfully",
  "data": {
    "id": "review-id",
    "carId": "car-id",
    "customerId": "customer-id",
    "orderId": "order-id",
    "rating": 5,
    "comment": "Great car and smooth buying experience.",
    "createdAt": "2026-08-09T10:00:00.000Z",
    "updatedAt": "2026-08-09T10:00:00.000Z"
  }
}
```
