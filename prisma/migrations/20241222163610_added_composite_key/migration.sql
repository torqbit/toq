
ALTER TABLE `User` MODIFY `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Order_studentId_productId_key` ON `Order`(`studentId`, `productId`);
