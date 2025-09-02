// src/commands/enviar-painel-vendas.js
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const prisma = require('../prisma/client'); // Importa o Prisma

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enviar-painel-vendas')
        .setDescription('Envia o painel de vendas interativo no canal atual.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        // Busca a imagem customizada no banco de dados
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
        const imageUrl = config?.salesPanelImageUrl || 'https://i.imgur.com/62PxV3k.gif'; // Usa a imagem customizada ou a padrão

        const salesPanelEmbed = new EmbedBuilder()
            .setColor('#f39c12')
            .setTitle('[ TERMINAL DE VENDAS  ]')
            .setDescription('Interface para consulta de preços e registro de transações comerciais da facção.')
            .setImage(imageUrl) // Usa a imagem dinâmica
            .addFields(
                { name: '💹 Calcular Venda', value: 'Inicia uma simulação de venda para calcular os valores finais.' },
                { name: '🧾 Registrar Venda', value: 'Abre o formulário para registrar uma venda efetuada no livro-caixa.' }
            )
            .setFooter({ text: '👑 Zé Piqueno aplicações ' });

        const salesButtons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('sales_action_calculate').setLabel('Calcular Venda').setStyle(ButtonStyle.Success).setEmoji('💹'),
            new ButtonBuilder().setCustomId('sales_action_log').setLabel('Registrar Venda').setStyle(ButtonStyle.Primary).setEmoji('🧾')
        );

        await interaction.channel.send({ embeds: [salesPanelEmbed], components: [salesButtons] });
        await interaction.reply({ content: '✅ Painel de vendas enviado com sucesso!', ephemeral: true });
    }
};