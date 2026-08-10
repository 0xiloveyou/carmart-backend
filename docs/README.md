# Car Mart Backend

Car Mart is a Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, and Stripe backend for a car buy/sell marketplace.

## Main Features

- Customer and seller registration
- JWT login, refresh token, and logout
- Role-based access for `CUSTOMER`, `SELLER`, and `ADMIN`
- Seller car listing CRUD with images
- Public car browsing and filtering
- Customer favorites
- Customer order creation with Stripe PaymentIntent
- Stripe webhook payment confirmation
- Verified buyer reviews
- Admin user, car, order, payment, and review management

## Local Setup

```bash
npm install
npx prisma generate
npm run prisma:deploy
npm run dev
```

Default API URL:

```text
http://localhost:5000/api/v1
```

Root health check:

```text
GET http://localhost:5000/
```

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run prisma:generate
npm run prisma:deploy
npm run stripe:webhook
```

## Documentation

- API routes: [docs/api/apiDocumentation.md](docs/api/apiDocumentation.md)
- Dummy request data: [docs/dummy-data/apiDummyData.md](docs/dummy-data/apiDummyData.md)
- Response templates: [docs/templates/responseTemplates.md](docs/templates/responseTemplates.md)

## Auth Header

For protected routes, send:

```text
Authorization: Bearer <accessToken>
```

## Important Rules

- Public registration only accepts `CUSTOMER` or `SELLER`.
- Never create `ADMIN` from public registration.
- Sellers can only update/delete their own cars unless the user is admin.
- Customers can only review cars they purchased.
- Stripe webhook is the source of truth for successful payments.
