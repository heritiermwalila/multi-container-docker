const redisClient = require('redis')
const {redisHost, redisPort} = require('./keys')

const client = redisClient.createClient({
    host: redisHost,
    port: redisPort,
    retry_strategy: () =>1000
})

const sub = client.duplicate()

function fib(index){
    if(index < 2) return 1
    return fib(index - 1) + fib(index - 2)
}

sub.on('message', (channel, message) => {
    client.hset('values', message, fib(parseInt(message)))
})

sub.subscribe('insert')