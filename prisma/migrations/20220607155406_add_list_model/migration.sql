-- AlterTable
ALTER TABLE `task` ADD COLUMN `inListid` INTEGER NULL,
    MODIFY `status` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `List` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_inListid_fkey` FOREIGN KEY (`inListid`) REFERENCES `List`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
