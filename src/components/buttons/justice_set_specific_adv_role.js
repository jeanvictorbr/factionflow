// src/components/buttons/justice_set_specific_adv_role.js
const { ActionRowBuilder, RoleSelectMenuBuilder } = require('discord.js');

module.exports = {
    customId: 'justice_set_specific_adv_role',
    async execute(interaction) {
        const advLevel = interaction.customId.split('_')[5]; // Pega o nível (1, 2 ou 3)

        const selectMenu = new ActionRowBuilder().addComponents(
            new RoleSelectMenuBuilder()
                .setCustomId(`justice_select_adv_role_${advLevel}`) // O ID do menu continua dinâmico
                .setPlaceholder(`Selecione o cargo para ADV ${advLevel}`)
        );

        await interaction.reply({ 
            content: `Selecione o cargo que será usado para a **Advertência Nível ${advLevel}**.`, 
            components: [selectMenu], 
            ephemeral: true 
        });
    }
};