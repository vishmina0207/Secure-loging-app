
const mongoose = require("mongoose");
const dbConnection= mongoose.connect("mongodb+srv://uvinduvishmina0207:RH50YRLLY50u@clusternibm.gxfty.mongodb.net/?retryWrites=true&w=majority&appName=Clusternibm")
    .then(()=>console.log("mongoDB connected"))
    .catch((e)=>console.log(e));


module.exports=dbConnection;
