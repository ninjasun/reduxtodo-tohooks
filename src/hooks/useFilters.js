import React, { useEffect, useState } from 'react'
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters'

const FiltersContext = React.createContext()

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
const { Provider } = FiltersContext

const FiltersProvider = ({ children }) => {
  const [filterType, setFilter] = useState('SHOW_ALL')
  const getFilters = () => FILTER_TITLES

  const values = React.useMemo(
    () => ({
      filterType,
      getFilters,
      setFilter
    }),
    [filterType]
  )

  return <Provider value={values}>{children}</Provider>
}
const useFilters = () => {
  const context = React.useContext(FiltersContext)

  if (context === undefined) {
    throw new Error(
      '`useFilter` hook must be used within a `FilterProvider` component'
    )
  }
  return context
}

export { useFilters, FiltersContext, FiltersProvider }
