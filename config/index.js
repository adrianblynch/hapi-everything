const publicConfig = require('./public.json')
const privateConfig = require('./private.json')

module.exports = Object.assign({}, publicConfig, privateConfig)
