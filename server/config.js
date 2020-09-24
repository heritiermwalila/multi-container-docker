module.exports  = {
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    pgHost: process.env.PG_HOST,
    pgDatabase: process.env.PG_DATABASE,
    pgUsername: process.env.PG_USERNAME,
    pgPassword: process.env.PG_PASSWORD,
    pgPort: process.env.PG_PORT,
    systemPort: process.env.PORT || 4500
}