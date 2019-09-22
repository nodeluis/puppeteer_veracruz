const mongoose=require('../connect');

const camion={
    id:String,
    placa:String,
    excesos:[{
      lat:String,
      lon:String,
      lugar:String,
      velocidad:String,
      fecha:Date
    }]
};

const camionModel=mongoose.model('camion',camion);

module.exports=camionModel;
