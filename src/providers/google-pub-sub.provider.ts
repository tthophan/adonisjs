import env from '#start/env'
import { ApplicationService } from '@adonisjs/core/types'
import { Message, PubSub } from '@google-cloud/pubsub'
import { GoogleConsumeService } from '../events/google/consume.service.js'
import { GoogleProducerService } from '../events/google/producer.service.js'

export default class GooglePubSubProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.singleton(GoogleConsumeService, () => {
      return new GoogleConsumeService(
        new PubSub({
          projectId: env.get('GOOGLE_PROJECT_ID'),
          keyFile: env.get('GOOGLE_APPLICATION_CREDENTIAL'),
        })
      )
    })
    this.app.container.singleton(GoogleProducerService, () => {
      const pubSub = new PubSub({
        projectId: env.get('GOOGLE_PROJECT_ID'),
        keyFile: env.get('GOOGLE_APPLICATION_CREDENTIAL'),
      })
      return new GoogleProducerService(pubSub.topic(env.get('GOOGLE_TOPIC_NAME')))
    })
  }

  async ready() {
    const consumeService = await this.app.container.make(GoogleConsumeService)
    await consumeService.consume(
      {
        topicName: env.get('GOOGLE_TOPIC_NAME'),
        subscriptionName: env.get('GOOGLE_SUBSCRIPTION_NAME'),
      },
      async (message: Message) => {
        console.log('google pub/sub message Received =============', message.data.toString())
        message.ack()
      }
    )
  }

  async shutdown() {
    this.app.container.resolving(
      GoogleConsumeService,
      async (prismaService: GoogleConsumeService) => {
        await prismaService.terminating()
      }
    )
  }
}
