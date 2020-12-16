const mongoose = require("mongoose");

//creating database
mongoose.connect("mongodb+srv://cluster0.l0nr9.mongodb.net/user?retryWrites=true&w=majority", {
    dbName: 'Tickly',
    user: 'Vipul',
    pass: 'Vipul@123',
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('connection successful');
}).catch((error)=>{
    console.log(error);
});