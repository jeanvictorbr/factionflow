// src/components/buttons/changelog_action_publish.js
const prisma = require('../../prisma/client');
const { updateChangelogEmbed } = require('../../utils/changelogEmbedUpdater');
module.exports = {
    customId: 'changelog_action_publish',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
        if (!config?.changelogChannelId) return interaction.editReply('❌ O canal do changelog não foi configurado!');
        const channel = await interaction.guild.channels.fetch(config.changelogChannelId).catch(() => null);
        if (!channel) return interaction.editReply('❌ O canal configurado não foi encontrado.');
        
        const message = await channel.send('`[ 🚀 Publicando painel de changelog... ]`');
        await prisma.guildConfig.update({ where: { guildId: interaction.guild.id }, data: { changelogMessageId: message.id } });
        await updateChangelogEmbed(interaction.client, interaction.guild.id, 0);
        await interaction.editReply('✅ Painel de changelog publicado com sucesso!');
    }
};