
-- DropIndex
DROP INDEX  `Order_orderId_key` ON `Order`;

-- DropIndex
DROP INDEX  `Order_registrationId_key` ON `Order`;

-- DropIndex
DROP INDEX  `Order_studentId_orderId_idx` ON `Order`;

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
DROP TABLE IF EXISTS `CashfreeOrder`;

-- CreateTable
CREATE TABLE IF NOT EXISTS `Product` (
    `productId` INTEGER NOT NULL AUTO_INCREMENT,
    `ptype` ENUM('COURSE', 'EVENT') NOT NULL,

    PRIMARY KEY (`productId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;




-- CreateIndex
CREATE UNIQUE INDEX `Order_gatewayOrderId_key` ON `Order`(`gatewayOrderId`);


-- CreateIndex
CREATE INDEX `Order_studentId_gatewayOrderId_idx` ON `Order`(`studentId`, `gatewayOrderId`);
