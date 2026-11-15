const rateLimit = require('express-rate-limit');

// Rate limiter for auth endpoints: 100 requests per 15 minutes in dev/test, strict in prod
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again in 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
};
