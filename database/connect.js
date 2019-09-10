const mongoose=require('mongoose');

mongoose.connect('mongodb://192.168.16.2:27017/veracruz');

module.exports=mongoose;
