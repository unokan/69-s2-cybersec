'use strict';

/**
 * subject controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { publishIfDraft } = require('../../../utils/fields');

module.exports = createCoreController('api::subject.subject', ({ strapi }) => ({
  async create(ctx) {
    const entity = await super.create(ctx);
    if (entity && entity.data && entity.data.documentId) {
      await publishIfDraft('api::subject.subject', entity.data);
    }
    return entity;
  },
}));