/*
  Warnings:

  - A unique constraint covering the columns `[registrationId,productId]` on the table `CourseCertificates` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `CourseCertificates` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `CourseCertificates_registrationId_key` ON `CourseCertificates`;

-- AlterTable
ALTER TABLE `CourseCertificates` ADD COLUMN `productId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `CourseCertificates_productId_idx` ON `CourseCertificates`(`productId`);

-- CreateIndex
CREATE UNIQUE INDEX `CourseCertificates_registrationId_productId_key` ON `CourseCertificates`(`registrationId`, `productId`);
