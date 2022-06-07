/*
  Warnings:

  - Made the column `inListid` on table `task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_inListid_fkey`;

-- AlterTable
ALTER TABLE `task` MODIFY `inListid` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_inListid_fkey` FOREIGN KEY (`inListid`) REFERENCES `List`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
