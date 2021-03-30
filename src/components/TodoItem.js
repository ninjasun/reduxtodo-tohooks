import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import TodoTextInput from './TodoTextInput'
import { merge } from 'lodash'

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  editTodo: PropTypes.func.isRequired
}

function TodoItem ({ todo, editTodo, deleteTodo }) {
  const [editing, setEditing] = useState(false)

  const handleSave = (todo, text) => {
    if (text.length === 0) {
      deleteTodo(todo.id)
    } else {
      editTodo(merge(todo, { text: text }))
    }
    setEditing(false)
  }

  const handleDoubleClick = () => {
    setEditing(true)
  }

  let element
  if (editing) {
    element = (
      <TodoTextInput
        text={todo.text}
        editing={editing}
        onSave={text => handleSave(todo, text)}
      />
    )
  } else {
    element = (
      <div className='view'>
        <input
          className='toggle'
          type='checkbox'
          checked={todo.completed}
          onChange={() => {
            editTodo(merge(todo, { completed: !todo.completed }))
          }}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.text}</label>
        <button className='destroy' onClick={() => deleteTodo(todo.id)} />
      </div>
    )
  }

  return (
    <li
      data-cy={`todo-item-${todo.id}`}
      className={classnames({
        completed: todo.completed,
        editing: editing
      })}
    >
      {element}
    </li>
  )
}

export default TodoItem
