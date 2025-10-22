/*
  Warnings:

  - You are about to drop the column `difficulty` on the `trail` table. All the data in the column will be lost.
  - You are about to drop the `checkin` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[bookingId,idNumber]` on the table `BookingMember` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `checkin` DROP FOREIGN KEY `Checkin_bookingId_fkey`;

-- DropForeignKey
ALTER TABLE `checkin` DROP FOREIGN KEY `Checkin_memberId_fkey`;

-- AlterTable
ALTER TABLE `bookingmember` ADD COLUMN `checkedInAt` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `trail` DROP COLUMN `difficulty`;

-- DropTable
DROP TABLE `checkin`;

-- CreateIndex
CREATE INDEX `Booking_slotId_createdAt_idx` ON `Booking`(`slotId`, `createdAt`);

-- CreateIndex
CREATE UNIQUE INDEX `BookingMember_bookingId_idNumber_key` ON `BookingMember`(`bookingId`, `idNumber`);
