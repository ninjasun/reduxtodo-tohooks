import React from 'react'
import { createRenderer } from 'react-test-renderer/shallow'
import TodoList from './TodoList'
import TodoItem from './TodoItem'

const renderTodo = todo => (
  <TodoItem
    key={todo.id}
    todo={todo}
    editTodo={jest.fn()}
    deleteTodo={jest.fn()}
  />
)

describe('components', () => {
  describe('TodoList', () => {
    it('should render container', () => {
      //const { output } = setup()
      //expect(output.type).toBe('ul')
      // expect(output.props.className).toBe('todo-list')
    })
  })
})
