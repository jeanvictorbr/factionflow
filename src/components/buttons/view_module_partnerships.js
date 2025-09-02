// src/components/buttons/view_module_partnerships.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'view_module_partnerships',
    async execute(interaction) {
        // Verificação de segurança
        if (!interaction.guild) return;
        await interaction.deferUpdate();
        
        const partnerCount = await prisma.partnership.count({ where: { guildId: interaction.guild.id } });
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });

        const embed = new EmbedBuilder()
            .setColor('#1abc9c')
            .setTitle('🤝 Módulo de Alianças Estratégicas')
            .setImage(config?.partnershipDefaultImageUrl || 'https://i.imgur.com/eKYcAyL.gif')
            .setDescription('Gerencie as parcerias oficiais da facção e configure o painel público de alianças.')
            .addFields({ name: 'Parcerias Ativas', value: `\`\`\`${partnerCount} parcerias registradas\`\`\`` });

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('partnerships_action_add').setLabel('Adicionar Parceiro').setStyle(ButtonStyle.Success).setEmoji('➕'),
            new ButtonBuilder().setCustomId('partnerships_action_edit').setLabel('Editar Parceiro').setStyle(ButtonStyle.Primary).setEmoji('✏️'),
            new ButtonBuilder().setCustomId('partnerships_action_remove').setLabel('Remover Parceiro').setStyle(ButtonStyle.Danger).setEmoji('➖')
        );
        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('partnerships_config_channel').setLabel('Config. Canal').setStyle(ButtonStyle.Secondary).setEmoji('📺'),
            new ButtonBuilder().setCustomId('partnerships_config_images').setLabel('Config. Imagens').setStyle(ButtonStyle.Secondary).setEmoji('🖼️'),
            new ButtonBuilder().setCustomId('partnerships_action_publish').setLabel('Publicar Painel').setStyle(ButtonStyle.Secondary).setEmoji('🚀')
        );
        const row3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('rpainel_view_registros')
                .setLabel('Voltar para Módulos')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('⬅️')
        );

        await interaction.editReply({ embeds: [embed], components: [row1, row2, row3] });
    }
};