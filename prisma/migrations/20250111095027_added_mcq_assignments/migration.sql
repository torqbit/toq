-- AlterTable
ALTER TABLE `AssignmentEvaluation` ADD COLUMN `maximumScore` INTEGER NULL DEFAULT 0,
    ADD COLUMN `passingScore` INTEGER NULL DEFAULT 0,
    ADD COLUMN `scoreSummary` JSON NULL;
