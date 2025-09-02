// src/components/selects/justice_select_user.js
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'justice_select_user',
    async execute(interaction) {
        await interaction.deferUpdate();
        const targetUserId = interaction.values[0];
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });

        const options = [];
        // Adiciona as opções de ADV dinamicamente, apenas se os cargos estiverem configurados
        if (config?.adv1RoleId) options.push(new StringSelectMenuOptionBuilder().setLabel('Advertência (ADV 1)').setValue('Advertência_1').setEmoji('1️⃣'));
        if (config?.adv2RoleId) options.push(new StringSelectMenuOptionBuilder().setLabel('Advertência (ADV 2)').setValue('Advertência_2').setEmoji('2️⃣'));
        if (config?.adv3RoleId) options.push(new StringSelectMenuOptionBuilder().setLabel('Advertência (ADV 3)').setValue('Advertência_3').setEmoji('3️⃣'));

        if (options.length === 0) {
            return interaction.editReply({ content: '❌ Nenhum cargo de advertência foi configurado pela liderança. Configure-os no painel antes de aplicar punições.', components: [] });
        }

        const embed = new EmbedBuilder().setColor('#f1c40f').setTitle('⚖️ Aplicar Punição (Passo 2/3)').setDescription('Selecione o nível da advertência a ser aplicada.');
        
        const typeSelect = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`justice_select_type_${targetUserId}`)
                .setPlaceholder('Selecione o nível da advertência...')
                .addOptions(options)
        );
        await interaction.editReply({ embeds: [embed], components: [typeSelect] });
    }
};