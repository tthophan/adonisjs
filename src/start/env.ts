/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'
export default await Env.create(new URL('../../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),
  DATABASE_URL: Env.schema.string(),
  // Google Pub/Sub Configuration
  GOOGLE_TOPIC_NAME: Env.schema.string(),
  GOOGLE_SUBSCRIPTION_NAME: Env.schema.string(),
  GOOGLE_PROJECT_ID: Env.schema.string(),
  GOOGLE_APPLICATION_CREDENTIAL: Env.schema.string(),
  // Kafka configuration
  KAFKA_BROKER: Env.schema.string(),
  KAFKA_TOPIC: Env.schema.string(),
})
