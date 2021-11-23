import React from 'react'
import PropTypes from 'prop-types'
import Link from '../Link'
import { map, curry } from 'ramda'
import { useFilters } from '../../hooks/useFilters'
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

const Footer = ({ activeCount, completedCount, onClearCompleted }) => {
  const itemWord = activeCount === 1 ? 'item' : 'items'
  const { filterType, getFilters, setFilter } = useFilters()
  const rendered = renderFilter(setFilter, filterType)
  const filters = getFilters()
  return (
    <footer className='footer'>
      <span className='todo-count'>
        <strong>{activeCount || 'No'}</strong> {itemWord} left
      </span>
      <ul className='filters'>{map(rendered, filters)}</ul>
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
