// src/components/modals/giveaway_create_final.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = require('../../prisma/client');
const ms = require('ms');

module.exports = {
    customId: 'giveaway_create_final', // Será lido com a lógica "startsWith"
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const guild = interaction.guild;

        try {
            // 1. Extrai as informações dos passos anteriores e do formulário
            const [,,, channelId, roleId] = interaction.customId.split('_');
            const durationStr = interaction.fields.getTextInputValue('g_duration');
            const winnerCountStr = interaction.fields.getTextInputValue('g_winners');
            const prize = interaction.fields.getTextInputValue('g_prize');
            const requiredRoleId = (roleId === 'none') ? null : roleId;
            
            // 2. Valida os dados
            const durationMs = ms(durationStr);
            const winnerCount = parseInt(winnerCountStr);

            if (!durationMs || isNaN(winnerCount) || winnerCount < 1) {
                return interaction.editReply({ content: '❌ Duração ou número de vencedores inválido. Use formatos como `10m`, `1h`, `3d` e números inteiros para vencedores.' });
            }
            const endsAt = new Date(Date.now() + durationMs);

            // 3. Busca as configurações de aparência no banco de dados
            const config = await prisma.guildConfig.findUnique({ where: { guildId: guild.id } });
            const channel = await guild.channels.fetch(channelId);

            // 4. Cria a embed do sorteio usando as configurações personalizadas
            const giveawayEmbed = new EmbedBuilder()
                .setColor(config?.giveawayEmbedColor || '#5865F2')
                .setTitle(`🎉 SORTEIO: ${prize}`)
                .setDescription(`Clique no botão **Participar** para ter a chance de ganhar!\n\n**Termina em:** <t:${Math.floor(endsAt.getTime() / 1000)}:R>`)
                .addFields(
                    { name: 'Vencedores', value: `**${winnerCount}**`, inline: true },
                    { name: 'Participantes', value: '**0**', inline: true }
                )
                .setImage(config?.giveawayDefaultImageUrl || null) // Usa a imagem padrão configurada
                .setThumbnail(config?.giveawayDefaultThumbnailUrl || null) // Usa a thumbnail padrão configurada
                .setFooter({ text: `Sorteio iniciado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();
            
            if (requiredRoleId) {
                giveawayEmbed.addFields({ name: 'Requisito', value: `Apenas membros com o cargo <@&${requiredRoleId}> podem ganhar.` });
            }

            // 5. Cria os botões de ação
            const actionRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('giveaway_enter').setLabel('Participar').setStyle(ButtonStyle.Success).setEmoji('🎉'),
                new ButtonBuilder().setCustomId('giveaway_view_entrants').setLabel('Listar Participantes').setStyle(ButtonStyle.Secondary).setEmoji('👥')
            );

            // 6. Envia a mensagem no canal e salva no banco de dados
            const message = await channel.send({ embeds: [giveawayEmbed], components: [actionRow] });
            
            await prisma.giveaway.create({
                data: {
                    guildId: guild.id,
                    channelId: channel.id,
                    messageId: message.id,
                    prize,
                    winnerCount,
                    endsAt,
                    requiredRoleId,
                }
            });

            await interaction.editReply(`✅ Sorteio para **${prize}** foi criado com sucesso no canal ${channel}!`);

        } catch (error) {
            console.error("Erro ao criar sorteio:", error);
            await interaction.editReply({ content: '❌ Ocorreu um erro. Verifique se o ID do canal está correto e se tenho permissões para enviar mensagens e embeds lá.' });
        }
    }
};