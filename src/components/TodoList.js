import React from 'react'
import PropTypes from 'prop-types'
import TodoItem from './TodoItem'

const TodoList = ({ children }) => <ul className='todo-list'>{children}</ul>

TodoList.propTypes = {}

export default TodoList
