// src/components/buttons/partnerships_action_publish.js
const prisma = require('../../prisma/client');
const partnershipUpdater = require('../../utils/partnershipEmbedUpdater');

module.exports = {
    customId: 'partnerships_action_publish',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
            if (!config?.partnershipChannelId) {
                return interaction.editReply('❌ O canal de parcerias não foi configurado! Use o botão de configurar no painel.');
            }

            // ===================================================================
            // CORREÇÃO APLICADA AQUI
            // A gente busca e define a variável 'channel' antes de usá-la.
            // ===================================================================
            const channel = await interaction.guild.channels.fetch(config.partnershipChannelId).catch(() => null);
            if (!channel) {
                return interaction.editReply('❌ O canal configurado para parcerias não foi encontrado ou eu não tenho acesso a ele.');
            }

            // Deleta o painel antigo, se existir, para evitar duplicatas
            if (config.partnershipMessageId) {
                await channel.messages.fetch(config.partnershipMessageId).then(msg => msg.delete()).catch(() => {});
            }

            // Envia a nova mensagem que se tornará o painel
            const message = await channel.send('`[ 🚀 Publicando painel de alianças... ]`');
            
            // Salva o ID da nova mensagem no banco
            await prisma.guildConfig.update({
                where: { guildId: interaction.guild.id },
                data: { partnershipMessageId: message.id }
            });
            
            // Chama o "cérebro" para desenhar a embed final na página 0
            await partnershipUpdater.updatePartnershipEmbed(interaction.client, interaction.guild.id, 0, 'dossier');

            await interaction.editReply('✅ Painel de parcerias publicado com sucesso!');

        } catch (error) {
            console.error("Erro ao publicar painel de parcerias:", error);
            await interaction.editReply('❌ Ocorreu um erro crítico ao tentar publicar o painel.');
        }
    }
};