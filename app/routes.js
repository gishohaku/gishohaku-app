const routes = require('next-routes')

module.exports = routes()
  .add('/books/new', '/books/new')
  .add('/books/:id/edit', '/books/edit')
  .add('/books/:id/submit', '/books/submit')
  .add('/books/:id', '/books/_id')
  .add('/circles/:id/edit', '/circles/edit')
  .add('/circles/:id', '/circles/_id')
