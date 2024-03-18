import { BaseController } from '#bases/base.controller'
import { UserService } from '#services/user.service'
import { createUserValidator, updateUserValidator } from '#validators/users/user.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'


@inject()
export class UserController extends BaseController {
  constructor(
    protected readonly ctx: HttpContext,
    private readonly userService: UserService
  ) {
    super()
  }
  async stores(
    { request }: HttpContext,
  ) {
    const input = await this.extractInfo({
      body: createUserValidator,
      params: updateUserValidator,
      query: updateUserValidator
    }, request)
    return await this.userService.createUser(input.body!)
  }

  async index() {
    return await this.userService.users()
  }
  async update() {
    return 'updated'
  }
  async destroy() {
    return 'destroy'
  }
}
