/*
  Warnings:

  - You are about to drop the column `nombre` on the `usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cedula]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cedula` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primer_apellido` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primer_nombre` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuario` DROP COLUMN `nombre`,
    ADD COLUMN `cedula` VARCHAR(191) NOT NULL,
    ADD COLUMN `fecha_nacimiento` DATETIME(3) NULL,
    ADD COLUMN `foto_perfil_url` VARCHAR(191) NULL,
    ADD COLUMN `primer_apellido` VARCHAR(191) NOT NULL,
    ADD COLUMN `primer_nombre` VARCHAR(191) NOT NULL,
    ADD COLUMN `segundo_apellido` VARCHAR(191) NULL,
    ADD COLUMN `segundo_nombre` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Usuario_cedula_key` ON `Usuario`(`cedula`);
