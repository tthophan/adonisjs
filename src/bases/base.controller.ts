import { Request } from '@adonisjs/core/http'
import { VineValidator } from '@vinejs/vine'
import { Infer, SchemaTypes } from '@vinejs/vine/types'

type Validate = VineValidator<SchemaTypes, Record<string, any>>
type Schema<Body extends Validate, Params extends Validate, Query extends Validate> = {
  params?: Params
  body?: Body
  query?: Query
}
type Response<Body extends Validate, Params extends Validate, Query extends Validate> = {
  params?: Infer<Params>
  body?: Infer<Body>
  query?: Infer<Query>
}

export class BaseController {
  protected async extractInfo<
    Body extends Validate,
    Params extends Validate,
    Query extends Validate,
  >(schema: Schema<Body, Params, Query>, request: Request): Promise<Response<Body, Params, Query>> {
    return {
      params: schema.params ? await schema.params.validate(request.params()) : null,
      body: schema.body ? await schema.body.validate(request.body()) : null,
      query: schema.query ? await schema.query.validate(request.qs()) : null,
    }
  }
}
