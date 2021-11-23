import React, { useState, useEffect } from 'react'
import Header from './header/Header'
import Footer from './footer/Footer'
import TodoItem from './todo-item/TodoItem'
import TodoList from './todo-list/TodoList'
import { filter, curry, map, reduce } from 'ramda'
import { replaceItem, replaceAll, concatItem, destroyItem } from '../utils'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'
import {
  fetchTodos,
  createTodo,
  destroyTodo,
  updateTodo,
  bulkUpdateTodos,
  bulkDeleteTodos
} from '../API/todos'
import { FiltersProvider, useFilters } from '../hooks/useFilters'

const Main = () => {
  return (
    <div>
      <FiltersProvider>
        <Main />
      </FiltersProvider>
    </div>
  )
}

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
const complete = item => ({ ...item, completed: true })

/********* STATUS ENUM **********/
const _idle = 'IDLE'
const _success = 'SUCCESS'
const _fetching = 'FETCHING'
const _error = 'ERROR'
/************************************************ */
const App = () => {
  const [todos, setTodos] = useState([])
  const { filterType } = useFilters()
  const filteredTodos = renderTodos(todos, filterType)

  useEffect(() => {
    fetchTodos(t => {
      setTodos(t)
    })
  }, [])

  useEffect(() => {
    setupCompare(filterType)
    console.log('app filterType; ', filterType)
  }, [filterType])

  const addTodo = text => {
    createTodo({ text, completed: false })(concatItem(todos, setTodos))
  }

  const editTodo = todo => {
    updateTodo(`/${todo.id}`, todo)(replaceItem(todos, setTodos))
  }

  const deleteTodo = id => {
    destroyTodo(`/${id}`)(destroyItem(todos, setTodos, id))
  }

  const completeAllTodos = () => {
    const completed = map(complete, todos)
    bulkUpdateTodos({ todos: completed }, setTodos)
  }

  const destroyAllTodos = () => {
    const ids = todos.map(item => item.id)
    bulkDeleteTodos(ids, setTodos)
  }

  const handleFilter = (e, filter) => {
    e.preventDefault()
    //setFilter(filter)
  }

  const renderTodo = todo => (
    <TodoItem
      key={todo.id}
      todo={todo}
      editTodo={editTodo}
      deleteTodo={deleteTodo}
    />
  )

  const todosCount = getTodosCount(todos)
  const completedCount = getCompletedTodosCount(0, todos)
  const activeCount = getActiveTodosCount(0, todos)

  return (
    <Main>
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
        onClearCompleted={destroyAllTodos}
      />
    </Main>
  )
}

export default App
