// src/components/buttons/embed_action_publish.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');
const { Buffer } = require('buffer');

module.exports = {
    customId: 'embed_publish',
    async execute(interaction) {
        // Pega os dados escondidos no rodapé
        const footerText = interaction.message.embeds[0]?.footer?.text;
        if (!footerText || !footerText.startsWith('Data:')) {
            return interaction.update({ content: '❌ Erro ao ler dados da pré-visualização.', embeds: [], components: [] });
        }
        const encodedData = footerText.split(':')[1];
        const data = JSON.parse(Buffer.from(encodedData, 'base64').toString('utf8'));
        
        const finalEmbed = new EmbedBuilder().setTitle(data.t).setDescription(data.d).setColor(data.c);
        if (data.i) finalEmbed.setImage(data.i);
        if (data.th) finalEmbed.setThumbnail(data.th);

        const message = await interaction.channel.send({ embeds: [finalEmbed] });

        // Adiciona os botões de gestão à mensagem pública
        const manageButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`embed_edit_${message.id}`).setLabel('Editar').setStyle(ButtonStyle.Primary).setEmoji('✏️'),
            new ButtonBuilder().setCustomId(`embed_finalize_${message.id}`).setLabel('Finalizar').setStyle(ButtonStyle.Danger).setEmoji('🔒')
        );
        await message.edit({ components: [manageButtons] });

        await prisma.customEmbed.create({ data: { guildId: interaction.guild.id, channelId: message.channel.id, messageId: message.id } });
        await interaction.update({ content: '✅ Embed publicada com sucesso!', embeds: [], components: [] });
    }
};