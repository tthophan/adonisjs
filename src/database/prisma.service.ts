import { inject } from '@adonisjs/core'
import { PrismaClient } from '@prisma/client'

@inject()
export class PrismaService extends PrismaClient {
  async connect() {
    await this.$connect()
  }

  async disconnect() {
    await this.$disconnect()
  }

  async beginTransaction() {}

  async commitTransaction() {}

  async rollbackTransaction() {}
}
