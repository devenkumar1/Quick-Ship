-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" INTEGER;

-- CreateTable
CREATE TABLE "PendingRequest" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "accountType" "Role" NOT NULL DEFAULT 'SELLER',
    "ReqStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "contact" INTEGER NOT NULL,

    CONSTRAINT "PendingRequest_pkey" PRIMARY KEY ("id")
);
