import { Topic } from '@google-cloud/pubsub'
import { MessageOptions } from '@google-cloud/pubsub/build/src/topic.js'

export class GoogleProducerService {
  private readonly topic: Topic
  constructor(pubSub: Topic) {
    this.topic = pubSub
  }

  async produce(record: MessageOptions) {
    return await this.topic.publishMessage(record)
  }
}
