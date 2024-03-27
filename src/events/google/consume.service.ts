import { Message, PubSub, PublishOptions, Subscription } from '@google-cloud/pubsub'

type consumeOption = {
  topicName: string
  subscriptionName: string
  gaxOpts?: PublishOptions | undefined
}
export class GoogleConsumeService {
  private readonly subscriptions: Array<Subscription> = []
  private readonly pubSub: PubSub
  constructor(pubSub: PubSub) {
    this.pubSub = pubSub
  }

  async consume(options: consumeOption, listener: (message: Message) => void) {
    const topic = this.pubSub.topic(options.topicName, options.gaxOpts)
    const subscription = topic.subscription(options.subscriptionName)
    subscription.on('message', listener)
    this.subscriptions.push(subscription)
  }

  async terminating() {
    for (const subscription of this.subscriptions) {
      await subscription.close()
      await subscription.removeAllListeners()
    }
  }
}
