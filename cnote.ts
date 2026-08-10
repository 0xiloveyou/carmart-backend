/*


prisma/
│
├── schema.prisma
├── enums.prisma
│
├── user.prisma
├── profile.prisma
├── car.prisma
├── carImage.prisma
├── order.prisma
├── payment.prisma
├── review.prisma
├── favorite.prisma
└── refreshToken.prisma





http://localhost:3000/cars tihs page should be fetch all cars fro customar 



Car Routes

Get Cars

GET /cars

Public route for browsing available cars.

Supported query params:

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

Example:

GET /cars?brand=Toyota&minPrice=10000&maxPrice=30000&page=1&limit=10

Get Car Details

GET /cars/:id

 
*/