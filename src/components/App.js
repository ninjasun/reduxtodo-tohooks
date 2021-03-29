import React, { useState, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import MainSection from './MainSection'
import { curry, map, concat } from 'lodash'
import TodoItem from './TodoItem'
import TodoList from './TodoList'
import { filter } from 'ramda'
const api = `http://localhost:3000/api`

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

const postTodo = postToAPI(api, '/todos')

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

const App = () => {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos(d => {
      console.log(d)
      setTodos(d)
    })
  }, [])

  const addTodo = text => {
    postTodo({ text, completed: false })(update)
    function update (d) {
      setTodos(concat(todos, d))
    }
  }

  const updateTodo = todo => {}

  const isDiff = curry((id, item) => {
    console.log('item: ', item)
    return item.id !== id
  })

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
        <TodoList>{map(todos, renderTodo)} </TodoList>
      </section>
    </div>
  )
}

export default App
