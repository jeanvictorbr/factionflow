// src/components/buttons/sale_confirm.js
const { ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');
const { Buffer } = require('buffer');

module.exports = {
    customId: 'sale_confirm',
    async execute(interaction) {
        await interaction.deferUpdate();

        const wasPartnership = interaction.customId.startsWith('sale_confirm_yes');
        
        // PUXA OS DADOS ESCONDIDOS DO RODAPÉ DA MENSAGEM
        const footerText = interaction.message.embeds[0]?.footer?.text;
        if (!footerText || !footerText.startsWith('Data:')) {
            return interaction.editReply({ content: '❌ Erro: Dados da venda não encontrados na mensagem original.', components: [] });
        }
        const encodedData = footerText.split(':')[1];
        const decodedData = JSON.parse(Buffer.from(encodedData, 'base64').toString('utf8'));
        const { iid: itemId, q: quantity, b: buyerInfo, d: isDeposited } = decodedData;

        // O resto da lógica de salvar e enviar o log continua a mesma...
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
        if (!config?.salesLogChannelId) return interaction.editReply({ content: '❌ Canal de log de vendas não configurado.', components: [] });
        const logChannel = await interaction.guild.channels.fetch(config.salesLogChannelId).catch(() => null);
        if (!logChannel) return interaction.editReply({ content: '❌ Canal de log de vendas não encontrado.', components: [] });
        const item = await prisma.item.findUnique({ where: { id: itemId } });
        const seller = interaction.user;
        const finalPrice = wasPartnership ? (item.price * quantity) * (1 - item.partnershipDiscount / 100) : (item.price * quantity);

        const sale = await prisma.sale.create({
            data: {
                guildId: interaction.guild.id, sellerId: seller.id, buyerInfo,
                itemName: item.name, quantity, unitPrice: item.price, totalPrice: Math.round(finalPrice),
                wasPartnership, isDeposited,
            }
        });

        const depositStatus = sale.isDeposited ? '`✅ Sim`' : '`❌ Não`';
        const logEmbed = new EmbedBuilder()
            .setColor(sale.isDeposited ? '#2ecc71' : '#e74c3c')
            .setTitle('🧾 Novo Registro de Venda')
            .setAuthor({ name: `Vendedor: ${seller.tag}`, iconURL: seller.displayAvatarURL() })
            .addFields(
                { name: '👤 Vendedor', value: `${seller}` },
                { name: '📦 Produto', value: `\`${sale.itemName}\` x \`${sale.quantity}\`` },
                { name: '💲 Valor Total', value: `\`\`\`diff\n+ $ ${sale.totalPrice.toLocaleString('pt-BR')}\n\`\`\``},
                { name: '🤝 Parceria', value: sale.wasPartnership ? '`✅ Sim`' : '`❌ Não`', inline: true },
                { name: '📥 Depositado', value: depositStatus, inline: true },
                { name: '👤 Comprador', value: `\`${sale.buyerInfo}\`` }
            ).setTimestamp().setFooter({ text: `ID da Venda: ${sale.id}` });
        
        const actionButton = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`sale_toggle_deposit_${sale.id}`).setLabel('Alterar Status Dep.').setStyle(ButtonStyle.Secondary).setEmoji('🔄')
        );

        await logChannel.send({ embeds: [logEmbed], components: [actionButton] });
        await interaction.editReply({ content: '✅ Venda registrada com sucesso no livro-caixa!', embeds: [], components: [] });
    }
};