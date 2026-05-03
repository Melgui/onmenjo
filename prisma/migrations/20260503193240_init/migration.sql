-- CreateTable
CREATE TABLE "Restaurant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "barri" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "ticket" BOOLEAN NOT NULL DEFAULT false,
    "sodexo" BOOLEAN NOT NULL DEFAULT false,
    "coverflex" BOOLEAN NOT NULL DEFAULT false,
    "pluxee" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);
