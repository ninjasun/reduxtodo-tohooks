import { filter, concat, curry, map, reduce } from 'ramda'

export { replaceItem, replaceAll, concatItem, destroyItem }
/* @{param} list
 * @{param} cb
 * @{param} item
 */
const replaceItem = curry((list, cb, item) => {
  const replaced = replace(item)
  const updatedList = map(replaced, list)
  cb(updatedList)
})

const replaceAll = curry((cb, list) => {
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

const isDiff = curry((id, item) => item.id !== id)

const replace = curry((updatedItem, item) =>
  item.id === updatedItem.id ? updatedItem : item
)
