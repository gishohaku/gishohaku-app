const routes = require('next-routes')

module.exports = routes()
  .add('/books/new', '/books/new')
  .add('/books/:id', '/books/_id')