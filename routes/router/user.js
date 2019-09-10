const User=require('../../database/schema/user');
const express=require('express');
const sha1=require('sha1');
const empty=require('is-empty');
const jwt=require('jsonwebtoken');
const router=express.Router();

router.get('/',(req,res)=>{
    User.find().exec((err,docs)=>{
      if(docs.length>0){
        res.status(200).json(docs);
      }else{
        res.status(200).json({
          message:'no existe users en la bd'
        });
      }
    });
});

router.post('/',async(req,res)=>{
    const datos={
      nombre:req.body.nombre,
      email:req.body.email,
      password:sha1(req.body.password)
    };
    const insert=new User(datos);
    const result=await insert.save();
    res.status(200).json({
      message:'usuario insertado en la bd'
    });
});

router.post('/login',(req,res)=>{
  User.findOne({
    email:req.body.email
  },(err,doc)=>{
    if(empty(doc)){
      res.json({
        message:'el email es incorrecto'
      });
    }else{
      if((sha1(req.body['password']))==doc['password']){
          const token=jwt.sign({
            email:doc.email,
            id:doc._id
          },process.env.JWT_KEY||'miClave',{
            expiresIn:'1h'
          });
          res.json({
            message:'auth succes',
            token:token
          });
      }else{
        res.json({
          message:'password incorrecto'
        });
      }
    }
  });
});

router.patch('/:id',(req,res)=>{
    let id=req.params.id;
    let datos=req.body;
    if(datos['password']!=null)
      datos['password']=sha1(datos['password']);
    User.findByIdAndUpdate({_id:id},datos,(err,docs)=>{
      res.status(200).json({
        message:'user actualizado'
      });
    });
});

router.delete('/:id',(req,res)=>{
    let id=req.params.id;
    User.findByIdAndRemove({_id:id},(err,docs)=>{
      res.status(200).json({
        message:'eliminado'
      });
    });
});


module.exports=router;
