'use strict';

const { sanitizeInput } = require('../../../../utils/fields')

const ALLOWED_FIELDS = ['name']

module.exports = {
  async beforeCreate(event) {
    sanitizeInput(event, ALLOWED_FIELDS)
  },
  async beforeUpdate(event) {
    sanitizeInput(event, ALLOWED_FIELDS)
  }
}