/*
  Warnings:

  - You are about to drop the column `moduleName` on the `ModuleStatus` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,guildId]` on the table `ModuleStatus` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `ModuleStatus` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."ModuleStatus_moduleName_guildId_key";

-- DropIndex
DROP INDEX "public"."ModuleStatus_moduleName_key";

-- AlterTable
ALTER TABLE "public"."ModuleStatus" DROP COLUMN "moduleName",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ModuleStatus_name_guildId_key" ON "public"."ModuleStatus"("name", "guildId");
