const mongoose=require('../connect');

const user={
    nombre:String,
    email:String,
    password:String
};

const modelUser=mongoose.model('user',user);

module.exports=modelUser;
