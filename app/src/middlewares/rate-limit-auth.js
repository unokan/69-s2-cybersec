'use strict';

module.exports = (config, { strapi }) => {
  const windowMs = config.windowMs || 15 * 60 * 1000;
  const max = config.max || 10;
  const message = config.message || 'Too many requests, please try again later.';
  const paths = config.paths || [
    '/api/auth/local',
    '/api/auth/local/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/admin/login',
    '/admin/forgot-password',
    '/admin/reset-password',
    '/admin/register-admin',
  ];
  const buckets = new Map();

  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.reset <= now) buckets.delete(key);
    }
  }, Math.min(windowMs, 60 * 1000)).unref();

  return async (ctx, next) => {
    const url = ctx.request.url;
    if (!paths.some((p) => url.startsWith(p))) {
      return next();
    }
    const ip = ctx.request.ip || 'unknown';
    const now = Date.now();
    let bucket = buckets.get(ip);
    if (!bucket || bucket.reset <= now) {
      bucket = { count: 0, reset: now + windowMs };
    }
    bucket.count += 1;
    if (bucket.count > max) {
      ctx.status = 429;
      ctx.body = {
        data: null,
        error: { status: 429, name: 'RateLimitError', message },
      };
      return;
    }
    buckets.set(ip, bucket);
    return next();
  };
};