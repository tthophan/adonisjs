import { queryExtension } from '#database/extensions/query.prisma.extension';
import { PrismaService } from '#database/prisma.service';
import env from '#start/env';
import { ApplicationService } from '@adonisjs/core/types';


export default class AppProvider {
  constructor(
    protected app: ApplicationService
  ) { }

  register() {
    this.app.container.singleton(
      PrismaService,
      () => {
        const prismaService = new PrismaService({
          datasourceUrl: env.get('DATABASE_URL'),
          log: ["query"]
        })
        return Object.assign(
          prismaService,
          prismaService.$extends({
            query: queryExtension,
          })
        )
      }
    )
  }

  async boot() {
    this.app.container.resolving(
      PrismaService,
      async (prismaService: PrismaService) => {
        await prismaService.connect()
      }
    );
  }

  async start() {
  }

  async ready() {
  }

  async shutdown() {
    this.app.container.resolving(
      PrismaService,
      async (prismaService: PrismaService) => {
        await prismaService.disconnect()
      }
    );
  }
}
