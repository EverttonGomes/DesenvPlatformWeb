//Configurando a conexão com o MongoDB
const {MongoClient, ObjectId} = require("mongodb");
async function connect(){
    if(global.db) return global.db;
    const conn = await MongoClient.connect("mongodb+srv://Everton:qwe123@cluster0.ugvmlct.mongodb.net/?retryWrites=true&w=majority")
    if(!conn) return new Error("Erro na conexão");
    global.db  = await conn.db("unifor");
    return global.db;
}

// Configuração do Express JS
const express = require('express');
const app     = express();
const port    = 3000; // porta padrão

// Serialização do JSON
app.use(require('cors')());
app.use(express.urlencoded({extended: true}));
app.use(express.json());


// Definindo rota de teste
const router  = express.Router();
router.get('/', (req, res) => res.json({message: 'Rota de teste OK!'}));

//API REST cliente

// GET
router.get('/cliente/:id?', async function(req, res, next){
    try{
        const db  = await connect();
        if(req.params.id){
         res.json(await db.collection("cliente").findOne({_id: new ObjectId(req.params.id)}));
        }else{
         res.json(await db.collection("cliente").find().toArray());
        }
    }
    catch(ex){
        console.log(ex)
        res.status(400).json({erro: `${ex}`});
    }
});

// POST
router.post('/cliente', async function(req, res, next){
    try{
        const cliente = req.body;
        const db  = await connect();
        res.json(await db.collection("cliente").insertOne(cliente))
    }catch(ex){
        console.log(ex)
        res.status(400).json({erro: `${ex}`});
    }

});

// PUT
router.put('/cliente/:id', async function(req, res, next){
    try{
      const cliente = req.body;
      const db = await connect();
      res.json(await db.collection("cliente").updateOne({_id: new ObjectId(req.params.id)}, {$set: cliente}));
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
});

// DELETE
router.delete('/cliente/:id', async function(req, res, next){
    try{
      const db = await connect();
      res.json(await db.collection("cliente").deleteOne({_id: new ObjectId(req.params.id)}));
    }catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
});

app.use('/', router);

//Inicia o servidor
app.listen(port);
console.log('API funcionando!');