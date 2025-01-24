-- AlterTable
ALTER TABLE `Product` MODIFY `ptype` ENUM('COURSE', 'EVENT', 'LEARNING_PATH') NOT NULL;

-- CreateTable
CREATE TABLE `LearningPath` (
    `id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `banner` VARCHAR(191) NOT NULL,
    `attributes` JSON NULL,
    `price` INTEGER NOT NULL DEFAULT 0,
    `state` ENUM('ACTIVE', 'INACTIVE', 'DRAFT') NOT NULL DEFAULT 'DRAFT',
    `authorId` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `LearningPath_authorId_idx`(`authorId`),
    UNIQUE INDEX `LearningPath_id_key`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LearningPathCourses` (
    `learningPathId` INTEGER NOT NULL,
    `courseId` INTEGER NOT NULL,
    `sequenceId` INTEGER NOT NULL,

    INDEX `LearningPathCourses_courseId_idx`(`courseId`),
    UNIQUE INDEX `LearningPathCourses_learningPathId_courseId_key`(`learningPathId`, `courseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
