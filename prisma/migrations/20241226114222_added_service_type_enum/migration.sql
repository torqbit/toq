/*
  Warnings:

  - You are about to alter the column `service_type` on the `ServiceProvider` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `Enum(EnumId(12))`.

*/
-- AlterTable
ALTER TABLE `ServiceProvider` MODIFY `service_type` ENUM('CMS', 'PAYMENTS', 'EMAIL') NOT NULL;
