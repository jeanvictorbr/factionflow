// src/events/guildMemberUpdate.js
const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        // ===================================================================
        // CORREÇÃO: Adiciona uma verificação para garantir que a mudança foi nos cargos
        // ===================================================================
        if (oldMember.roles.cache.size === newMember.roles.cache.size) return;

        const { updateHierarchyEmbed } = require('../utils/hierarchyEmbedUpdater'); // Ajuste o caminho se necessário
        
        try {
            // A lógica original continua aqui, agora protegida pela verificação acima.
            await updateHierarchyEmbed(newMember.guild);
            console.log(`[HIERARQUIA] Embed atualizada devido à mudança de cargos de ${newMember.user.tag}.`);
        } catch (error) {
            console.error(`[HIERARQUIA] Falha ao atualizar embed via GuildMemberUpdate:`, error);
        }
    },
};