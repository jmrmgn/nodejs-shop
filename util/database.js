const MongoClient = require('mongodb').MongoClient;

let _db;

const mongoConnect = (callback) => {
   MongoClient.connect(
      'mongodb+srv://jomar26:lzf9VJo5jpzU6c8G@cluster0-jfpaj.mongodb.net/shop?retryWrites=true'
   )
      .then(client => {
         console.log('Connected');
         _db = client.db();
         callback();
      })
      .catch(err => {
         console.log(err)
         throw err;
      });
}

const getDb = () => {
   if (_db) {
      return _db;
   }
   throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;