// src/components/selects/justice_select_adv_role.js
const prisma = require('../../prisma/client');
const { EmbedBuilder, ActionRowBuilder, RoleSelectMenuBuilder } = require('discord.js');

module.exports = {
    customId: 'justice_select_adv_role',
    async execute(interaction) {
        await interaction.deferUpdate();
        const roleId = interaction.values[0];
        const advLevel = interaction.customId.split('_')[4];

        const data = {};
        data[`adv${advLevel}RoleId`] = roleId;

        const config = await prisma.guildConfig.upsert({
            where: { guildId: interaction.guild.id },
            update: data,
            create: { guildId: interaction.guild.id, ...data },
            include: { /* Isso não é necessário aqui, mas é um exemplo */ }
        });
        
        // Recria a embed com os dados atualizados
        const newEmbed = new EmbedBuilder()
            .setColor('#f1c40f')
            .setTitle('🔒 Configuração de Cargos de Advertência')
            .setDescription('Cargo atualizado com sucesso! Defina os outros ou feche esta mensagem.');
            
        const adv1 = config?.adv1RoleId ? `<@&${config.adv1RoleId}>` : 'Nenhum';
        const adv2 = config?.adv2RoleId ? `<@&${config.adv2RoleId}>` : 'Nenhum';
        const adv3 = config?.adv3RoleId ? `<@&${config.adv3RoleId}>` : 'Nenhum';
        newEmbed.addFields(
            { name: 'Advertência Nível 1', value: adv1, inline: true },
            { name: 'Advertência Nível 2', value: adv2, inline: true },
            { name: 'Advertência Nível 3', value: adv3, inline: true }
        );

        // Mantém os menus para que o admin possa continuar configurando
        await interaction.editReply({ embeds: [newEmbed], components: interaction.message.components });
    }
};