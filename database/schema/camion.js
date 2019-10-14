const mongoose=require('../connect');

const camion={
    id:String,
    placa:String,
    exceso:[{
      lat:String,
      lon:String,
      lugar:String,
      velocidad:String,
      fecha:String,
      hora:String
    }],
    horario:[{
      lat:String,
      lon:String,
      lugar:String,
      fecha:String,
      hora:String
    }]
};

const camionModel=mongoose.model('camion',camion);

module.exports=camionModel;
