// src/components/modals/prune_modal_start_scan.js
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const prisma = require('../../prisma/client');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    customId: 'prune_modal_start_scan',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const days = parseInt(interaction.fields.getTextInputValue('prune_days'));
        if (isNaN(days) || days <= 0) {
            return interaction.editReply({ content: '❌ Número de dias inválido.' });
        }

        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
        const immunityRoleId = config?.pruneImmunityRoleId;
        const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);

        // Log Imersivo
        const logEmbed = new EmbedBuilder().setColor('#3498db').setTitle('📡 Varredura de Atividade Iniciada...');
        await interaction.editReply({ embeds: [logEmbed.setDescription('`[ ⚙️  Inicializando sistema... ]`')] });
        await sleep(1500);
        
        // Passo 1: Buscar todos os membros
        await interaction.editReply({ embeds: [logEmbed.setDescription('`[ 👥 Carregando lista de todos os membros... ]`')] });
        const allMembers = await interaction.guild.members.fetch();
        await sleep(1500);

        // Passo 2: Mapear a última atividade por mensagem (VARREDURA PROFUNDA)
        await interaction.editReply({ embeds: [logEmbed.setDescription(`\`[ 💬 Analisando histórico de mensagens... Isso pode demorar vários minutos. ]\``)] });
        const lastActivity = new Map();
        const channels = interaction.guild.channels.cache.filter(c => 
            c.type === ChannelType.GuildText && 
            c.permissionsFor(interaction.guild.members.me).has('ReadMessageHistory')
        );

        for (const channel of channels.values()) {
            let lastId;
            let allMessagesFetched = false;
            while (!allMessagesFetched) {
                const messages = await channel.messages.fetch({ limit: 100, before: lastId }).catch(() => null);
                if (!messages || messages.size === 0) {
                    allMessagesFetched = true;
                    continue;
                }
                
                messages.forEach(msg => {
                    if (msg.createdTimestamp < cutoffDate) {
                        allMessagesFetched = true; // Já chegamos na data limite, não precisa ir mais fundo neste canal
                    }
                    if (!lastActivity.has(msg.author.id) || lastActivity.get(msg.author.id) < msg.createdTimestamp) {
                        lastActivity.set(msg.author.id, msg.createdTimestamp);
                    }
                });
                
                if (!allMessagesFetched) {
                    lastId = messages.last().id;
                }
            }
        }
        await sleep(1500);

        // Passo 3: Identificar os inativos
        await interaction.editReply({ embeds: [logEmbed.setDescription('`[ 🔎 Cruzando dados e identificando inativos... ]`')] });
        const inactiveMembers = allMembers.filter(member => {
            if (member.user.bot) return false;
            if (immunityRoleId && member.roles.cache.has(immunityRoleId)) return false;

            const lastMessageTimestamp = lastActivity.get(member.id);
            if (!lastMessageTimestamp) { // Se não tem nenhuma mensagem registrada
                return member.joinedTimestamp < cutoffDate;
            }
            return lastMessageTimestamp < cutoffDate;
        });
        await sleep(1500);

        // Passo 4: Apresentar o Relatório Final
        const finalEmbed = new EmbedBuilder()
            .setColor(inactiveMembers.size > 0 ? '#e74c3c' : '#2ecc71')
            .setTitle('📡 Varredura Concluída')
            .setDescription(`A varredura por membros inativos há mais de **${days} dias** encontrou **${inactiveMembers.size}** alvos.`);

        if (inactiveMembers.size > 0) {
            const memberList = inactiveMembers
                .map(m => `• ${m.user.tag} (\`${m.id}\`)`)
                .slice(0, 15)
                .join('\n');
            finalEmbed.addFields({ name: 'Alvos Identificados (Prévia)', value: memberList });
        }
        
        const actionRow = new ActionRowBuilder();
        if (inactiveMembers.size > 0) {
            actionRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(`prune_action_execute_${days}`)
                    .setLabel(`Executar Limpeza (${inactiveMembers.size})`)
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji('❗')
            );
        }
        await interaction.editReply({ embeds: [finalEmbed], components: inactiveMembers.size > 0 ? [actionRow] : [] });
    }
};