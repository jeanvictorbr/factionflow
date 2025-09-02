// src/components/modals/sales_modal_quantity.js
const { ModalSubmitInteraction, EmbedBuilder } = require('discord.js');
const prisma = require('../../prisma/client');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    customId: 'sales_modal_quantity',
    async execute(interaction) {
        const itemId = interaction.customId.split('_')[3];
        const quantityStr = interaction.fields.getTextInputValue('sale_quantity');
        const quantity = parseInt(quantityStr);

        if (isNaN(quantity) || quantity <= 0) {
            return interaction.reply({ content: '❌ Quantidade inválida.', ephemeral: true });
        }
        
        const logEmbed = new EmbedBuilder().setColor('#3498db').setTitle('[ PROCESSANDO SOLICITAÇÃO... ]');
        await interaction.reply({ embeds: [logEmbed.setDescription('`[ 📡 Acessando banco de dados... ]`')], ephemeral: true });
        await sleep(1000);

        const item = await prisma.item.findUnique({ where: { id: itemId } });
        await interaction.editReply({ embeds: [logEmbed.setDescription('`[ 📡 Acessando... OK ]`\n`[ 📦 Puxando dados do item... ]`')] });
        await sleep(1500);
        
        // ===================================================================
        // CÁLCULO E FORMATAÇÃO CORRETA DOS VALORES
        // ===================================================================
        const fullPrice = item.price * quantity;
        const partnershipPrice = fullPrice * (1 - item.partnershipDiscount / 100);

        await interaction.editReply({ embeds: [logEmbed.setDescription('`[ 📡 Acessando... OK ]`\n`[ 📦 Puxando dados... OK ]`\n`[ ⚙️ Calculando valores... ]`')] });
        await sleep(1000);

        const finalEmbed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('📝 Recibo de Venda ')
            .addFields(
                { name: 'Item e Quantidade', value: `\`\`\`${item.name} x ${quantity}\`\`\`` },
                { name: 'Preço por Unidade', value: `\`\`\`$ ${item.price.toLocaleString('pt-BR')}\`\`\``, inline: true },
                { name: 'Desconto Parceria', value: `\`\`\`${item.partnershipDiscount}%\`\`\``, inline: true }
            )
            .addFields({ name: '\u200B', value: '---' })
            .addFields(
                { name: 'Valor Total (Sem Parceria)', value: `\`\`\`diff\n+ $ ${fullPrice.toLocaleString('pt-BR')}\n\`\`\`` },
                { name: 'Valor Total (COM PARCERIA)', value: `\`\`\`diff\n- $ ${partnershipPrice.toLocaleString('pt-BR')}\n\`\`\`` },
            )
            .setFooter({ text: 'ZéPiqueno aplicações' });
            
        await interaction.editReply({ embeds: [finalEmbed] });
    }
};