import "dotenv/config.js";
import mongoose from "mongoose";
import { Category, Product } from "./src/model/index.js";
import { categories, products } from "./seedData.js";

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Category.deleteMany({});

    const categoryDocs = await Category.insertMany(categories);
    const categoryMap = categoryDocs.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});
      
    const porducWithCategoryIds = products.map((product) => ({
      ...product,
      category: categoryMap[product.category],
    }));
      
    await Product.insertMany(porducWithCategoryIds);
      
    console.log("Database Seeded Successfully");
      
  } catch (error) {
    console.error("Error Seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
}
seedDatabase();


// {
//   "name": "food-delivery-server",
//   "version": "1.0.0",
//   "main": "index.js",
//   "type": "module",
//   "scripts": {
//     "start": "nodemon app.js",
//     "test": "echo \"Error: no test specified\" && exit 1"
//   },
//   "keywords": [],
//   "author": "",
//   "license": "ISC",
//   "description": "",
//   "dependencies": {
//     "@adminjs/fastify": "^3.0.1",
//     "@adminjs/mongoose": "^4.1.0",
//     "@adminjs/themes": "^1.0.1",
//     "@fastify/cookie": "^6.0.0",
//     "@fastify/session": "^11.1.0",
//     "adminjs": "^7.8.15",
//     "connect-mongodb-session": "^5.0.0",
//     "dotenv": "^16.4.7",
//     "fastify": "^4.29.0",
//     "fastify-socket.io": "^5.1.0",
//     "jsonwebtoken": "^9.0.2",
//     "mongoose": "^8.12.1",
//     "nodemon": "^3.1.9"
//   }
// }

