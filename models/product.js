const db = require('../util/database'); // Importing database in util folder
const Cart = require('./cart');

// NOTE: static function because so that I can't use as a new instantiated object (ex. new Product())

module.exports = class Product {
   constructor(id, title, imageUrl, description, price) {
      this.id = id;
      this.title = title;
      this.imageUrl = imageUrl;
      this.description = description;
      this.price = price;
   }

   save() {
      return db.execute(
         'INSERT INTO products(title, price, description, imageUrl) VALUES(?, ?, ?, ?)',
         [this.title, this.price, this.description, this.imageUrl]
      );
   }

   static deleteById(id) {
      
   }

   static fetchAll() {
      return db.execute('SELECT * FROM products');
   }

   static findById(id) {
      return db.execute(
         'SELECT * FROM products WHERE products.id = ?',
         [id]
      );
   }
}