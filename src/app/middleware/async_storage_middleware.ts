import { HeaderKeys } from '#constants/header.const'
import { storage } from '#providers/storage'
import { Optional, ScopeVariable, Session } from '#types/global.type'
import { HttpContext } from '@adonisjs/core/http'
import { IncomingHttpHeaders } from 'http'

const extractHeaderInfo = (
  headers: IncomingHttpHeaders,
  key: (typeof HeaderKeys)[keyof typeof HeaderKeys]
): Optional<string> => {
  return headers[key] ? String(headers[key]) : null
}
export default class AsyncLocalStorageMiddleware {
  public async handle(ctx: HttpContext, next: () => Promise<void>) {
    const headers = ctx.request.headers()
    const scopeVariable: ScopeVariable = {
      accessToken: extractHeaderInfo(headers, HeaderKeys.AccessToken),
      refreshToken: extractHeaderInfo(headers, HeaderKeys.RefreshToken),
      appName: extractHeaderInfo(headers, HeaderKeys.AppName),
      appBuildNumber: extractHeaderInfo(headers, HeaderKeys.AppBuildNumber),
      requestId: extractHeaderInfo(headers, HeaderKeys.RequestId),
      hash: extractHeaderInfo(headers, HeaderKeys.HashKey),
      deviceId: extractHeaderInfo(headers, HeaderKeys.DeviceId),
      requestIp: ctx.request.ip(),
      session: {
        userId: 10,
      } as Session,
    }
    ctx.request.scopeVariable = scopeVariable
    await storage.run(ctx, async () => {
      return await next()
    })
  }
}
