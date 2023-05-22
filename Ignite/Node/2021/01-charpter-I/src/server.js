import express from "express"
import { randomUUID } from 'node:crypto'


const app = express()

app.use(express.json())

const customers = []

// Middleware
function verifyIfExistsAccountCPF(req, res, next) {
    const { cpf } = req.headers

    const customer = customers.find(customer => customer.cpf === cpf)

    if (!customer) {
        return res.status(400).json({message: 'Customer not found!'})
    }
    req.customer = customer
    return next()
}

function getBalance(statement) {
    const balance = statement.reduce(
        (acumulator, transfer) => {
            if (transfer.type !== 'credit') {
                return acumulator - transfer.amount
            }
            return acumulator + transfer.amount
        }, 0)
    return balance
    
}

app.post('/account', (req, res) => {
    const { cpf, name } = req.body

    const customerAlreadyExists = customers.some(customer => customer.cpf === cpf)

    if (customerAlreadyExists) {
        return res.status(400).json({error: 'Customer already exists!'})
    }

    customers.push({
        id: randomUUID(),
        name,
        cpf,
        statement: []
    })

    return res.status(201).end()
})

app.get('/statement', verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req

    if (!customer) {
        return res.status(400).json({message: 'Customer not found!'})
    }

    return res.json(customer.statement)
})

app.post('/deposit', verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req
    const { description, amount } = req.body

    customer.statement.push({
        id: randomUUID(),
        description,
        amount,
        type: 'credit',
        created_at: new Date(),
    })
    return res.status(201).send()
})

app.post('/withdraw', verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req
    const { amount } = req.body

    const balance = getBalance(customer.statement)

    if (balance < amount) {
        return res.status(400).json({error: 'Insufficient funds'})
    }

    customer.statement.push({
        id: randomUUID(),
        description,
        amount,
        type: 'debit',
        created_at: new Date(),
    })

    return res.send()
})

app.get('/statement/date', verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req
    const { date } = req.query

    const dateFormat = new Date(date + " 00:00");
    const statement = customer.statement.filter(
        statement => {
            statement.created_at.toDateString() === new Date(dateFormat).toDateString()
    })

    return res.json(statement)
})

app.patch('/account', verifyIfExistsAccountCPF, (req, res) => {
    const { name } = req.body
    const { customer } = req.headers

    customer.name = name

    return res.status(201).send()
})

app.get('/account', verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req.headers
    return res.json(customer)
})

app.delete('/account', verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req.headers

    customers.splice(customer, 1)

    return res.send()
})

app.get('/balance', verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req.headers

    const balance = getBalance(customer.statement)

    return res.json({amount: balance})
})

app.listen(3333)