import React, { useState, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import TodoItem from './TodoItem'
import TodoList from './TodoList'
import { filter, concat, curry, map, reduce } from 'ramda'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'
const api = `http://localhost:3000/api`

/********* UTILS ************ */
const isDiff = curry((id, item) => item.id !== id)

const replace = curry((updatedItem, item) =>
  item.id === updatedItem.id ? updatedItem : item
)

/*
 * @{param} list
 * @{param} cb
 * @{param} item
 */
const replaceItem = curry((list, cb, item) => {
  const replaced = replace(item)
  const updatedList = map(replaced, list)
  cb(updatedList)
})

const replaceAll = curry((cb, list) => {
  console.log(list)
  cb(list)
})

const concatItem = curry((list, cb, item) => {
  const upList = concat([item], list)
  cb(upList)
})

const destroyItem = curry((list, cb, itemId) => {
  const isItemDiff = isDiff(itemId)
  const upList = filter(isItemDiff, list)
  cb(upList)
})

const getTodosCount = list => list.length
const getCompletedTodosCount = reduce((count, item) =>
  item.completed ? count + 1 : count
)

const getActiveTodosCount = reduce((count, item) =>
  !item.completed ? count + 1 : count
)

const renderTodos = curry((todos, filterType) => {
  const compare = setupCompare(filterType)
  return filter(compare, todos)
})

/*** filter logic */
const showCompleted = item => item.completed && item
const showActive = item => !item.completed && item
const showAll = item => item

/** must be enum ( SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE ) */

const setupCompare = filterType => {
  switch (filterType) {
    case SHOW_COMPLETED:
      return showCompleted
    case SHOW_ACTIVE:
      return showActive
    default:
      return showAll
  }
}
/************  API   *************** */

/*********** FETCH ********************* */
const fetchFromAPI = curry((baseURL, endPoint, cb) => {
  fetch(`${baseURL}${endPoint}`)
    .then(res => res.json())
    .then(data => cb(data))
    .catch(err => console.error(err.message))
})
const fetchTodoApi = fetchFromAPI(api)
const fetchTodos = fetchTodoApi('/todos')
/************* CREATE  **********************/
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
/************  DELETE ***************/
const deleteFromAPI = curry((baseURL, endPoint, cb) => {
  fetch(`${baseURL}${endPoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => cb(data))
    .catch(err => console.error(err.message))
})
const destroyTodo = deleteFromAPI(api)
/***********  UPDATE ****************/
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
/********** BULK UPDATE **********/
const bulkUpdateFromAPI = curry((baseURL, endPoint, data, cb) => {
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
const bulkUpdateTodos = bulkUpdateFromAPI(api, '/todos/bulk_update')
const complete = item => ({ ...item, completed: true })

/********** BULK DELETE **********/
const bulkDeleteFromAPI = curry((baseURL, endPoint, ids, cb) => {
  fetch(`${baseURL}${endPoint}`, {
    method: 'POST',
    body: JSON.stringify(ids),
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }
  })
    .then(res => res.json())
    .then(data => cb(data))
    .catch(err => console.error(err.message))
})
const bulkDeleteTodos = bulkDeleteFromAPI(api, '/todos/bulk_delete')

/************************************************ */
const App = () => {
  const [todos, setTodos] = useState([])
  const [filterType, setFilter] = useState(SHOW_ALL)

  const filteredTodos = renderTodos(todos, filterType)

  useEffect(() => {
    fetchTodos(t => {
      setTodos(t)
    })
  }, [])

  useEffect(() => {
    setupCompare(filterType)
  }, [filterType])

  const addTodo = text => {
    createTodo({ text, completed: false })(concatItem(todos, setTodos))
  }

  const updateTodo = todo => {
    putTodo(`/todos/${todo.id}`, todo)(replaceItem(todos, setTodos))
  }

  const deleteTodo = id => {
    destroyTodo(`/todos/${id}`)(destroyItem(todos, setTodos, id))
  }

  const completeAllTodos = () => {
    const completed = map(complete, todos)
    bulkUpdateTodos({ todos: completed })(replaceAll(setTodos))
  }

  const destroyAllTodos = () => {
    //const ids = map(filter())
    //bulkDeleteTodos(ids, setTodos)
  }

  const handleFilter = (e, filter) => {
    e.preventDefault()
    setFilter(filter)
  }

  const renderTodo = todo => (
    <TodoItem
      key={todo.id}
      todo={todo}
      editTodo={updateTodo}
      deleteTodo={deleteTodo}
    />
  )

  const todosCount = getTodosCount(todos)
  const completedCount = getCompletedTodosCount(0, todos)
  const activeCount = getActiveTodosCount(0, todos)

  return (
    <div>
      <Header addTodo={addTodo} />
      <section className='main'>
        <span>
          <input
            className='toggle-all'
            type='checkbox'
            checked={completedCount === todosCount}
            readOnly
          />
          <label onClick={completeAllTodos} />
        </span>
        <TodoList>{map(renderTodo, filteredTodos)} </TodoList>
      </section>
      <Footer
        activeCount={activeCount}
        completedCount={completedCount}
        onClearCompleted={() => {}}
        setFilter={handleFilter}
        filterType={filterType}
      />
    </div>
  )
}

export default App
