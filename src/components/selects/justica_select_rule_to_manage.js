// src/components/selects/justica_select_rule_to_manage.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'justica_select_rule_to_manage',
    async execute(interaction) {
        const ruleId = interaction.values[0];
        const rule = await prisma.rule.findUnique({ where: { id: ruleId } });

        const embed = new EmbedBuilder()
            .setColor('#3498DB')
            .setTitle(`Gerenciando a Regra: [${rule.ruleCode}]`)
            .setDescription(rule.description)
            .addFields(
                { name: 'Punição Padrão', value: `${rule.defaultPunishmentType} ${rule.defaultDurationMinutes ? `(${rule.defaultDurationMinutes}m)` : ''}`, inline: true },
                { name: 'Cargo Temporário', value: `${rule.temporaryRoleId ? `<@&${rule.temporaryRoleId}>` : '`Nenhum`'}`, inline: true }
            );
        
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`justica_set_role_for_rule_${rule.id}`).setLabel('Definir/Alterar Cargo').setStyle(ButtonStyle.Primary).setEmoji('🎨'),
            new ButtonBuilder().setCustomId(`justica_edit_rule_${rule.id}`).setLabel('Editar Textos').setStyle(ButtonStyle.Secondary).setEmoji('✏️'),
            new ButtonBuilder().setCustomId(`justica_delete_rule_${rule.id}`).setLabel('Apagar Regra').setStyle(ButtonStyle.Danger).setEmoji('🗑️'),
            new ButtonBuilder().setCustomId('justica_manage_rules').setLabel('Voltar').setStyle(ButtonStyle.Secondary).setEmoji('⬅️')
        );

        await interaction.reply({ embeds: [embed], components: [buttons], ephemeral: true });
    }
};