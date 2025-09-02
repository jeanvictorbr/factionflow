// src/components/buttons/view_partner_uniform.js
const { EmbedBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

module.exports = {
    customId: 'view_partner_uniform',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const partnerId = interaction.customId.split('_')[3];
        
        const partner = await prisma.partnership.findUnique({ where: { id: partnerId } });

        if (!partner || !partner.uniformImageUrl) {
            return interaction.editReply({ content: '❌ A imagem do uniforme para este parceiro não foi encontrada.' });
        }

        const embed = new EmbedBuilder()
            .setColor('#c0392b') // Vermelho para combinar com o texto
            .setTitle(`👕 Uniforme de Parceria`)
            .setDescription(`\`\`\`diff\n- Este é o uniforme da ${partner.name}\n\`\`\``)
            .setImage(partner.uniformImageUrl)
            .setFooter({ text: 'FactionFlow • Alianças Estratégicas' });

        await interaction.editReply({ embeds: [embed] });
    }
};