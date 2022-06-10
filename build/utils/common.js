const path = require('path')

export const projectPath = path.resolve(__dirname, '..', '..')
export const isProdEnv = () => process.env.NODE_ENV === 'production'
