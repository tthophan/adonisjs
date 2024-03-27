/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { UserController } from '#controllers/user.controller'
import router from '@adonisjs/core/services/router'

router.get('/health', async () => {
  return {
    hello: 'world',
  }
})
router
  .group(() => {
    router.resource('users', UserController)
    router.post('users/:id', [UserController, 'stores'])
  })
  .prefix('api')
