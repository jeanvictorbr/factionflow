/*
  Warnings:

  - You are about to drop the column `adv1RoleId` on the `GuildConfig` table. All the data in the column will be lost.
  - You are about to drop the column `adv2RoleId` on the `GuildConfig` table. All the data in the column will be lost.
  - You are about to drop the column `adv3RoleId` on the `GuildConfig` table. All the data in the column will be lost.
  - You are about to drop the column `justiceLogChannelId` on the `GuildConfig` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Punishment` table. All the data in the column will be lost.
  - You are about to drop the column `previousRoles` on the `Punishment` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Punishment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[guildId,caseId]` on the table `Punishment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `caseId` to the `Punishment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moderatorId` to the `Punishment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ruleId` to the `Punishment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."PunishmentType" AS ENUM ('ADVERTENCIA', 'TIMEOUT', 'KICK', 'BAN');

-- CreateEnum
CREATE TYPE "public"."PunishmentStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

-- AlterTable
ALTER TABLE "public"."GuildConfig" DROP COLUMN "adv1RoleId",
DROP COLUMN "adv2RoleId",
DROP COLUMN "adv3RoleId",
DROP COLUMN "justiceLogChannelId",
ADD COLUMN     "last_punishment_case_id" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "punishment_log_channel_id" TEXT;

-- AlterTable
ALTER TABLE "public"."Punishment" DROP COLUMN "authorId",
DROP COLUMN "previousRoles",
DROP COLUMN "type",
ADD COLUMN     "caseId" INTEGER NOT NULL,
ADD COLUMN     "moderatorId" TEXT NOT NULL,
ADD COLUMN     "proof" TEXT,
ADD COLUMN     "punishmentMessageId" TEXT,
ADD COLUMN     "ruleId" TEXT NOT NULL,
ADD COLUMN     "status" "public"."PunishmentStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "public"."Rule" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "ruleCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "defaultPunishmentType" "public"."PunishmentType" NOT NULL,
    "defaultDurationMinutes" INTEGER,
    "temporaryRoleId" TEXT,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Punishment_guildId_caseId_key" ON "public"."Punishment"("guildId", "caseId");

-- AddForeignKey
ALTER TABLE "public"."Punishment" ADD CONSTRAINT "Punishment_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "public"."Rule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
