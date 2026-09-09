import { MongoClient, type Collection, type Document } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "amaya";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function isConfigured(): boolean {
  return !!uri && !uri.includes("dummy") && !uri.includes("<username>");
}

// The driver's own defaults (serverSelectionTimeoutMS: 30000) can outlast a
// Vercel serverless function's own execution limit, so a slow/unreachable
// DB hangs the request until the platform kills it with a 504 instead of
// failing fast. Keep these well under that limit.
const MONGO_OPTIONS = {
  connectTimeoutMS: 8000,
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 10000,
};

function getClientPromise(): Promise<MongoClient> {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri as string, MONGO_OPTIONS).connect().catch((err) => {
      global._mongoClientPromise = undefined;
      throw err;
    });
  }
  return global._mongoClientPromise;
}

/**
 * Returns the "leads" collection, or null when MONGODB_URI is unset or still
 * the dummy placeholder — callers should skip persistence in that case
 * rather than fail the request.
 */
export async function getLeadsCollection(): Promise<Collection<Document> | null> {
  if (!isConfigured()) return null;
  const client = await getClientPromise();
  return client.db(dbName).collection("leads");
}
