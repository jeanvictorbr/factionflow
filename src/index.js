// src/index.js
const { Client, GatewayIntentBits, Collection, Events, REST, Routes, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
    ]
});

client.prisma = require('./prisma/client');

// --- GERENCIADOR DINÂMICO DE COMANDOS ---
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`[COMANDO] ${command.data.name} carregado.`);
    }
}

// --- GERENCIADOR DINÂMICO DE EVENTOS ---
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
    console.log(`[EVENTO] ${event.name} carregado.`);
}


// --- EVENTO DE READY (QUANDO O BOT FICA ONLINE) ---
client.once(Events.ClientReady, async readyClient => {
    console.log(`Tudo pronto! Logado como ${readyClient.user.tag}`);
    console.log(`Operando em ${readyClient.guilds.cache.size} servidores.`);

    // --- REGISTRADOR DE COMANDOS AUTOMÁTICO ---
    try {
        console.log('[SISTEMA] Iniciando a atualização de comandos (/) para a guilda.');
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        const commandsData = Array.from(client.commands.values()).map(command => command.data.toJSON());
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commandsData },
        );
        console.log(`[SISTEMA] ${commandsData.length} comandos (/) foram recarregados com sucesso.`);
    } catch (error) {
        console.error('[SISTEMA] Falha ao registrar comandos:', error.message);
    }

    // --- ATUALIZADOR AUTOMÁTICO DA HIERARQUIA ---
    try {
        const { updateHierarchyEmbed } = require('./components/buttons/hierarquia_action_publish.js');
        console.log('[SISTEMA] Iniciando ciclo de atualização da Hierarquia (a cada 3 minutos).');
        const runHierarchyUpdateCycle = async () => {
            for (const guild of readyClient.guilds.cache.values()) {
                try { await updateHierarchyEmbed(guild); } 
                catch (error) { console.error(`- ERRO GRAVE ao tentar atualizar hierarquia para ${guild.name}:`, error); }
            }
        };
        setTimeout(runHierarchyUpdateCycle, 5000); 
        setInterval(runHierarchyUpdateCycle, 180000);
    } catch (error) {
        console.error('[SISTEMA] Falha CRÍTICA ao iniciar o ciclo de atualização da hierarquia.', error);
    }

    // --- AGENDADOR DO SENTINELA (RELATÓRIOS) ---
    try {
        console.log('[SISTEMA] Iniciando ciclo de verificação do Sentinela (a cada 60 segundos).');
        setInterval(async () => {
            // ... (seu código do sentinela) ...
        }, 60000);
    } catch (error) {
        console.error('[SISTEMA] Falha CRÍTICA ao iniciar o ciclo do Sentinela.', error);
    }

    // --- VERIFICADOR DE PUNIÇÕES EXPIRADAS ---
    try {
        console.log('[SISTEMA] Iniciando ciclo de verificação de punições (a cada 10 segundos).');
        setInterval(async () => {
            const expiredPunishments = await client.prisma.punishment.findMany({ where: { status: 'ACTIVE', expiresAt: { lte: new Date() } }, include: { rule: true } });

            for (const punishment of expiredPunishments) {
                try {
                    const guild = await client.guilds.fetch(punishment.guildId);
                    const config = await client.prisma.guildConfig.findUnique({ where: { guildId: guild.id } });
                    const member = await guild.members.fetch(punishment.userId).catch(() => null);

                    if (member) {
                        if (punishment.rule.defaultPunishmentType === 'TIMEOUT') await member.timeout(null, 'Punição expirada.');
                        if (punishment.rule.temporaryRoleId) await member.roles.remove(punishment.rule.temporaryRoleId).catch(() => {});
                    }
                    if (punishment.rule.defaultPunishmentType === 'BAN') await guild.bans.remove(punishment.userId, 'Punição expirada.').catch(() => {});

                    await client.prisma.punishment.update({ where: { id: punishment.id }, data: { status: 'EXPIRED' } });
                    
                    if (config?.punishmentLogChannelId && punishment.punishmentMessageId) {
                        const logChannel = await guild.channels.fetch(config.punishmentLogChannelId).catch(() => null);
                        if (logChannel) {
                            const logMessage = await logChannel.messages.fetch(punishment.punishmentMessageId).catch(() => null);
                            if (logMessage?.embeds.length > 0) {
                                const originalEmbed = logMessage.embeds[0];
                                const updatedEmbed = new EmbedBuilder(originalEmbed)
                                    .setColor('Grey')
                                    .setTitle(`⚖️ Punição Finalizada - Caso #${punishment.caseId}`)
                                    .setFields(...originalEmbed.fields.filter(f => f.name !== '⏰ Expira em'), { name: 'Status', value: '⚫ **Expirada**', inline: true });
                                await logMessage.edit({ embeds: [updatedEmbed], components: [] });
                            }
                        }
                    }
                } catch (err) { console.error(`[Justiça] Falha ao processar punição expirada Caso #${punishment.caseId}:`, err.message); }
            }
        }, 10 * 1000);
    } catch (error) { console.error('[SISTEMA] Falha CRÍTICA ao iniciar o ciclo de punições.', error); }

    // ===================================================================
    // CICLO DE SORTEIOS (VERSÃO COM CORREÇÃO VISUAL)
    // ===================================================================
    try {
        console.log('[SISTEMA] Iniciando ciclo de verificação de sorteios (a cada 15 segundos).');
        setInterval(async () => {
            const giveaways = await client.prisma.giveaway.findMany({ where: { status: 'RUNNING' } });
            for (const giveaway of giveaways) {
                try {
                    const guild = await client.guilds.fetch(giveaway.guildId);
                    const channel = await guild.channels.fetch(giveaway.channelId);
                    const message = await channel.messages.fetch(giveaway.messageId);
                    const config = await client.prisma.guildConfig.findUnique({ where: { guildId: giveaway.guildId } });

                    if (new Date() >= giveaway.endsAt) {
                        // Lógica de finalização do sorteio
                        let entrants = giveaway.entrants;
                        if (giveaway.requiredRoleId) {
                            await guild.members.fetch();
                            entrants = entrants.filter(userId => guild.members.cache.get(userId)?.roles.cache.has(giveaway.requiredRoleId));
                        }
                        const winners = [];
                        if (entrants.length > 0) {
                            for (let i = 0; i < giveaway.winnerCount; i++) {
                                if (entrants.length === 0) break;
                                const winnerIndex = Math.floor(Math.random() * entrants.length);
                                winners.push(entrants.splice(winnerIndex, 1)[0]);
                            }
                        }
                        await client.prisma.giveaway.update({ where: { id: giveaway.id }, data: { status: 'ENDED', winners } });
                        const winnerMentions = winners.map(id => `<@${id}>`).join(', ') || 'Nenhum participante elegível.';
                        const finishedEmbed = new EmbedBuilder(message.embeds[0]).setColor(config?.giveawayFinishedEmbedColor || '#99AAB5').setTitle(`🎉 SORTEIO ENCERRADO: ${giveaway.prize}`).setDescription(`Sorteio finalizado!\n\n**Vencedor(es):** ${winnerMentions}`);
                        await message.edit({ embeds: [finishedEmbed], components: [] });
                        if (winners.length > 0) {
                            const winnerAnnounceEmbed = new EmbedBuilder().setColor(config?.giveawayWinnerEmbedColor || '#2ECC71').setTitle('🎉 Parabéns aos Vencedores! 🎉').setDescription(`Parabéns ${winnerMentions}! Você(s) ganharam **${giveaway.prize}**!`);
                            await channel.send({ embeds: [winnerAnnounceEmbed] });
                        }
                    } else {
                        // LÓGICA DE ATUALIZAÇÃO DA EMBED (CORRIGIDA)
                        const updatedEmbed = new EmbedBuilder(message.embeds[0])
                            .setDescription(`Clique no botão **Participar** para ter a chance de ganhar!\n\n**Termina em:** <t:${Math.floor(giveaway.endsAt.getTime() / 1000)}:R>`);

                        const lastTenEntrants = giveaway.entrants.slice(-10).map(id => `<@${id}>`).join('\n') || '`Seja o primeiro a participar!`';
                        
                        const fields = [
                            { name: 'Vencedores', value: `**${giveaway.winnerCount}**`, inline: true },
                            { name: 'Participantes', value: `**${giveaway.entrants.length}**`, inline: true },
                            { name: 'Últimos a entrar', value: lastTenEntrants, inline: false }
                        ];

                        if (giveaway.requiredRoleId) {
                            fields.push({ name: 'Requisito', value: `Apenas membros com o cargo <@&${giveaway.requiredRoleId}> podem ganhar.` });
                        }
                        
                        updatedEmbed.setFields(fields); // Garante que a estrutura da embed esteja sempre correta
                        await message.edit({ embeds: [updatedEmbed] });
                    }
                } catch (err) { if (err.code !== 10008) { console.error(`[Sorteios] Falha ao processar sorteio ${giveaway.messageId}:`, err.message); } }
            }
        }, 15 * 1000);
    } catch (error) { console.error('[SISTEMA] Falha CRÍTICA ao iniciar o ciclo de sorteios.', error); }

    // --- VERIFICADOR DE OPERAÇÕES ---
    try {
        console.log('[SISTEMA] Iniciando ciclo de verificação de operações (a cada 60 segundos).');
        const { updateOperationEmbed } = require('./utils/operationEmbedUpdater.js');
        setInterval(async () => {
            const dueOperations = await client.prisma.operation.findMany({ where: { status: 'AGENDADA', scheduledAt: { lte: new Date() } } });
            for (const op of dueOperations) {
                await client.prisma.operation.update({ where: { id: op.id }, data: { status: 'EM ANDAMENTO' } });
            }
            const activeOperations = await client.prisma.operation.findMany({ where: { status: { in: ['AGENDADA', 'EM ANDAMENTO'] } } });
            for (const op of activeOperations) {
                await updateOperationEmbed(readyClient, op.id);
            }
        }, 60000);
    } catch (error) {
        console.error('[SISTEMA] Falha CRÍTICA ao iniciar o ciclo de operações.', error);
    }
});

// --- LOGIN DO BOT ---
client.login(process.env.DISCORD_TOKEN);

// --- SISTEMA ANTI-CRASH ---
process.on('unhandledRejection', error => {
    console.error('[ANTI-CRASH] Unhandled Rejection:', error);
});
process.on('uncaughtException', error => {
    console.error('[ANTI-CRASH] Uncaught Exception:', error);
});