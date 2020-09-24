const express = require('express')
const {createClient} = require('redis')
const { redisHost, redisPort, systemPort, pgUsername, pgHost, pgDatabase, pgPassword, pgPort } = require('./config')
const app = express()
const { Pool } = require('pg')
const cors = require('cors')

app.use(cors())
app.use(express.json())


// app.use(client)

const pool = new Pool({
    user: pgUsername,
    host:pgHost,
    database: pgDatabase,
    password: pgPassword,
    port: pgPort,

})

pool.on('error', ()=>console.log('lost connection'))

pool.query('CREATE TABLE IF NOT EXIST values(number INT)').catch(err=>console.log(err))

const client = createClient({ host: redisHost, port: redisPort, retry_strategy:()=>1000 })
const client2 = client.duplicate()

app.get('/', (req, res)=>{
    res.send('Hi')
})

app.get('/values/all', async (req, res) => {
    try {
        const values = await pool.query('SELECT * FROM values')
        res.status(200).send(values.rows)
    } catch (error) {
        
    }
})


app.get('/values/current', async (req, res)=>{
    try {
        await pool.hgetall('values', (err, values)=>{
            res.status(200, values)
        })
    } catch (error) {
        
    }
})

app.post('/values', (req, res)=>{
    try {
        const {index} = req.body
        if(index > 40){
            return res.status(422).send('Index to high')
        }
        client.hset('values', index, 'nothing yet')
        client2.publish('insert', index)
        pool.query('INSERT INTO values(number) VALUES($1)', [index])
        res.status(200).json({working: true})
    } catch (error) {
        
    }
})


app.listen(systemPort, ()=>console.log(`server running on http://localhost:${systemPort}`))