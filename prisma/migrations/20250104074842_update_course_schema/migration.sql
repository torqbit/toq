/*
  Warnings:

  - You are about to drop the column `assignmentFiles` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnail` on the `Course` table. All the data in the column will be lost.
  - Made the column `coursePrice` on table `Course` required. This step will fail if there are existing NULL values in that column.
  - Made the column `difficultyLevel` on table `Course` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Assignment` DROP COLUMN `assignmentFiles`,
    ADD COLUMN `maximumPoints` INTEGER NOT NULL DEFAULT 10,
    ADD COLUMN `passingScore` INTEGER NOT NULL DEFAULT 8;

-- AlterTable
ALTER TABLE `Course` DROP COLUMN `thumbnail`,
    MODIFY `coursePrice` DOUBLE NOT NULL DEFAULT 0,
    MODIFY `difficultyLevel` ENUM('Beginner', 'Intermediate', 'Advance') NOT NULL DEFAULT 'Beginner';
