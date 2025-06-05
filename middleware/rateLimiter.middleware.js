const redis = require("../utils/redisClient");

function rateLimiter(secondsWindow = 60, allowedHits = 30) {
  return async function (req, res, next) {
    try {
      const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const requests = await redis.incr(ip);
      if (requests == 1) {
        await redis.expire(ip, secondsWindow);
      }
      if (requests > allowedHits) {
        // Get TTL (time to live) left for this IP key in Redis

        const ttl = await redis.ttl(ip);

        res.set("Retry-After", ttl); // seconds till reset
        res.set("X-RateLimit-Limit", allowedHits);
        res.set("X-RateLimit-Remaining", 0);

        return res.status(429).json({
          response: "error",
          message: `Exceeded per minute requests allowed. Try again after ${ttl}`,
        });
      }
      // Set headers when under limit
      res.set("X-RateLimit-Limit", allowedHits);
      res.set("X-RateLimit-Remaining", allowedHits - requests);
      next();
    } catch (err) {
      console.error("RateLimiter Redis Error:", err.message);
      // Fallback — let request go through in case Redis is down
      next();
    }
  };
}

module.exports = rateLimiter;
