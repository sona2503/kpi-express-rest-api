-- CreateTable
CREATE TABLE `behaviors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `periode` VARCHAR(7) NOT NULL,
    `rating` ENUM('SANGAT_BAIK', 'BAIK', 'CUKUP', 'KURANG', 'SANGAT_KURANG') NOT NULL,
    `catatan` TEXT NULL,
    `penilai_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `behaviors_employee_id_periode_key`(`employee_id`, `periode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `behaviors` ADD CONSTRAINT `behaviors_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
