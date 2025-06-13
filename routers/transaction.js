const express = require('express')
const transactions = express.Router()
const { randomOrderNumber } = require('../helpers/utils')
const { checkout } = require('../controller/transactions')

transactions.route('/').post(async (req, res) => {
    const { total_price, paid_amount, products } = req.body;
    const order = {
        no_order: randomOrderNumber(),
        total_price,
        paid_amount,
    };
    const result = await checkout(order, products);
    res.send(result);
});


module.exports = transactions