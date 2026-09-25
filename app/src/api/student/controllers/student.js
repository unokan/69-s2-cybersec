'use strict';

/**
 * student controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { publishIfDraft } = require('../../../utils/fields');

module.exports = createCoreController('api::student.student', ({ strapi }) => ({
  async create(ctx) {
    const entity = await super.create(ctx);
    if (entity && entity.data && entity.data.documentId) {
      await publishIfDraft('api::student.student', entity.data);
    }
    return entity;
  },
}));