const routes = require('next-routes')

module.exports = routes()
  .add('/books/:id', '/books/_id');