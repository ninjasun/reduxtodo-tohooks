import React from 'react'
import PropTypes from 'prop-types'
import Link from '../Link'
import { map, curry } from 'ramda'
import {
  SHOW_ALL,
  SHOW_COMPLETED,
  SHOW_ACTIVE
} from '../../constants/TodoFilters'

const FILTER_TITLES = [
  {
    code: SHOW_ALL,
    name: 'All'
  },
  {
    code: SHOW_ACTIVE,
    name: 'Active'
  },
  {
    code: SHOW_COMPLETED,
    name: 'Completed'
  }
]

const renderFilter = curry((onClick, filterType, filter) => {
  return (
    <li key={filter.code}>
      <Link
        filter={filter.code}
        setFilter={onClick}
        active={filterType === filter.code}
      >
        {filter.name}
      </Link>
    </li>
  )
})

const Footer = ({
  activeCount,
  completedCount,
  onClearCompleted,
  setFilter,
  filterType
}) => {
  const itemWord = activeCount === 1 ? 'item' : 'items'
  const rendered = renderFilter(setFilter, filterType)
  return (
    <footer className='footer'>
      <span className='todo-count'>
        <strong>{activeCount || 'No'}</strong> {itemWord} left
      </span>
      <ul className='filters'>{map(rendered, FILTER_TITLES)}</ul>
      {!!completedCount && (
        <button className='clear-completed' onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  )
}

Footer.propTypes = {
  completedCount: PropTypes.number.isRequired,
  activeCount: PropTypes.number.isRequired,
  onClearCompleted: PropTypes.func.isRequired
}

export default Footer
