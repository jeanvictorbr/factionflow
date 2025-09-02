// src/components/buttons/prune_confirm_execute.js
const { EmbedBuilder, ChannelType } = require('discord.js');
const prisma = require('../../prisma/client');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    customId: 'prune_confirm_execute',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const days = parseInt(interaction.customId.split('_')[3]);
        
        // --- ETAPA 1: REFAZER A VARREDURA PARA GARANTIR DADOS ATUALIZADOS ---
        await interaction.editReply('`[ 📡 Refazendo varredura para confirmação final... ]`');
        const config = await prisma.guildConfig.findUnique({ where: { guildId: interaction.guild.id } });
        const immunityRoleId = config?.pruneImmunityRoleId;
        const allMembers = await interaction.guild.members.fetch();
        
        const lastActivity = new Map();
        const channels = interaction.guild.channels.cache.filter(c => 
            c.type === ChannelType.GuildText && 
            c.permissionsFor(interaction.guild.members.me).has('ReadMessageHistory')
        );
        const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);

        for (const channel of channels.values()) {
            let lastId;
            let allMessagesFetched = false;
            while (!allMessagesFetched) {
                const messages = await channel.messages.fetch({ limit: 100, before: lastId }).catch(() => null);
                if (!messages || messages.size === 0) { allMessagesFetched = true; continue; }
                messages.forEach(msg => {
                    if (msg.createdTimestamp < cutoffDate) allMessagesFetched = true;
                    if (!lastActivity.has(msg.author.id) || lastActivity.get(msg.author.id) < msg.createdTimestamp) {
                        lastActivity.set(msg.author.id, msg.createdTimestamp);
                    }
                });
                if (!allMessagesFetched) lastId = messages.last().id;
            }
        }
        
        const inactiveMembers = allMembers.filter(member => {
            if (member.user.bot || (immunityRoleId && member.roles.cache.has(immunityRoleId))) return false;
            const lastMsg = lastActivity.get(member.id);
            return (!lastMsg && member.joinedTimestamp < cutoffDate) || (lastMsg && lastMsg < cutoffDate);
        });

        if (inactiveMembers.size === 0) {
            return interaction.editReply({ content: 'Nenhum membro inativo encontrado para expulsar. A operação foi cancelada.' });
        }

        // --- ETAPA 2: PREPARAR A DM DE DESLIGAMENTO ---
        const inviteLink = config?.pruneInviteLink || 'https://discord.gg/VK5JP7HUMt';
        const dmEmbed = new EmbedBuilder()
            .setColor('#e67e22')
            .setTitle(`Aviso de Remoção do Servidor: ${interaction.guild.name}`)
            .setThumbnail(interaction.guild.iconURL())
            .setDescription(`Olá. Você está sendo removido do nosso servidor por inatividade superior a **${days} dias**.\n\nEsta é uma medida para manter nossa comunidade ativa. Se acredita que isso foi um engano ou deseja voltar a participar, será muito bem-vindo de volta!\n\n**Use o link abaixo para retornar:**\n${inviteLink}`)
            .setTimestamp();

        // --- ETAPA 3: EXECUTAR A LIMPEZA COM LOG EM TEMPO REAL ---
        let kickedCount = 0;
        let failedCount = 0;
        for (const member of inactiveMembers.values()) {
            await interaction.editReply(`\`[ 🧹 LIMPANDO... ]\`\n- Alvo: ${member.user.tag}\n- **Progresso:** ${kickedCount + failedCount} / ${inactiveMembers.size}`);
            try {
                await member.send({ embeds: [dmEmbed] }).catch(() => {});
                await member.kick(`Removido por inatividade de mais de ${days} dias.`);
                kickedCount++;
            } catch (err) {
                console.error(`Falha ao expulsar ${member.user.tag}:`, err.message);
                failedCount++;
            }
            await sleep(1500); // Pausa de 1.5s entre cada expulsão por segurança
        }

        // --- ETAPA 4: RELATÓRIO FINAL ---
        const finalEmbed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('✅ Operação de Limpeza Concluída')
            .setDescription(`**${kickedCount}** membros foram removidos com sucesso.\n**${failedCount}** falhas (provavelmente por falta de permissão).`);

        await interaction.editReply({ content: '', embeds: [finalEmbed] });
    }
};