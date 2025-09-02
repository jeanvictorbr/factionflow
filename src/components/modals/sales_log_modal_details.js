// src/components/modals/sales_log_modal_details.js
const { ModalSubmitInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Buffer } = require('buffer');

module.exports = {
    customId: 'sales_log_modal_details',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const itemId = interaction.customId.split('_')[4];
        const quantity = parseInt(interaction.fields.getTextInputValue('sale_quantity'));
        const buyerInfo = interaction.fields.getTextInputValue('sale_buyer_info');
        const depositedInput = interaction.fields.getTextInputValue('sale_deposited').toLowerCase();

        if (isNaN(quantity) || quantity <= 0) {
            return interaction.editReply({ content: '❌ Quantidade inválida.' });
        }
        
        const isDeposited = ['sim', 's'].includes(depositedInput);
        const data = JSON.stringify({ iid: itemId, q: quantity, b: buyerInfo, d: isDeposited });
        const encodedData = Buffer.from(data).toString('base64');

        const embed = new EmbedBuilder()
            .setColor('#f1c40f')
            .setTitle('🧾 Confirmação Final')
            .setDescription(`Confirme os detalhes da venda para registrá-la.\n\n**A venda foi com desconto de parceria?**`)
            // ESCONDEMOS OS DADOS AQUI, DE FORMA SEGURA E SEM LIMITE
            .setFooter({ text: `Data:${encodedData}` });

        // Os IDs dos botões agora são simples e não quebram mais o limite
        const confirmButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`sale_confirm_yes`).setLabel('Sim, com Parceria').setStyle(ButtonStyle.Success).setEmoji('🤝'),
            new ButtonBuilder().setCustomId(`sale_confirm_no`).setLabel('Não, sem Parceria').setStyle(ButtonStyle.Danger).setEmoji('💰')
        );

        await interaction.editReply({ embeds: [embed], components: [confirmButtons] });
    }
};