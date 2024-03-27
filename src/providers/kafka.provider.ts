import { PrismaService } from '#database/prisma.service'
import env from '#start/env'
import { ApplicationService } from '@adonisjs/core/types'
import { Kafka, logLevel } from 'kafkajs'
import { ConsumeService } from '../events/kafka/consume.service.js'
import { ProducerService } from '../events/kafka/producer.service.js'

export default class KafkaProvider {
  constructor(protected app: ApplicationService) {}
  private buildKafkaInstance() {
    return new Kafka({
      brokers: [env.get('KAFKA_BROKER')],
      logLevel: logLevel.ERROR,
    })
  }
  register() {
    this.app.container.singleton(ProducerService, () => {
      const kafka = this.buildKafkaInstance()
      const producer = kafka.producer()
      producer.connect()
      return new ProducerService(producer)
    })
    this.app.container.singleton(ConsumeService, () => {
      const kafka = this.buildKafkaInstance()
      return new ConsumeService(kafka)
    })
  }

  async boot() {
    this.app.container.resolving(PrismaService, async (prismaService: PrismaService) => {
      await prismaService.connect()
    })
  }

  async start() {}

  async ready() {
    const consumeService = await this.app.container.make(ConsumeService)

    await consumeService.consume(
      { topics: [env.get('KAFKA_TOPIC')] },
      {
        autoCommit: false,
        eachMessage: async (messagePayload) => {
          console.log('Kafka message Received', messagePayload.topic)
        },
      }
    )
  }

  async shutdown() {
    this.app.container.resolving(PrismaService, async (prismaService: PrismaService) => {
      await prismaService.disconnect()
    })

    this.app.container.resolving(ProducerService, async (producer: ProducerService) => {
      await producer.terminating()
    })

    // Disconnect all the consumer on Application shutdown
    this.app.container.resolving(ConsumeService, async (consume: ConsumeService) => {
      await consume.terminating()
    })
  }
}
