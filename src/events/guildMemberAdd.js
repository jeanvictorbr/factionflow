// src/events/guildMemberAdd.js
const { Events, EmbedBuilder } = require('discord.js'); // <-- LINHA QUE FALTAVA
const prisma = require('../prisma/client');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const blacklistedEntry = await prisma.blacklist.findUnique({
            where: {
                guildId_userId: {
                    guildId: member.guild.id,
                    userId: member.id,
                }
            }
        });

        if (blacklistedEntry) {
            try {
                await member.send(`Você foi automaticamente expulso do servidor **${member.guild.name}** por estar na nossa blacklist.\n**Motivo:** ${blacklistedEntry.reason}`);
            } catch (dmError) {
                console.log(`Não foi possível avisar o usuário da blacklist ${member.user.tag} via DM.`);
            }

            try {
                await member.kick(`Indivíduo na blacklist. Motivo: ${blacklistedEntry.reason}`);
                
                const config = await prisma.guildConfig.findUnique({ where: { guildId: member.guild.id } });
                if (config?.justiceLogChannelId) {
                    const logChannel = await member.guild.channels.fetch(config.justiceLogChannelId).catch(() => null);
                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setColor('#000000')
                            .setTitle('🚫 Acesso Negado - Blacklist')
                            .setDescription(`O indivíduo **${member.user.tag}** (\`${member.id}\`) tentou entrar, mas foi **automaticamente expulso**.\n\n**Motivo:** \`${blacklistedEntry.reason}\``)
                            .setTimestamp();
                        await logChannel.send({ embeds: [logEmbed] });
                    }
                }
            } catch (kickError) {
                console.error(`Falha ao expulsar membro da blacklist ${member.id}:`, kickError.message);
            }
        }
    }
};