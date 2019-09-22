const General=require('../../database/schema/general');
const express=require('express');
const router=express.Router();
const empty=require('is-empty');

router.get('/',(req,res)=>{
    General.find({},(err,docs)=>{
      if(!empty(docs)){
        res.json(docs);
      }else{
        res.json({
          message:'no existen datos en la bd'
        });
      }
    });
});

module.exports=router;
