import { MongoClient, type Db } from 'mongodb'

const globalForMongo = globalThis as unknown as { _mongoClient?: Promise<MongoClient> }

/** Cached client shared across serverless invocations. Returns null when MONGODB_URI is not set. */
export async function getDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI
  if (!uri) return null
  globalForMongo._mongoClient ??= new MongoClient(uri).connect().catch((e) => {
    globalForMongo._mongoClient = undefined
    throw e
  })
  return (await globalForMongo._mongoClient).db()
}
