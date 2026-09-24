/*
  Warnings:

  - A unique constraint covering the columns `[employee_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `employee_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `employees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nip` VARCHAR(30) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NULL,
    `department` VARCHAR(100) NULL,
    `position` VARCHAR(100) NULL,
    `tanggal_masuk` DATE NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE', 'RESIGNED') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `employees_nip_key`(`nip`),
    UNIQUE INDEX `employees_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_employee_id_key` ON `users`(`employee_id`);

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
