-- CreateTable
CREATE TABLE `workflow_specs` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `version` VARCHAR(191) NULL DEFAULT '1.0.0',
    `author` VARCHAR(191) NULL,
    `cc_path` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'deployed',
    `metadata` JSON NULL,
    `deployed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `workflow_specs_user_id_idx`(`user_id`),
    INDEX `workflow_specs_cc_path_idx`(`cc_path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `workflow_specs` ADD CONSTRAINT `workflow_specs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
