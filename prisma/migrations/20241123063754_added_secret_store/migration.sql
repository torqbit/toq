-- CreateTable
CREATE TABLE `SecretStore` (
    `name` VARCHAR(191) NOT NULL,
    `secret` TEXT NOT NULL,
    `nonce` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
