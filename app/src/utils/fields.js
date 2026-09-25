'use strict';

const SYSTEM_FIELDS = [
  'id',
  'documentId',
  'locale',
  'status',
  'publishedAt',
  'createdAt',
  'updatedAt'
];

function sanitizeInput(event, allowedFields) {
  const data = event.params.data;
  if (!data || typeof data !== 'object') return data;
  for (const key of Object.keys(data)) {
    if (!allowedFields.includes(key) && !SYSTEM_FIELDS.includes(key)) {
      delete data[key];
    }
  }
  return data;
}

async function publishIfDraft(uid, result) {
  if (!result || !result.documentId) return;
  const service = strapi.documents(uid);
  if (typeof service.publish !== 'function') return;
  try {
    await service.publish({ documentId: result.documentId });
  } catch (err) {
    strapi.log.warn(`[publishIfDraft] ${uid} ${result.documentId}: ${err.message}`);
  }
}

module.exports = { sanitizeInput, publishIfDraft, SYSTEM_FIELDS };