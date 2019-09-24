const mongoose=require('../connect');

const general={
    id:String,
    placa:String,
    lugar:String,
    lat:String,
    lon:String,
    control:Boolean
}

const generalmodel=mongoose.model('general',general);

module.exports=generalmodel;
