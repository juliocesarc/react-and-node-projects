import express from 'express'
import { randomUUID, i } from 'node:crypto'

const app = express();
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
    const { username } = request.header

    const user = users.find(user => {
        return user.username === username
    })

    if (!user) {
        return response.status(404).send({
            error: 'User not found!'
        })
    }

    request.user = user
    next()
}

function checksCreateTodosUserAvailability(request, response, next) {
    const { user } = request

    if (user.pro === false && user.todos.length() >= 10) {
        return response.status(403).send({
            message: 'Subscribe to the pro plan to continue using this feature!'
        })
    }

    next()
}

function checksTodoExists(request, response, next) {
    const { username } = request.header
    const { id } = request.params

    const user = users.find(user => {
    return user.username === username
    })

    if (!user) {
        return response.status(404).send({
            error: 'User not found!'
        })
    }
}

function findUserById(request, response, next) {
  // Complete aqui
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const usernameAlreadyExists = users.some((user) => user.username === username);

  if (usernameAlreadyExists) {
    return response.status(400).json({ error: 'Username already exists' });
  }

  const user = {
    id: randomUUID(),
    name,
    username,
    pro: false,
    todos: []
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get('/users/:id', findUserById, (request, response) => {
  const { user } = request;

  return response.json(user);
});

app.patch('/users/:id/pro', findUserById, (request, response) => {
  const { user } = request;

  if (user.pro) {
    return response.status(400).json({ error: 'Pro plan is already activated.' });
  }

  user.pro = true;

  return response.json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, checksCreateTodosUserAvailability, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const newTodo = {
    id: randomUUID(),
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date()
  };

  user.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put('/todos/:id', checksTodoExists, (request, response) => {
  const { title, deadline } = request.body;
  const { todo } = request;

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);
});

app.patch('/todos/:id/done', checksTodoExists, (request, response) => {
  const { todo } = request;

  todo.done = true;

  return response.json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, checksTodoExists, (request, response) => {
  const { user, todo } = request;

  const todoIndex = user.todos.indexOf(todo);

  if (todoIndex === -1) {
    return response.status(404).json({ error: 'Todo not found' });
  }

  user.todos.splice(todoIndex, 1);

  return response.status(204).send();
});
