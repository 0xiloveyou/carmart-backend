-- Add seller snapshot to orders so purchase records keep seller history.
ALTER TABLE "Order" ADD COLUMN "sellerId" TEXT;

UPDATE "Order"
SET "sellerId" = "Car"."sellerId"
FROM "Car"
WHERE "Order"."carId" = "Car"."id";

ALTER TABLE "Order" ALTER COLUMN "sellerId" SET NOT NULL;

CREATE INDEX "Order_sellerId_idx" ON "Order"("sellerId");

ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
