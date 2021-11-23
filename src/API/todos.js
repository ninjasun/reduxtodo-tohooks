import { filter, concat, curry, map, reduce } from 'ramda'

const headers = {
  'Content-Type': 'application/json'
  // 'Content-Type': 'application/x-www-form-urlencoded',
}
const API = process.env.REACT_APP_API_URL + '/api'

/*********** FETCH ********************* */
const fetchFromAPI = curry((baseURL, endPoint, cb) => {
  fetch(`${baseURL}${endPoint}`)
    .then(res => res.json())
    .then(data => cb(data))
    .catch(err => console.error(err.message))
})
/************* CREATE  **********************/
const createToAPI = curry((baseURL, endPoint, body, cb) => {
  fetch(`${baseURL}${endPoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(data => cb(data))
    .catch(err => console.error(err.message))
})
/************  DELETE ***************/
const deleteFromAPI = curry((baseURL, endPoint, id, cb) => {
  fetch(`${baseURL}${endPoint}${id}`, {
    method: 'DELETE',
    headers
  })
    .then(res => res.json())
    .then(data => cb(data))
    .catch(err => console.error(err.message))
})
/***********  UPDATE ****************/
const updateFromAPI = curry((baseURL, endPoint, id, data, cb) => {
  fetch(`${baseURL}${endPoint}${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers
  })
    .then(res => res.json())
    .then(data => cb(data))
    .catch(err => console.error(err.message))
})

/********** BULK UPDATE **********/
const bulkUpdateFromAPI = curry((baseURL, endPoint, data, cb) => {
  fetch(`${baseURL}${endPoint}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers
  })
    .then(res => {
      console.log('res ', res)
      res.json()
    })
    .then(data => {
      console.log('data ', data)
      cb(data)
    })
    .catch(err => console.error(err.message))
})

/********** BULK DELETE **********/
const bulkDeleteFromAPI = curry((baseURL, endPoint, ids, cb) => {
  fetch(`${baseURL}${endPoint}`, {
    method: 'POST',
    body: JSON.stringify(ids),
    headers
  })
    .then(res => res.json())
    .then(data => cb(data))
    .catch(err => console.error(err.message))
})

/************************************************** */
const bulkDeleteTodos = bulkDeleteFromAPI(API, '/todos/bulk_delete')
const fetchTodos = fetchFromAPI(API, '/todos')
const createTodo = createToAPI(API, '/todos')
const destroyTodo = deleteFromAPI(API, '/todos')
const updateTodo = updateFromAPI(API, '/todos')
const bulkUpdateTodos = bulkUpdateFromAPI(API, '/todos/bulk_update')

export {
  fetchTodos,
  destroyTodo,
  createTodo,
  updateTodo,
  bulkUpdateTodos,
  bulkDeleteTodos
}
