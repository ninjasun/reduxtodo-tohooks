import React from 'react'
import { createRenderer } from 'react-test-renderer/shallow'
import App from './App'
import Header from './header/Header'
import TodoList from './todo-list/TodoList'

const setup = propOverrides => {
  const renderer = createRenderer()
  renderer.render(<App />)
  const output = renderer.getRenderOutput()
  return output
}

describe('components', () => {
  describe('Header', () => {
    it('should render', () => {
      const output = setup()
      const [header] = output.props.children
      expect(header.type).toBe(Header)
    })
  })

  describe('Todolist', () => {
    it('should render', () => {
      const output = setup()
      debugger
      const [, todoList] = output.props.children
      expect(todoList.type).toBe(TodoList)
    })
  })
})
