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

module.exports = { sanitizeInput, SYSTEM_FIELDS };