// src/components/buttons/sale_deposit.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');
const { Buffer } = require('buffer');

module.exports = {
    customId: 'sale_deposit',
    async execute(interaction) {
        await interaction.deferUpdate();

        const parts = interaction.customId.split('_');
        const isDeposited = parts[2] === 'yes';
        const wasPartnership = parts[3] === 'true'; // A string 'true' ou 'false'
        const encodedData = parts[4];
        
        const decodedData = JSON.parse(Buffer.from(encodedData, 'base64').toString('utf8'));
        const { iid: itemId, q: quantity, b: buyerInfo } = decodedData;

        // Lógica de envio do log...
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
        if (!config?.salesLogChannelId) { /* ... tratamento de erro ... */ }
        const logChannel = await interaction.guild.channels.fetch(config.salesLogChannelId).catch(() => null);
        if (!logChannel) { /* ... tratamento de erro ... */ }

        const item = await prisma.item.findUnique({ where: { id: itemId } });
        const seller = interaction.user;
        
        const fullPrice = item.price * quantity;
        const finalPrice = wasPartnership ? fullPrice * (1 - item.partnershipDiscount / 100) : fullPrice;

        const sale = await prisma.sale.create({
            data: {
                guildId: interaction.guild.id, sellerId: seller.id, buyerInfo,
                itemName: item.name, quantity, unitPrice: item.price, totalPrice: finalPrice,
                wasPartnership, isDeposited,
            }
        });

        const depositStatus = sale.isDeposited ? '`✅ Sim`' : '`❌ Pendente`';
        const logEmbed = new EmbedBuilder()
            .setColor(sale.isDeposited ? '#2ecc71' : '#e74c3c')
            .setTitle('🧾 Novo Registro de Venda')
            .setAuthor({ name: `Vendedor: ${seller.tag}`, iconURL: seller.displayAvatarURL() })
            .addFields(
                { name: '👤 Vendedor', value: `${seller} (\`${seller.id}\`)` },
                { name: '📦 Produto', value: `\`${sale.itemName}\``, inline: true },
                { name: '🔢 Quantidade', value: `\`${sale.quantity}\``, inline: true },
                { name: '💲 Valor Total', value: `\`\`\`diff\n+ $ ${sale.totalPrice.toLocaleString('pt-BR')}\n\`\`\`` },
                { name: '🤝 Parceria', value: sale.wasPartnership ? '`✅ Sim`' : '`❌ Não`', inline: true },
                { name: '📥 Depositado', value: depositStatus, inline: true },
                { name: '👤 Comprador', value: `\`${sale.buyerInfo}\`` }
            )
            .setTimestamp().setFooter({ text: `ID da Venda: ${sale.id}` });
        
        const actionButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`sale_toggle_deposit_${sale.id}`).setLabel('Editar Status Depósito').setStyle(ButtonStyle.Secondary).setEmoji('🔄')
        );

        await logChannel.send({ embeds: [logEmbed], components: [actionButton] });
        await interaction.editReply({ content: '✅ Venda registrada com sucesso!', components: [] });
    }
};