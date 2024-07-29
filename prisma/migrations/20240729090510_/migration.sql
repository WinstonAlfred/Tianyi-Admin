-- CreateTable
CREATE TABLE "Ship" (
    "id" VARCHAR(225) NOT NULL,

    CONSTRAINT "Ship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" VARCHAR(225) NOT NULL,
    "Ship_from" VARCHAR(225) NOT NULL,
    "Ship_destination" VARCHAR(225) NOT NULL,
    "Product" VARCHAR(225)[],
    "Capacity" INTEGER[],

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Detail" (
    "id" VARCHAR(225) NOT NULL,
    "Loading" TEXT[],
    "Unloading" TEXT[],
    "Daily_activities" TEXT[],

    CONSTRAINT "Detail_pkey" PRIMARY KEY ("id")
);
