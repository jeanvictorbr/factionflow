// src/components/buttons/registro_config_embed.js
const { ButtonInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

async function showConfigModal(interaction) {
    const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
    const modal = new ModalBuilder().setCustomId('registro_modal_embed_config').setTitle('Configuração da Embed');
    const titleInput = new TextInputBuilder().setCustomId('embed_title').setLabel('Título').setStyle(TextInputStyle.Short).setValue(config?.registroEmbedTitle || '').setRequired(true);
    const descriptionInput = new TextInputBuilder().setCustomId('embed_description').setLabel('Descrição').setStyle(TextInputStyle.Paragraph).setValue(config?.registroEmbedDesc || '').setRequired(true);
    const imageInput = new TextInputBuilder().setCustomId('embed_image').setLabel('URL da Imagem Principal (Opcional)').setStyle(TextInputStyle.Short).setValue(config?.registroEmbedImage || '').setRequired(false);
    const thumbUserInput = new TextInputBuilder().setCustomId('embed_user_thumbnail').setLabel('URL da Thumbnail (Opcional)').setStyle(TextInputStyle.Short).setValue(config?.registroEmbedThumb || '').setRequired(false);
    modal.addComponents(new ActionRowBuilder().addComponents(titleInput), new ActionRowBuilder().addComponents(descriptionInput), new ActionRowBuilder().addComponents(imageInput), new ActionRowBuilder().addComponents(thumbUserInput));
    await interaction.showModal(modal);
}

module.exports = {
    customId: 'registro_config_embed',
    showConfigModal: showConfigModal,
    async execute(interaction) {
        await interaction.deferUpdate();
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
        let description = '```ini\n' + `[ Título ] = ${config?.registroEmbedTitle || 'Não definido'}\n` + `[ Descrição ] = ${config?.registroEmbedDesc?.substring(0, 50) || 'Não definida'}...\n` + `[ Imagem URL ] = ${config?.registroEmbedImage ? 'Definida' : 'Não definida'}\n` + `[ Thumbnail URL ] = ${config?.registroEmbedThumb ? 'Definida' : 'Não definida'}\n` + '```\nClique no botão abaixo para editar estes valores.';
        const embed = new EmbedBuilder()
            .setColor('#e91e63')
            .setTitle('📝 CONFIGURAÇÃO DA EMBED DE REGISTRO')
            .setAuthor({ name: 'Preview da Embed de Interação' })
            .setDescription(description)
            .setThumbnail('https://media.discordapp.net/attachments/1310610658844475404/1401110522228637786/standard_7.gif?ex=688f155b&is=688dc3db&hm=d90a54a81a18f9e53438b05d9b2c2f0b42028c1c6e5dc6dbcfd4afaeca55ca9e&=')
            .setFooter({ text: 'A imagem e thumbnail abaixo são uma prévia do que você configurou.' });
        
        if (config?.registroEmbedImage) embed.setImage(config.registroEmbedImage);
        if (config?.registroEmbedThumb) embed.setThumbnail(config.registroEmbedThumb);

        const actionRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('registro_action_show_modal').setLabel('EDITAR EMBED').setStyle(ButtonStyle.Success).setEmoji('✏️')
        );

        // BOTÃO "VOLTAR" CORRIGIDO: criado diretamente no arquivo
        const backButtonRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('view_module_registro') // Aponta para o painel do Módulo de Registro
                .setLabel('Voltar')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⬅️')
        );

        await interaction.editReply({ embeds: [embed], components: [actionRow, backButtonRow] });
    },
};