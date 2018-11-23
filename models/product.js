const fs = require('fs');
const path = require('path');

const p = path.join(
   path.dirname(process.mainModule.filename),
   'data',
   'products.json'
);

const getProductsFromFile = cb => {
   fs.readFile(p, (err, fileContent) => {
      if (err) {
         cb([]);
      }
      else {
         cb(JSON.parse(fileContent));
      }
   });
}

module.exports = class Product {
   constructor(t) {
      this.title = t;
   }

   save() {
      getProductsFromFile(products => {
         products.push(this);
         fs.writeFile(p, JSON.stringify(products), err => {
            console.log(err);
         });
      });
   }

   // static because so that I can't use as a new instantiated object (ex. new Product())
   static fetchAll(cb) {
      getProductsFromFile(cb);
   }
}