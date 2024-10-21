const { MongoClient } = require("mongodb");
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

async function connect() {
  try {
    client.db("instagram-gc01-ridho");
  } catch (error) {
    console.log(error, "error mongo");
    await client.close();
  }
}

async function getDB() {
  return client.db("instagram-gc01-ridho");
}

module.exports = { connect, getDB };
