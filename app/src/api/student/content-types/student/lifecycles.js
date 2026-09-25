'use strict';

const crypto = require('crypto')
const { errors: { ApplicationError } } = require('@strapi/utils')
const { sanitizeInput } = require('../../../../utils/fields')

const ALLOWED_FIELDS = ['name', 'mobile', 'cardId']

function pepper() {
  return process.env.DATA_HASH_KEY || process.env.JWT_SECRET || 'dev-only-pepper'
}

function isRawDigits(value) {
  return value != null && value !== '' && /^\d+$/.test(String(value))
}

function isHashed(value) {
  return /^[0-9a-f]{64}$/.test(String(value || ''))
}

function assertInputConstraints(data) {
  if (isRawDigits(data.mobile) && data.mobile.length !== 10) {
    throw new ApplicationError('mobile must be exactly 10 digits')
  }
  if (isRawDigits(data.cardId) && data.cardId.length !== 13) {
    throw new ApplicationError('cardId must be exactly 13 digits')
  }
}

function deterministHash(value) {
  return crypto.createHmac('sha256', pepper()).update(String(value)).digest('hex')
}

async function protect(event) {
  const data = sanitizeInput(event, ALLOWED_FIELDS)
  assertInputConstraints(data)
  for (const field of ['mobile', 'cardId']) {
    if (isRawDigits(data[field]) && !isHashed(data[field])) {
      data[field] = deterministHash(data[field])
    }
  }
}

module.exports = {
  async beforeCreate(event) {
    await protect(event)
  },
  async beforeUpdate(event) {
    await protect(event)
  }
}