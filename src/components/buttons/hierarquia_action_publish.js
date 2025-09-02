// src/components/buttons/hierarquia_action_publish.js
const { Guild, EmbedBuilder } = require('discord.js');
const prisma = require('../../prisma/client');

const roleEmojis = [
    '💎', '👑', '⚜️', '🦅', '🛡️', '⚔️', '🔥', '💀', '⚖️', '⚙️', 
    '⚡', '🌟', '✨', '🌊', '🌪️', '🌑', '🌕', '☀️', '⚓', '🔑'
];

function getMemberInsignia(index) {
    const insignias = ['⭐', '🔸', '🔹', '›']; // <-- '▪️' TROCADO POR '›'
    if (index < 3) return insignias[index];
    return insignias[3]; // Padrão
}

async function updateHierarchyEmbed(guild) {
    try {
        const config = await prisma.guildConfig.findUnique({ where: { guildId: guild.id } });
        if (!config?.hierarchyChannelId) return { success: false, message: 'O canal da hierarquia não foi configurado.' };

        const channel = await guild.channels.fetch(config.hierarchyChannelId).catch(() => null);
        if (!channel) return { success: false, message: 'O canal configurado não foi encontrado.' };

        await guild.roles.fetch();
        await guild.members.fetch();
        const excludedRoles = config.hierarchyExcludedRoles?.split(',').filter(id => id) || [];
        const rolesToShow = guild.roles.cache
            .filter(role => role.name !== '@everyone' && !role.managed && !excludedRoles.includes(role.id))
            .sort((a, b) => b.position - a.position);

        if (rolesToShow.size === 0) return { success: false, message: 'Nenhum cargo com membros para exibir.' };
        
        const membersByHighestRole = new Map();
        rolesToShow.forEach(r => membersByHighestRole.set(r.id, []));
        for (const member of guild.members.cache.values()) {
            if (member.user.bot) continue;
            const highestRole = member.roles.cache.filter(role => rolesToShow.has(role.id)).sort((a, b) => b.position - a.position).first();
            if (highestRole) {
                membersByHighestRole.get(highestRole.id).push(member);
            }
        }

        const embed = new EmbedBuilder()
            .setColor(config.hierarchyEmbedColor || '#2c3e50')
            .setTitle(config.hierarchyEmbedTitle || 'Hierarquia de Cargos')
            .setThumbnail(config.hierarchyEmbedThumbnail || guild.iconURL())
            .setTimestamp()
            .setFooter({ text: 'Atualizado automaticamente a cada 3 minutos.' });

        let roleIndex = 0;
        rolesToShow.forEach(role => {
            const membersInThisRole = membersByHighestRole.get(role.id);
            if (membersInThisRole.length === 0) return;

            const roleEmoji = roleEmojis[roleIndex % roleEmojis.length];
            const memberInsignia = getMemberInsignia(roleIndex);

            // ===================================================================
            // CORREÇÃO FINAL APLICADA AQUI
            // Trocamos m.user.tag por m.displayName
            // ===================================================================
            const memberListString = membersInThisRole
                .map(m => `${memberInsignia} ${m} (\`${m.user.tag}\`)`)
                .join('\n');

            embed.addFields({
                name: `${roleEmoji} ${role.name.toUpperCase()} (${membersInThisRole.length})`,
                value: memberListString.slice(0, 1024)
            });
            
            roleIndex++;
        });
        
        if (embed.data.fields.length === 0) {
            embed.setDescription('> Nenhum membro encontrado nos cargos de hierarquia.');
        }

        const messages = await channel.messages.fetch({ limit: 50 });
        const botMessage = messages.find(m => m.author.id === guild.client.user.id && m.embeds[0]?.title === embed.data.title);

        if (botMessage) {
            await botMessage.edit({ embeds: [embed] });
            return { success: true, message: 'A embed de hierarquia foi atualizada!' };
        } else {
            await channel.send({ embeds: [embed] });
            return { success: true, message: 'A embed de hierarquia foi publicada!' };
        }
    } catch (error) {
        console.error(`[HIERARQUIA] Erro grave ao tentar atualizar para ${guild.name}:`, error);
        return { success: false, message: 'Ocorreu um erro interno.' };
    }
}

module.exports = {
    customId: 'hierarquia_action_publish',
    updateHierarchyEmbed,
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const result = await updateHierarchyEmbed(interaction.guild);
        await interaction.editReply({ content: result.success ? `✅ ${result.message}` : `❌ ${result.message}` });
    }
};