import http from "node:http"
import { json } from "./middlewares/json.js"
import { routes } from "./routes.js"
import { extractQueryParams } from "./utils/extract-query-params.js"


// Query Parameters: URL Stateful => Filtros, Paginação, não-obrigatórios
// Route Parameters: Identificação de recurso
// Request Body: Envio de informações de um formulário

// http://localhost:3333/user?userId=1&name=Julio

// GET http://localhost:3333/users/1
// DELET http://localhost:3333/users/1

// POST http://localhost:3333/users


const server = http.createServer(async (req, res) => {
    const { method, url } = req

    await json(req, res)

    
    const route = routes.find(route => {
        return route.method == method && route.path.test(url)
    })

    if (route) {
        const routeParameters = req.url.match(route.path)

        const { query, ...params } = routeParameters.groups

        req.parms = params
        req.query = query ? extractQueryParams(query): {}

        return route.handler(req, res)
    }

    return res.writeHead(404).end()
})

server.listen(3333)