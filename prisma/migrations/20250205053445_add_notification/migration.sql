-- DropIndex
DROP INDEX `Notification_commentId_idx` ON `Notification`;

-- DropIndex
DROP INDEX `Notification_fromUserId_idx` ON `Notification`;

-- DropIndex
DROP INDEX `Notification_resourceId_idx` ON `Notification`;

-- DropIndex
DROP INDEX `Notification_tagCommentId_idx` ON `Notification`;

-- DropIndex
DROP INDEX `Notification_toUserId_idx` ON `Notification`;

-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `commentId`,
    DROP COLUMN `description`,
    DROP COLUMN `fromUserId`,
    DROP COLUMN `isView`,
    DROP COLUMN `resourceId`,
    DROP COLUMN `tagCommentId`,
    DROP COLUMN `title`,
    DROP COLUMN `toUserId`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `activity` VARCHAR(191) NULL,
    ADD COLUMN `hasViewed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `objectId` VARCHAR(191) NOT NULL,
    ADD COLUMN `objectType` ENUM('USER', 'COURSE', 'EVENT', 'VIDEO_LESSON', 'ASSIGNMENT_LESSON', 'VIDEO', 'ASSIGNMENT') NOT NULL,
    ADD COLUMN `recipientId` VARCHAR(191) NOT NULL,
    ADD COLUMN `subjectId` VARCHAR(191) NOT NULL,
    ADD COLUMN `subjectType` ENUM('USER', 'COURSE', 'EVENT', 'VIDEO_LESSON', 'ASSIGNMENT_LESSON', 'VIDEO', 'ASSIGNMENT') NOT NULL,
    MODIFY `notificationType` ENUM('POST_QUERY', 'REPLY_QUERY', 'ENROLLED', 'VIDEO_UPLOAD') NOT NULL;

-- CreateIndex
CREATE INDEX `Notification_recipientId_idx` ON `Notification`(`recipientId`);