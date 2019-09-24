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

router.patch('/control/:id',(req,res)=>{
    let id=req.params.id;
    General.findOne({_id:id},(err,doc)=>{
      if(!empty(doc)){
        doc.control=true;
        General.findByIdAndUpdate(id,doc,()=>{
          res.json({message:'camion ahora esta siendo monitoreado'});
        });
      }else{
        res.json({message:'error no existe camion'});
      }
    });
});

module.exports=router;
