import { RequestValidator } from '@adonisjs/core/http'

export type Optional<T> = T | null | undefined
type dynamicType<T extends any = any> =
  | number
  | string
  | Array<T>
  | Record<string | number, T>
  | Optional<T>

export interface Session {
  userId?: Optional<number>

  email: string

  phone: string

  avatar: string

  address: string

  registrationDate: Date

  fullName: string
}

export interface ScopeVariable {
  accessToken?: Optional<string>

  refreshToken?: Optional<string>

  appName?: Optional<string>

  appBuildNumber?: Optional<string>

  requestId?: Optional<string>

  hash?: Optional<string>

  deviceId?: Optional<string>

  session?: Optional<Session>

  requestIp?: Optional<string>

  [key: string]: dynamicType
}

declare module '@adonisjs/core/http' {
  interface Request extends RequestValidator {
    scopeVariable: ScopeVariable
  }
}
