const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ykjz5lg.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Middleware
app.use(cors());
app.use(express.json());
// app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // brand
    const brandCollection = client.db("brandDB").collection("brand");
    app.get("/brand", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // products
    const productsCollection = client.db("productsDB").collection("products");
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.Collection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // product
    const productCollection = client.db("productDB").collection("product");

    app.get("/product/:brandName", async (req, res) => {
      const query = { brand: req.params.brandName };
      const cursor = productCollection.find({ query });
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/product", async (req, res) => {
      const newProducts = req.body;
      console.log(newProducts);
      const result = await productCollection.insertOne(newProducts);
      res.send(result);
    });
    // cart
    const cartCollection = client.db("cartDB").collection("cart");
    app.post("/cart", async (req, res) => {
      const newCarts = req.body;
      console.log(newCarts);
      const result = await cartCollection.insertOne(newCarts);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

app.get("/", (req, res) => {
  res.send("process is running!!");
});

app.listen(port, () => {
  console.log(`process is running on port ${port}`);
});
