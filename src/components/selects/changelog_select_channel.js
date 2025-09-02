// src/components/selects/changelog_select_channel.js
const { EmbedBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
const { updateChangelogEmbed } = require('../../utils/changelogEmbedUpdater');

module.exports = {
    customId: 'changelog_select_channel',
    async execute(interaction) {
        const channelId = interaction.values[0];
        
        try {
            // 1. Encontra o canal selecionado
            const channel = interaction.guild.channels.cache.get(channelId);
            if (!channel) {
                return interaction.update({
                    content: '❌ O canal selecionado não foi encontrado. Tente novamente.',
                    components: []
                });
            }

            // 2. Envia uma embed de placeholder para obter o ID da mensagem
            const placeholderEmbed = new EmbedBuilder()
                .setTitle('🗒️ Registro de Alterações - FactionFlow')
                .setDescription('Carregando entradas...');
            
            const message = await channel.send({ embeds: [placeholderEmbed] });

            // 3. Salva o ID do canal E o ID da MENSAGEM no banco de dados
            await prisma.guildConfig.upsert({
                where: { guildId: interaction.guild.id },
                update: { 
                    changelogChannelId: channelId,
                    changelogMessageId: message.id // <-- AQUI É SALVO O ID DA MENSAGEM
                },
                create: { 
                    guildId: interaction.guild.id, 
                    changelogChannelId: channelId,
                    changelogMessageId: message.id 
                },
            });

            // 4. Chama a função de atualização para preencher a embed com dados reais
            await updateChangelogEmbed(interaction.client, interaction.guild.id);

            // 5. Confirma a ação para o usuário
            await interaction.update({
                content: `✅ Canal de anúncios do Changelog definido com sucesso para <#${channelId}>!\nO painel de registro de alterações já foi publicado e será atualizado automaticamente.`,
                components: []
            });

        } catch (error) {
            console.error('Erro ao configurar canal do changelog:', error);
            await interaction.editReply({
                content: '❌ Ocorreu um erro ao configurar o canal. Verifique as permissões do bot.',
                components: []
            }).catch(() => {});
        }
    }
};