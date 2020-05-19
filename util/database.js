const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = async callback => {
  try {
    const client = await MongoClient.connect(
      'mongodb+srv://rubot88:1G7DLwC382G8LFc6@cluster0-dlv0j.mongodb.net/shop?retryWrites=true&w=majority',
      { useUnifiedTopology: true }
    );
    console.log('MongoDB is connected!');
    _db = client.db();
    callback();
  } catch (error) {
    console.log('Error: ', error);
    throw error;
  }
}

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw Error('No database found!');
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;