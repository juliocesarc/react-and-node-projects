import express from 'express'
import { randomUUID } from 'node:crypto'

const app = express()
app.use(express.json())

const users = []

// Middleware
function checkExistsUserAccount (req, res, next) {
    const { username } = req.headers
    
    const user = users.find(user => {
        return user.username === username
    })
    
    if(!user) {
        return res.status(401).send({
            error: 'User not found!'
        })
    }

    req.user = user

    next()
}

function getTodo(user, id) {
    const todo = user.todos.find(todo => {
        return todo.id === id
    })

    return todo
}

app.post('/users', (req, res) => {
    const { name, username } = req.body

    const existsUser = users.some(user => {
        return user.username == username
    })

    if (existsUser) {
        return res.status(400).json({
            error: "Sorry this username already exists"
        })
    }

    const user = {
        id: randomUUID(),
        name,
        username,
        todos: []
    }

    users.push(user)

    return res.status(201).json(user)
})

app.post('/todos', checkExistsUserAccount, (req, res) => {
    const { user } = req
    const { title, deadline } = req.body

    const todo = {
        id: randomUUID(),
        title,
        done: false,
        deadline: new Date(deadline),
        created_at: new Date()
    }

    user.todos.push(todo)

    return res.status(201).json(todo)
})

app.get('/todos', checkExistsUserAccount, (req, res) => {
    const { user } = req

    return res.json(user.todos)
})

app.put('/todos/:id', checkExistsUserAccount, (req, res) => {
    const { user } = req
    const { id } = req.params
    const { title, deadline } = req.body
    
    let todo = getTodo(user, id)

    if (!todo) {
        return res.status(404).send({
            error: "The passed id does not match any todo!"
        })
    }

    todo = {
        ...todo,
        title, 
        deadline: new Date(deadline), 
    }

    return res.json(todo)
})

app.patch('/todos/:id/done', checkExistsUserAccount, (req, res) => {
    const { user } = req
    const { id } = req.params
    
    let todo = getTodo(user, id)

    if (!todo) {
        return res.status(404).send({
            error: "The passed id does not match any todo!"
        })
    }

    todo = {
        ...todo,
        done: !todo.done, 
    }

    return res.json(todo)
})

app.delete('/todos/:id', checkExistsUserAccount, (req, res) => {
    const { user } = req
    const { id } = req.params
    
    let todo = getTodo(user, id)

    if (!todo) {
        return res.status(404).send({
            error: "The passed id does not match any todo!"
        })
    }

    const index = user.todos.indexOf(todo)

    user.todos.splice(index, 1)

    return res.status(204).send()
})

app.listen(3333)