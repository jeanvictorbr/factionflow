// src/utils/tagUpdater.js
const prisma = require('../prisma/client');

async function updateMemberTag(member) {
    const tagRules = await prisma.roleTag.findMany({ where: { guildId: member.guild.id } });
    if (tagRules.length === 0) return { success: false, reason: 'Nenhuma regra de tag configurada.' };

    const tagRulesMap = new Map(tagRules.map(t => [t.roleId, t.tag]));

    let highestPriorityRole = null;
    member.roles.cache.forEach(role => {
        if (tagRulesMap.has(role.id)) {
            if (!highestPriorityRole || role.position > highestPriorityRole.position) {
                highestPriorityRole = role;
            }
        }
    });

    const tagToApply = highestPriorityRole ? tagRulesMap.get(highestPriorityRole.id) : null;
    const currentNickname = member.displayName;
    const cleanNickname = currentNickname.replace(/^\[.*?\]\s*/, '');
    let newNickname = cleanNickname;
    if (tagToApply) {
        // ===================================================================
        // LÓGICA DE ENCURTAMENTO DE APELIDO ADICIONADA
        // ===================================================================
        const prefix = `${tagToApply} `;
        const maxCleanNicknameLength = 32 - prefix.length; // Calcula o espaço que sobra para o nome
        
        const truncatedCleanNickname = cleanNickname.length > maxCleanNicknameLength
            ? cleanNickname.slice(0, maxCleanNicknameLength) // Encurta o nome se necessário
            : cleanNickname;

        newNickname = `${prefix}${truncatedCleanNickname}`;
    }

    if (newNickname !== currentNickname) {
        try {
            await member.setNickname(newNickname);
            return { success: true, changed: true, member: member, oldNickname: currentNickname, newNickname: newNickname };
        } catch (error) {
            return { success: false, member: member, reason: 'Permissão insuficiente (cargo do bot abaixo do alvo).' };
        }
    }
    return { success: true, changed: false };
}

module.exports = { updateMemberTag };