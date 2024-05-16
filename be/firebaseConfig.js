const admin = require("firebase-admin");
const serviceAccount = require("./config/applemarket-firebase-adminsdk-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const usersCollection = db.collection('users');
const productsCollection = db.collection('products');
const cartsCollection = db.collection('carts');
const ordersCollection = db.collection('orders');

module.exports = {
    db,
    usersCollection,
    productsCollection,
    cartsCollection,
    ordersCollection
};