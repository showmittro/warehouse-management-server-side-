const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();


// middleware 
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xwxsr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const inventoryCollection = client.db('biycleInventory').collection('inventory')

        app.get('/inventory', async(req,res) =>{
            const query ={};
            const cursor = inventoryCollection.find(query);
            const inventorys = await cursor.toArray();

            res.send(inventorys);

        })

        app.get('/inventory/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const inventorys = await inventoryCollection.findOne(query);
            res.send(inventorys);
        });
         // POST
         app.post('/inventory', async(req, res) =>{
            const newService = req.body;
            const result = await inventoryCollection.insertOne(newService);
            res.send(result);
        });
         // Put
         app.put('/inventory/:serviceId', async(req, res) =>{
            const query={_id: ObjectId(req.params.serviceId)};
            const count = req.body.quantity 
            const options = { upsert: true }
            const updatedProduct = {
                $set: {
                    quantity: count
                }
            }
            const result = await inventoryCollection.updateOne(query,updatedProduct , options)
            res.send(result)
           
        });
        
        // DELETE
        app.delete('/inventory/:serviceId', async(req, res) =>{
            let id = req.params.serviceId;
            const query = {_id: ObjectId(id)};
            const result = await inventoryCollection.deleteOne(query);
            res.send(result);
        });

        

    }
    finally{}
}
run().catch(console.dir);




app.get('/',(req,res) =>{
    res.send('Bicyle is comming')


})

app.listen(port,() =>{
    console.log ('Bicyle is running on port',port)

})


