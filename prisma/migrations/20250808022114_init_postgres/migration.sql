-- CreateTable
CREATE TABLE "public"."GuildConfig" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "registroEmbedTitle" TEXT DEFAULT 'Formulário de Registro',
    "registroEmbedDesc" TEXT DEFAULT 'Clique no botão abaixo para iniciar seu registro.',
    "registroEmbedImage" TEXT,
    "registroEmbedThumb" TEXT,
    "recrutadorRoleId" TEXT,
    "membroRoleId" TEXT,
    "approvedTag" TEXT,
    "interactionChannelId" TEXT,
    "logsChannelId" TEXT,
    "hierarchyChannelId" TEXT,
    "hierarchyEmbedTitle" TEXT DEFAULT 'Hierarquia de Cargos - Visionários',
    "hierarchyEmbedColor" TEXT DEFAULT '#FFFFFF',
    "hierarchyEmbedThumbnail" TEXT,
    "hierarchyExcludedRoles" TEXT,
    "salesLogChannelId" TEXT,
    "salesPanelImageUrl" TEXT,
    "profitGoal" INTEGER,
    "reportChannelId" TEXT,
    "reportEnabled" BOOLEAN NOT NULL DEFAULT false,
    "reportDayOfWeek" INTEGER,
    "reportTime" TEXT,
    "lastReportSent" TIMESTAMP(3),
    "justiceLogChannelId" TEXT,
    "adv1RoleId" TEXT,
    "adv2RoleId" TEXT,
    "adv3RoleId" TEXT,
    "pruneImmunityRoleId" TEXT,
    "operationsChannelId" TEXT,
    "operationsDefaultThumbnailUrl" TEXT,
    "operationsDefaultImageUrl" TEXT,
    "partnershipChannelId" TEXT,
    "partnershipMessageId" TEXT,
    "partnershipDefaultThumbnailUrl" TEXT,
    "partnershipDefaultImageUrl" TEXT,
    "pruneInviteLink" TEXT,
    "changelogChannelId" TEXT,
    "changelogMessageId" TEXT,

    CONSTRAINT "GuildConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Application" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rpName" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "recrutadorId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Item" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "partnershipDiscount" INTEGER NOT NULL DEFAULT 50,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Sale" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "buyerInfo" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "wasPartnership" BOOLEAN NOT NULL,
    "isDeposited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Investment" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Punishment" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "previousRoles" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Punishment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Blacklist" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blacklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RoleTag" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "RoleTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Operation" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AGENDADA',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "maxParticipants" INTEGER NOT NULL,
    "outcome" TEXT,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Participant" (
    "id" TEXT NOT NULL,
    "operationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomEmbed" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,

    CONSTRAINT "CustomEmbed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Partnership" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "inviteUrl" TEXT,
    "category" TEXT NOT NULL DEFAULT 'Geral',
    "uniformImageUrl" TEXT,

    CONSTRAINT "Partnership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChangelogEntry" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChangelogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ModuleStatus" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "moduleName" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "ModuleStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildConfig_guildId_key" ON "public"."GuildConfig"("guildId");

-- CreateIndex
CREATE UNIQUE INDEX "Item_guildId_name_key" ON "public"."Item"("guildId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Blacklist_guildId_userId_key" ON "public"."Blacklist"("guildId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleTag_roleId_key" ON "public"."RoleTag"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Operation_messageId_key" ON "public"."Operation"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_operationId_userId_key" ON "public"."Participant"("operationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomEmbed_messageId_key" ON "public"."CustomEmbed"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "Partnership_name_key" ON "public"."Partnership"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleStatus_moduleName_key" ON "public"."ModuleStatus"("moduleName");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleStatus_moduleName_guildId_key" ON "public"."ModuleStatus"("moduleName", "guildId");

-- AddForeignKey
ALTER TABLE "public"."Participant" ADD CONSTRAINT "Participant_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "public"."Operation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
