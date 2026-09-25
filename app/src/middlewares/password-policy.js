'use strict';

const { errors: { ApplicationError } } = require('@strapi/utils')

const RULES = [
  [ /[a-z]/, 'at least one lowercase letter' ],
  [ /[A-Z]/, 'at least one uppercase letter' ],
  [ /\d/, 'at least one digit' ],
  [ /[^A-Za-z0-9]/, 'at least one symbol' ],
]

module.exports = (config, { strapi }) => {
  const minLength = config.minLength || 12;
  const paths = config.paths || [
    '/api/auth/local/register',
    '/api/auth/reset-password',
    '/admin/reset-password',
    '/admin/register-admin',
  ];

  return async (ctx, next) => {
    if (ctx.method !== 'POST') {
      return next();
    }
    const url = ctx.request.url;
    if (!paths.some((p) => url.startsWith(p))) {
      return next();
    }
    const body = ctx.request.body;
    const password = body && body.password;
    if (!password || typeof password !== 'string' || password.length < minLength) {
      throw new ApplicationError(`password must be at least ${minLength} characters`)
    }
    for (const [rule, label] of RULES) {
      if (!rule.test(password)) {
        throw new ApplicationError(`password must contain ${label}`)
      }
    }
    return next();
  };
};