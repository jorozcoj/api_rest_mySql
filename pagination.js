const movieList = require('./movies.json');

const totalItem = movieList.length
const itemByPage = 5
let totalPages = (totalItem/itemByPage)
let pageNumber = 4
const itemToSkip = (pageNumber-1) * itemByPage
const items = movieList.slice(itemToSkip, itemByPage + itemToSkip)

console.log(items)
