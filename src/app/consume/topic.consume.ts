import { inject } from '@adonisjs/core'

@inject()
export class TopicConsume {
  constructor() // private readonly userService: UserService,
  {}
  async consume(message: any) {
    console.log(message)
  }
}
