// src/components/buttons/registro_enviar_painel.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'registro_enviar_painel',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const config = await prisma.guildConfig.findUnique({
            where: { guildId: interaction.guild.id },
        });

        if (!config || !config.interactionChannelId || !config.membroRoleId || !config.recrutadorRoleId) {
            return interaction.editReply({ content: '❌ **Configuração Incompleta!** Antes de enviar o painel, todos os cargos e o canal de interação devem ser definidos no módulo de registro.' });
        }

        const targetChannel = await interaction.guild.channels.fetch(config.interactionChannelId).catch(() => null);
        if (!targetChannel) {
            return interaction.editReply({ content: `❌ **Canal não encontrado!** O canal de interação configurado (<#${config.interactionChannelId}>) não existe ou eu não tenho acesso a ele.` });
        }

        const finalEmbed = new EmbedBuilder()
            .setColor('#c0392b') // Vermelho
            .setTitle(config.registroEmbedTitle || 'Formulário de Registro')
            .setDescription(`\`\`\`diff\n- ${config.registroEmbedDesc || 'Clique no botão abaixo para iniciar seu registro.'}\n\`\`\``)
            .setImage(config.registroEmbedImage || null)
            .setThumbnail(config.registroEmbedThumb || null)
            .setFooter({ text: 'ZéPiqueno aplicações', iconURL: 'https://media.tenor.com/k6g28p-C6C4AAAAC/ze-pequeno-dadinho.gif' });

        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('registro_iniciar').setLabel('Solicitar Registro').setStyle(ButtonStyle.Primary).setEmoji('📝')
        );
        
        try {
            await targetChannel.send({ embeds: [finalEmbed], components: [actionRow] });
            await interaction.editReply({ content: `✅ Painel de registro enviado com sucesso para o canal ${targetChannel}!` });
        } catch (error) {
            console.error("Erro ao enviar painel de registro:", error);
            await interaction.editReply({ content: `❌ **Falha de Permissão!** Não consigo enviar mensagens no canal ${targetChannel}. Verifique minhas permissões.` });
        }
    }
};