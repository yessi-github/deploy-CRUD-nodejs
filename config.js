module.exports={
    host:'localhost'|| '0.0.0.0',
    port:process.env.PORT|| 3000,
    //conexion local
    //db: process.env.MONGODB || 'mongodb://localhost:27017/mytest2',
    //conexion en la nube
    db: process.env.MONGODB || 'mongodb+srv://admin:yessica.1997@cluster0.obwzv.mongodb.net/bd1?retryWrites=true&w=majority',
    urlParser : {

        useNewUrlParser: true,
        useCreateIndex: true ,
        useUnifiedTopology: true,
        useFindAndModify: false ,
    }
};