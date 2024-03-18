import { PrismaService } from '#database/prisma.service'
import { inject } from '@adonisjs/core'
import { Prisma } from '@prisma/client'

@inject()
export class UserService {
  constructor(private readonly prismaService: PrismaService) { }
  async users() {
    return await this.prismaService.user.findMany({
      orderBy: {
        id: Prisma.SortOrder.desc,
      },
    })
  }

  async createUser(data: { email: string, name: string }) {
    return await this.prismaService.user.create({
      data: {
        ...data,
        isDeleted: false,
      },
    })
  }
}
