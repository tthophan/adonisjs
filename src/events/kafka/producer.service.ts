import { Producer, ProducerRecord } from 'kafkajs'

export class ProducerService {
  private readonly producer: Producer
  constructor(producer: Producer) {
    this.producer = producer
  }

  async produce(record: ProducerRecord) {
    this.producer.send(record)
  }

  async terminating() {
    await this.producer.disconnect()
  }
}
