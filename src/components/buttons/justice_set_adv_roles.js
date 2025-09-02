// src/components/buttons/justice_set_adv_roles.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'justice_set_adv_roles',
    async execute(interaction) {
        await interaction.deferUpdate();
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
        
        const embed = new EmbedBuilder()
            .setColor('#f1c40f')
            .setTitle('🔒 Configuração de Cargos de Advertência')
            .setDescription('Defina os cargos para cada nível de suspensão clicando nos botões abaixo.');

        const adv1 = config?.adv1RoleId ? `<@&${config.adv1RoleId}>` : '`Nenhum`';
        const adv2 = config?.adv2RoleId ? `<@&${config.adv2RoleId}>` : '`Nenhum`';
        const adv3 = config?.adv3RoleId ? `<@&${config.adv3RoleId}>` : '`Nenhum`';
        embed.addFields(
            { name: 'Advertência Nível 1', value: adv1, inline: true },
            { name: 'Advertência Nível 2', value: adv2, inline: true },
            { name: 'Advertência Nível 3', value: adv3, inline: true }
        );

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('justice_set_specific_adv_role_1').setLabel('Definir ADV 1').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('justice_set_specific_adv_role_2').setLabel('Definir ADV 2').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('justice_set_specific_adv_role_3').setLabel('Definir ADV 3').setStyle(ButtonStyle.Primary)
        );
        const backButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('view_module_justice').setLabel('Voltar').setStyle(ButtonStyle.Secondary).setEmoji('⬅️')
        );

        await interaction.editReply({ embeds: [embed], components: [buttons, backButton] });
    }
};