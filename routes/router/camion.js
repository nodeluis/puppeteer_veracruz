const Camion=require('../../database/schema/camion');
const express=require('express');
const router=express.Router();
const puppeteer=require('puppeteer');
const empty=require('is-empty');

router.get('/',(req,res)=>{
    Camion.find({},(err,docs)=>{
      if(docs.length>0){
        res.json(docs);
      }else{
        res.json({
          message:'no existen camiones en la bd'
        });
      }
    });
});

router.get('/pocision',async(req,res)=>{
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    console.log("Entrando a 200.87.207.36");
    await page.goto('http://200.87.207.36');
    //await page.focus('#codigo_usu');
    await page.type("#codigo_usu", 'veracruz');
    //await page.focus('#clave_usu');
    await page.type("#clave_usu", 'ypfbveracruz');
    await page.click("button")
    //await page.press('Enter');
    await page.waitForNavigation();
    console.log("consultando servicio")
    await page.goto('http://200.87.207.36//getFlota.php');
    const data = await page.evaluate(() => {
    return {
        json: JSON.parse(document.documentElement.outerText)
      };
    });
    //console.log(data);
    let cons=[];
    for (var i = 0; i < data.json.length; i++) {
      //console.log(data.json[i]);
      let da=data.json[i];
      cons.push({
        id:da[0],
        placa:da[1],
        lugar:da[4],
        lat:da[7],
        lon:da[8]
      });
    }
    console.log("final");
    await browser.close();
    res.json(cons);
});

router.get('/exceso2/:id',(req,res)=>{
    let id=req.params.id;
    Camion.find({id:id},(err,doc)=>{
      if(!empty(doc)){
        //console.log(doc);
        res.json(doc);
      }else{
        res.json({});
      }
    });
});

router.get('/exceso/:id',async(req,res)=>{
  let id=req.params.id;
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  console.log("Entrando a 200.87.207.36");
  await page.goto('http://200.87.207.36');
  //await page.focus('#codigo_usu');
  await page.type("#codigo_usu", 'veracruz');
  //await page.focus('#clave_usu');
  await page.type("#clave_usu", 'ypfbveracruz');
  await page.click("button")
  //await page.press('Enter');
  await page.waitForNavigation();
  console.log("consultando servicio")
  await page.goto('http://200.87.207.36//googleMapsGenerarRecorrido.php?IdMov='+id+'&fechaDesde=2019-09-08%2000:01&fechaHasta=2019-09-10%2023:59');
  const data = await page.evaluate(() => {
  return {
      json: JSON.parse(document.documentElement.outerText)
    };
  });
  //4745
  let co=[];
  for (var i = 0; i < data.json.length; i++) {
    let da=data.json[i];
    //console.log(da['Velocidad']);
    if(da['Velocidad']>70){
      co.push(da);
    }
  }
  console.log("final");
  await browser.close();
  res.json(co);
});

module.exports=router;
