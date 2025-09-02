-- AlterTable
ALTER TABLE "public"."GuildConfig" ADD COLUMN     "giveaway_embed_color" TEXT DEFAULT '#5865F2',
ADD COLUMN     "giveaway_finished_embed_color" TEXT DEFAULT '#99AAB5',
ADD COLUMN     "giveaway_log_channel_id" TEXT,
ADD COLUMN     "giveaway_winner_embed_color" TEXT DEFAULT '#2ECC71';

-- CreateTable
CREATE TABLE "public"."Giveaway" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "prize" TEXT NOT NULL,
    "winnerCount" INTEGER NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RUNNING',
    "requiredRoleId" TEXT,
    "entrants" TEXT[],
    "winners" TEXT[],

    CONSTRAINT "Giveaway_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Giveaway_messageId_key" ON "public"."Giveaway"("messageId");
