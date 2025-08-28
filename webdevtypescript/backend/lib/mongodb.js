import { MongoClient } from 'mongodb';

//Defining uri constant to use for MongoClient connection
const uri = process.env.MONGODB_URI;
//Empty object that is passed to MongoClient constructor normally to specify config beviour
const options = {};

//JSDoc Using type to tell editor client will be a MongoClient isntance

/** @type {import('mongodb').MongoClient} */
let client;

//JSDoc comment tells vscode what type of var it be. Variable will be a Promise, Promise resolves MongoClient instance
//Promise is generic type, Promise represents a value that isn't available yet but will be in the future.

/** @type {Promise<import('mongodb').MongoClient>} */
let clientPromise;

//Checking if URI is there
if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

//Starting by Checking if app running, Create new Client only if doesnt exists

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
