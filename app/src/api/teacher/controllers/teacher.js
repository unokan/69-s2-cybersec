'use strict';

/**
 * teacher controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { publishIfDraft } = require('../../../utils/fields');

module.exports = createCoreController('api::teacher.teacher', ({ strapi }) => ({
  async create(ctx) {
    const entity = await super.create(ctx);
    if (entity && entity.data && entity.data.documentId) {
      await publishIfDraft('api::teacher.teacher', entity.data);
    }
    return entity;
  },
}));