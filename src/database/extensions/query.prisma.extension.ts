import { storage } from '#providers/storage'
import { Prisma } from '@prisma/client'
import {
  DefaultArgs,
  DynamicQueryExtensionArgs,
  InternalArgs,
} from '@prisma/client/runtime/library'

const createdByField = 'createdBy'
const updatedByField = 'updatedBy'
const defaultUserId = -1

const getCurrentUserId = (): number => {
  return storage.getStore()?.request.scopeVariable?.session?.userId ?? defaultUserId
}

const hasField = (model: string, fieldName: string): boolean => {
  const modelInfo = Prisma.dmmf.datamodel.models.find((m) => m.name === model)
  const fields = modelInfo?.fields.map((field) => field.name)
  return fields?.includes(fieldName) ?? false
}

type QueryExtensionArgs = DynamicQueryExtensionArgs<
  { $allModels: unknown },
  Prisma.TypeMap<InternalArgs & DefaultArgs>
>

export const queryExtension: QueryExtensionArgs = {
  $allModels: {
    async create({ model, args, query }) {
      if (hasField(model, createdByField) && args.data)
        args.data[createdByField] = getCurrentUserId()
      return query(args)
    },
    async update({ model, args, query }) {
      if (hasField(model, updatedByField) && args.data)
        args.data[updatedByField] = getCurrentUserId()
      return query(args)
    },
    async upsert({ model, args, query }) {
      if (hasField(model, updatedByField) && args.update)
        args.update[updatedByField] = getCurrentUserId()
      if (hasField(model, updatedByField) && args.create)
        args.create[createdByField] = getCurrentUserId()
      return query(args)
    },
  },
}
