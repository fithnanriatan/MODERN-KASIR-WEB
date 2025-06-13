const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const port = 3002

app.use(cors())
app.use(bodyParser.json())

const products = require('./routers/products')
const transactions = require('./routers/transaction')

app.get('/', (req, res)=> {    
    res.send('Hello sdfgil!')
})

app.use('/products', products)
app.use('/transactions', transactions)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})