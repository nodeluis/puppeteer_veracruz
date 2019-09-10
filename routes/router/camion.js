const Camion=require('../../database/schema/camion');
const express=require('express');
const router=express.Router();
const puppeteer=require('puppeteer');

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
    for (var i = 0; i < data.json.length; i++) {
      console.log(data.json[i]);
      let da=data.json[i];
      for (var j = 0; j < da.length; j++) {
        console.log(da[j]);
      }
      console.log('-----------------------------------------------------');
    }
    console.log("final");
    await browser.close();
    res.json(data);
});

module.exports=router;
