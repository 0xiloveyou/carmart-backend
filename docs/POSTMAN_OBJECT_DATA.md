# Postman Object Data

## Register Customer

```json
{
  "name": "New Customer",
  "email": "new.customer@example.com",
  "password": "Customer@12345",
  "role": "CUSTOMER",
  "phone": "+8801711111111",
  "address": "Dhaka, Bangladesh"
}
```

## Register Seller

```json
{
  "name": "New Seller",
  "email": "new.seller@example.com",
  "password": "Seller@12345",
  "role": "SELLER",
  "phone": "+8801722222222",
  "address": "Banani, Dhaka"
}
```

## Login

```json
{
  "email": "seller@drivemart.com",
  "password": "Seller@12345"
}
```

## Create Car

```json
{
  "title": "Mazda Axela 2018",
  "brand": "Mazda",
  "model": "Axela",
  "year": 2018,
  "price": 2650000,
  "mileage": 42000,
  "location": "Dhaka",
  "color": "Red",
  "fuelType": "PETROL",
  "transmission": "AUTOMATIC",
  "engineCc": 1500,
  "imageUrl": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7",
  "gallery": [
    "https://images.unsplash.com/photo-1542362567-b07e54358753"
  ],
  "shortDescription": "Sporty compact sedan with clean papers and smooth drive.",
  "description": "Mazda Axela 2018 with maintained engine, comfortable interior, responsive handling, and updated documentation.",
  "features": ["ABS", "Airbags", "Rear camera", "Smart key"]
}
```

## Update Car Status

```json
{
  "status": "SOLD"
}
```

## Review

```json
{
  "rating": 5,
  "comment": "The seller responded quickly and the car details were accurate."
}
```

## Contact

```json
{
  "name": "Assignment Tester",
  "email": "tester@example.com",
  "subject": "Need help with a listing",
  "message": "I want to know whether this car is still available for inspection."
}
```

## Admin Update User

```json
{
  "role": "ADMIN",
  "status": "ACTIVE"
}
```
