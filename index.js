/*jshint esversion:6*/
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config=require('./config');
const hbs =require('express-handlebars');
const Product = require('./models/product');

const app=express();

// $ npm i -S method-override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//configuracion body 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//Motor d evistas Handlebars
//Motor de vistas extension hbs es la que reconocera como motor de vistas 
app.engine('.hbs',hbs({
    defaultLayout:'index',
    extname:'hbs'
}));
app.set('view engine','.hbs');
//Declaracion de carpeta estatica
app.use('/static',express.static('public'));

//Insercion de datos a la bd
app.get('/product', (req, res) => {
    res.render('product');
});

app.post('/api/product', (req,res)=>{
    let product = new Product();
    product.name = req.body.name;
    product.image = req.body.image;
    product.price = req.body.price;
    product.category = req.body.category;
    product.description = req.body.description;

    product.save( (err,productStored) =>{
        if (err) res.status(500).send({message:`Error al salvar en BD ${err}`});
        res.status(200).send({resultado:productStored});

    });
});

app.get('/',(req,res)=>{
    res.render('home');
});

//Consulta de productos
app.get('/products', (req, res) => {
    res.render('products');
});

app.get('/api/products',(req,res)=>{
    Product.find({},(err,products)=>{
        if(err) return res.status(500).send({message:`Error al realizar la peticion ${err}`});
        if(!products) return res.status(404).send({message:`No existen productos`});
        console.log("Este es el GET de api/products  LISTA DE PRODUCTOS");
        console.log(products);
        res.render('products',{products});
    }).lean();
});

//Esta direccion se ejecuta cuando presionamos el boton editar 
app.get('/api/product/:productId',(req,res)=>{
    let productId = req.params.productId;
    console.log(req.body);
    console.log("Este es el GET de api/products/ID  LISTA DE PRODUCTO A editar");
    Product.findById(productId,(err,products) =>{
      // Product.find({price:productId},(err,todook)=>{
        if(err) return res.status(500).send({message:`Error al realizar la peticion${err}`});
        if(!products) return res.status(404).send({message:`El producto no existe`});
        //res.status(200).send({product:todook})
        res.render('editar',{products});
        //Sino encuentra un error rgresa el registroo del producto con el que eligio

    }).lean();
});


app.put('/api/product/:productId',(req,res)=>{
   
    let productId = req.params.productId
    console.log(`EL product es: ${productId}`);
    
    let update = req.body;
    console.log(update);
    
   // Product.findAndModify({_id:productId}, update,(err,products)=> {
       Product.findOneAndUpdate({_id:productId}, update,(err,products)=> {
        if (err) res.status(500).send({message:`Error al actualizar el producto el producto ${err}`})
        //res.status(200).send({product: products})
       res.redirect('/api/products');
       
    }).lean();
});

app.delete('/api/product/:productId',(req,res)=>{
    let productId = req.params.productId

    Product.findById(productId,(err,product)=>{
     if (err) res.status(500).send({message:`Error al borrar el producto ${err}`});

        product.remove(err => {
            if (err) res.status(500).send({message:`Error al borrar el producto ${err}`});
            res.status(200).send({message:'El producto ha sido eliminado'});
        });
        res.redirect('/api/products');
    }).lean();
}); 
//Conexion a BD y levantar servidor
//manda llamar al archivo config .js a la seccion db
mongoose.connect( config.db, config.urlParser, ( err,res ) =>{

    if(err){
        return console.log(`Error al conectar la BD ${err}`);
    }
    console.log('Conexion a la BD exitosa');

    app.listen(config.port,config.host,()=>{
        console.log(`API-REST  yeiii ejecutando en http://${config.host}:${config.port}`)

    });
});

