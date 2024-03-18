import { HttpContext } from "@adonisjs/core/http"
import { AsyncLocalStorage } from "async_hooks"
import { IncomingMessage } from "http"


export type Context = {
    request: IncomingMessage
}
export const storage = new AsyncLocalStorage<HttpContext>()
