/*
  Warnings:

  - You are about to drop the column `courseId` on the `CourseCertificates` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `CourseCertificates` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `CourseRegistration` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[registrationId]` on the table `CourseCertificates` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `CourseRegistration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentId,orderId]` on the table `CourseRegistration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `registrationId` to the `CourseCertificates` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `CourseCertificates_courseId_studentId_key` ON `CourseCertificates`;

-- DropIndex
DROP INDEX `CourseCertificates_studentId_idx` ON `CourseCertificates`;

-- DropIndex
DROP INDEX `CourseRegistration_courseId_idx` ON `CourseRegistration`;

-- DropIndex
DROP INDEX `CourseRegistration_studentId_courseId_key` ON `CourseRegistration`;

-- AlterTable
ALTER TABLE `CourseCertificates` DROP COLUMN `courseId`,
    DROP COLUMN `studentId`,
    ADD COLUMN `registrationId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `CourseRegistration` DROP COLUMN `courseId`;

-- CreateIndex
CREATE UNIQUE INDEX `CourseCertificates_registrationId_key` ON `CourseCertificates`(`registrationId`);

-- CreateIndex
CREATE UNIQUE INDEX `CourseRegistration_orderId_key` ON `CourseRegistration`(`orderId`);

-- CreateIndex
CREATE UNIQUE INDEX `CourseRegistration_studentId_orderId_key` ON `CourseRegistration`(`studentId`, `orderId`);

-- CreateIndex
CREATE INDEX `Order_productId_idx` ON `Order`(`productId`);
