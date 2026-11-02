import mongoose, { type Mongoose } from "mongoose";

declare global {
  var mongooseCache:
    | {
        connection: Mongoose | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;
}

// Keep the cache on globalThis so it survives development hot reloads.
const cached = (globalThis.mongooseCache ??= {
  connection: null,
  promise: null,
});

export default async function connectToDatabase(): Promise<Mongoose> {
  const uri = process.env.MONGODB_URL;

  if (!uri) {
    throw new Error("Missing required environment variable: MONGODB_URL");
  }

  if (cached.connection) {
    return cached.connection;
  }

  // Share an in-flight connection between concurrent requests.
  cached.promise ??= mongoose.connect(uri);

  try {
    cached.connection = await cached.promise;
    return cached.connection;
  } catch (error) {
    // Let later calls retry if the initial connection attempt fails.
    cached.promise = null;
    throw error;
  }
}
