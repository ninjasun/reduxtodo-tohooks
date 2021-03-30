import React, { useState, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import MainSection from './MainSection'

import TodoItem from './TodoItem'
import TodoList from './TodoList'
import { filter, concat, curry, map } from 'ramda'
const api = `http://localhost:3000/api`

/********* UTILS ************ */
const isDiff = curry((id, item) => {
  console.log('item: ', item)
  return item.id !== id
})
const replace = curry((updatedItem, item) =>
  item.id === updatedItem.id ? updatedItem : item
)

const replaceItem = curry((item, list, cb) => {
  const replaced = replace(item)
  const updatedList = map(replaced, list)
  cb(updatedList)
})

const update = curry((todos, cb, item) => {
  cb(concat([item], todos))
})

const concatItem = curry((list, cb, item) => cb(concat([item], list)))

/*************************** */

const fetchFromAPI = curry((baseURL, endPoint, cb) => {
  fetch(`${baseURL}${endPoint}`)
    .then(res => res.json())
    .then(data => cb(data))
    .catch(err => console.error(err.message))
})
const fetchTodoApi = fetchFromAPI(api)
const fetchTodos = fetchTodoApi('/todos')

const postToAPI = curry((baseURL, endPoint, body, cb) => {
  fetch(`${baseURL}${endPoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(data => cb(data))
    .catch(err => console.error(err.message))
})

const createTodo = postToAPI(api, '/todos')

const deleteFromAPI = curry((baseURL, endPoint, cb) => {
  fetch(`${baseURL}${endPoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }
  })
    .then(res => res.json())
    .then(data => cb(data))
    .catch(err => console.error(err.message))
})
const destroyTodo = deleteFromAPI(api)

const updateFromAPI = curry((baseURL, endPoint, data, cb) => {
  fetch(`${baseURL}${endPoint}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }
  })
    .then(res => res.json())
    .then(data => cb(data))
    .catch(err => console.error(err.message))
})
const putTodo = updateFromAPI(api)

/************************************************ */
const App = () => {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos(t => {
      setTodos(t)
    })
  }, [])

  const addTodo = text => {
    createTodo({ text, completed: false })(concatItem(todos, setTodos))
  }

  const updateTodo = todo => {
    putTodo(
      `/todos/${todo.id}`,
      todo
    )(updatedTodo => {
      replaceItem(updatedTodo, todos, setTodos)
      //setTodos(updatedTodos)
    })
  }

  const deleteTodo = id => {
    const isDiffItem = isDiff(id)
    destroyTodo(`/todos/${id}`)(() => {
      const updatedTodo = filter(isDiffItem, todos)

      setTodos(updatedTodo)
    })
  }

  const renderTodo = todo => (
    <TodoItem
      key={todo.id}
      todo={todo}
      editTodo={updateTodo}
      deleteTodo={deleteTodo}
    />
  )

  return (
    <div>
      <Header addTodo={addTodo} />
      <section>
        <TodoList>{map(renderTodo, todos)} </TodoList>
      </section>
    </div>
  )
}

export default App
