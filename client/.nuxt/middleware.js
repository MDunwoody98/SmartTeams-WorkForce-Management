const middleware = {}

    middleware['validate-admin'] = require('..\\middleware\\validate-admin.js')
  middleware['validate-admin'] = middleware['validate-admin'].default || middleware['validate-admin']

    middleware['validate-manager'] = require('..\\middleware\\validate-manager.js')
  middleware['validate-manager'] = middleware['validate-manager'].default || middleware['validate-manager']

export default middleware
