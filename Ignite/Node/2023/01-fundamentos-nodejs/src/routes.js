import { Database } from "./database.js"
import { randomUUID } from "node:crypto"
import { buidRoutePath } from "./utils/build-route-path.js"


const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buidRoutePath('/users'),
        handler: (req, res) => {
            const { search } = req.query

            const users = database.select('users', search ? {
                name: search,
                email: search
            } : null)

            return res.end(JSON.stringify(users))
        }
    },

    {
        method: 'POST',
        path: buidRoutePath('/users'),
        handler: (req, res) => {
            const { name, email } = req.body

            const user = {
                id: randomUUID(),
                name,
                email,
            }

            database.insert('users', user)
        
            return res.writeHead(201).end()
        }
    },

    {
        method: 'DELETE',
        path: buidRoutePath('/users/:id'),
        handler: (req, res) => {
            const { id } = req.parms
            database.delete('users', id)
            return res.writeHead(204).end()
        }
    },

    {
        method: 'PUT',
        path: buidRoutePath('/users/:id'),
        handler: (req, res) => {
            const { id } = req.parms
            const { name, email } = req.body

            database.update('users', id, {
                name,
                email
            })
            return res.writeHead(204).end()
        }
    }
]