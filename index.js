const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()
console.log(process.env.DB_USER);
const port = process.env.PORT || 5055;


const app = express()
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World! Crispy Snacks')
})

//Connecting to database

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sr6rc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection Error', err);
  const snacksCollection = client.db("crispySnacks").collection("snacks");
  const ordersCollection = client.db("crispySnacks").collection("orders");
  console.log("database connected successfully");


//Inserting data into database 
app.post('/addProducts',(req,res)=>{
    const newEvent = req.body;
    console.log('adding new event', newEvent);
    snacksCollection.insertOne(newEvent)
    .then(result =>{
        console.log("Inserted result count",result.insertedCount)
        res.send(result.insertedCount > 0)
    })
})

//Getting Data
app.get('/snacks',(req,res)=>{
    snacksCollection.find()
    .toArray((err,documents)=>{
        res.send(documents);
    })
})

//Get Single Data
app.get('/snacks/:id',(req,res)=> {
    const id = ObjectID(req.params.id);
  snacksCollection.find({_id: id})
  .toArray((err,documents)=>{
      res.send(documents[0]);
  })
})

//Insert data into db for orders
app.post('/addOrders',(req,res)=>{
  const newOrder = req.body;
  console.log('adding new event', newOrder);
  ordersCollection.insertOne(newOrder)
  .then(result =>{
      console.log("Inserted result count",result.insertedCount)
      res.send(result.insertedCount > 0)
  })
})

//Getting orders from db
app.get('/orders',(req,res)=>{
  //  console.log(req.headers.authorization);
  console.log(req.query.email);
   ordersCollection.find({email: req.query.email})
   .toArray((err, documents)=>{
       res.send(documents)
   })
})

//Delete
app.delete('/delete/:id',(req,res)=>{
  const id = ObjectID(req.params.id);
  console.log('delete this', id);
  snacksCollection.findOneAndDelete({_id: id})
  .then(documents => res.send(!!documents.value))

})

});




app.listen(port);