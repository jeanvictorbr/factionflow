// src/components/buttons/recruiter_page_next.js
const { displayRecruiterPage } = require('../../utils/recruiterPaginator');

module.exports = {
    customId: 'recruiter_page_next',
    async execute(interaction) {
        const [_, __, ___, applicationId, pageStr] = interaction.customId.split('_');
        const page = parseInt(pageStr);
        await displayRecruiterPage(interaction, applicationId, page + 1);
    }
};