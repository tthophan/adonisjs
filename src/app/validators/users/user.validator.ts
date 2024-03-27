import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(6),
    email: vine.string().trim().email(),
  })
)
export const updateUserValidator = vine.compile(
  vine.object({
    id: vine.number(),
  })
)
