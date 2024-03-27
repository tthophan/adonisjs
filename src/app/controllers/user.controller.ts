import { BaseController } from '#bases/base.controller'
import { UserService } from '#services/user.service'
import env from '#start/env'
import { createUserValidator, updateUserValidator } from '#validators/users/user.validator'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { GoogleProducerService } from '../../events/google/producer.service.js'
import { ProducerService } from '../../events/kafka/producer.service.js'

@inject()
export class UserController extends BaseController {
  constructor(
    protected readonly ctx: HttpContext,
    private readonly userService: UserService,
    private readonly producerService: ProducerService,
    private readonly googleProducerService: GoogleProducerService
  ) {
    super()
  }

  async stores({ request }: HttpContext) {
    const input = await this.extractInfo(
      {
        body: createUserValidator,
        params: updateUserValidator,
        query: updateUserValidator,
      },
      request
    )

    return await this.userService.createUser(input.body!)
  }

  async index() {
    const users = await this.userService.users()
    await this.googleProducerService.produce({
      json: {
        hello: 'hi',
      },
    })
    await this.producerService.produce({
      topic: env.get('KAFKA_TOPIC'),
      messages: [
        {
          value: JSON.stringify(users),
        },
      ],
    })
    return users
  }
  async update() {
    return 'updated'
  }
  async destroy() {
    return 'destroy'
  }
}
