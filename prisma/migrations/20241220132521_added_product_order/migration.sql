/*
  Warnings:

  - You are about to drop the column `courseId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `latestStatus` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `registrationId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `CashfreeOrder` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[courseId]` on the table `CourseRegistration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `CourseRegistration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[gatewayOrderId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderId` to the `CourseRegistration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Order_orderId_key` ON `Order`;

-- DropIndex
DROP INDEX `Order_registrationId_key` ON `Order`;

-- DropIndex
DROP INDEX `Order_studentId_orderId_idx` ON `Order`;

-- AlterTable
ALTER TABLE `Assignment` ADD COLUMN `submissionConfig` JSON NULL;

-- AlterTable
ALTER TABLE `Course` MODIFY `courseId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `CourseRegistration` ADD COLUMN `orderId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `courseId`,
    DROP COLUMN `latestStatus`,
    DROP COLUMN `orderId`,
    DROP COLUMN `registrationId`,
    ADD COLUMN `gatewayOrderId` VARCHAR(191) NULL,
    ADD COLUMN `message` VARCHAR(500) NULL,
    ADD COLUMN `orderStatus` ENUM('PENDING', 'SUCCESS', 'FAILED', 'INITIATED') NULL,
    ADD COLUMN `paymentChannel` VARCHAR(191) NULL,
    ADD COLUMN `paymentId` VARCHAR(191) NULL,
    ADD COLUMN `paymentStatus` ENUM('SUCCESS', 'FAILED', 'USER_DROPPED') NULL,
    ADD COLUMN `paymentTime` DATETIME(3) NULL,
    ADD COLUMN `productId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `CashfreeOrder`;

-- CreateTable
CREATE TABLE `Product` (
    `productId` INTEGER NOT NULL AUTO_INCREMENT,
    `ptype` ENUM('COURSE', 'EVENT') NOT NULL,

    PRIMARY KEY (`productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `CourseRegistration_courseId_key` ON `CourseRegistration`(`courseId`);

-- CreateIndex
CREATE UNIQUE INDEX `CourseRegistration_orderId_key` ON `CourseRegistration`(`orderId`);

-- CreateIndex
CREATE UNIQUE INDEX `Order_gatewayOrderId_key` ON `Order`(`gatewayOrderId`);

-- CreateIndex
CREATE UNIQUE INDEX `Order_productId_key` ON `Order`(`productId`);

-- CreateIndex
CREATE INDEX `Order_studentId_gatewayOrderId_idx` ON `Order`(`studentId`, `gatewayOrderId`);
