import { Consumer, ConsumerRunConfig, ConsumerSubscribeTopics, Kafka } from 'kafkajs'

export class ConsumeService {
  // Connect to Kafka Server
  private readonly kafka: Kafka
  constructor(kafka: Kafka) {
    this.kafka = kafka
  }
  private readonly consumers: Consumer[] = []

  async consume(topics: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.kafka.consumer({
      groupId: 'kafka-consume',
      rebalanceTimeout: 60000, // 60 seconds, default is 30000 (30 seconds)
      allowAutoTopicCreation: true,
    })
    // Connecting Consumer
    await consumer.connect()

    //Passing Topics to consumer
    await consumer.subscribe(topics)

    //Setting  the Consumer Config
    await consumer.run(config)

    //Gathering all the Consumers
    this.consumers.push(consumer)
  }

  async terminating() {
    console.log('terminating')
    for (const consumer of this.consumers) {
      await consumer.disconnect()
    }
  }
}
