const General=require('../../database/schema/general');
const Camion=require('../../database/schema/camion');
const puppeteer=require('puppeteer');
const empty=require('is-empty');

module.exports=async(socket)=>{
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
    console.log('esperando la navegacion');
    setInterval(async()=>{
      console.log("consultando servicio")
      await page.goto('http://200.87.207.36//getFlota.php');
      const data = await page.evaluate(() => {
      return {
          json: JSON.parse(document.documentElement.outerText)
        };
      });
      let f=new Date();
      let qu=f.getFullYear()+'-'+((f.getMonth()<9)?'0'+(f.getMonth()+1):(f.getMonth()+1))+'-'+((f.getDate()<10)?'0'+f.getDate():f.getDate());
      console.log('esta es la fecha '+qu);
      //console.log('actualizando datos de cada camion');
      let cons=[];
      for (var i = 0; i < data.json.length; i++) {
        //console.log(data.json[i]);
        let da=data.json[i];
        let obj={
          id:da[0],
          placa:da[1],
          lugar:da[4],
          lat:da[7],
          lon:da[8]
        };
        General.findOne({id:da[0]},async(err,doc)=>{
            if(!empty(doc)){
              let idG=doc['_id'];
              General.findByIdAndUpdate(idG,obj,()=>{
                console.log('actualizado');
              });
            }else{
              let insert=new General(obj);
              let resul=await insert.save();
              console.log(resul);
            }
        });

        //actualizar datos del camion
        console.log('actualizando datos de '+ da[1]+' en fecha '+qu);
        await page.goto('http://200.87.207.36//googleMapsGenerarRecorrido.php?IdMov='+da[0]+'&fechaDesde='+qu+'%2000:01&fechaHasta='+qu+'%2023:59');
        //await page.goto('http://200.87.207.36//googleMapsGenerarRecorrido.php?IdMov='+da[0]+'&fechaDesde=2019-09-08%2000:01&fechaHasta=2019-09-09%2023:59');
        const dataxcamion = await page.evaluate(() => {
        return {
            json: JSON.parse(document.documentElement.outerText)
          };
        });
        if(!empty(dataxcamion.json)){
          console.log('longitud de los valores rescatados');
          console.log(dataxcamion.json.length);
          let inf=[];
          let placact='';
          for(let k=0;k<dataxcamion.json.length;k++){
            let dat2=dataxcamion.json[k];
            if(dat2['Velocidad']>70){
              placact=dat2['Descripcion'];
              inf.push({
                lat:dat2['Latitud'],
                lon:dat2['Longitud'],
                lugar:dat2['Referencia'],
                velocidad:dat2['Velocidad'],
                fecha:new Date(dat2['Fecha'])
              });
            }
          }
          console.log('buscando placa en la bd '+placact+' para actualizar');
          Camion.findOne({placa:placact},(err,doc)=>{
            if(!empty(doc)){
              let t=0;
              for(let j=0;j<inf.length;j++){
                let verify=true;
                let dat3=inf[j];
                //let verify=doc.excesos.find(fe=>fe.fecha==datever);
                doc.excesos.forEach(fe=>{
                  if(fe.fecha==dat3['fecha']){
                    verify=false;
                  }
                });
                if(verify){
                  doc.excesos.push(dat3);
                  t++;
                }
              }
              if(t>0){
                Camion.findByIdAndUpdate(doc._id,doc,()=>{
                  console.log('hubo un nuevo exceso');
                });
              }
            }else{
              let ins=new Camion({
                id:da[0],
                placa:placact,
                excesos:inf
              });
              ins.save().then(()=>{
                console.log('insertado nuevo camion');
              }).catch(()=>{
                console.log('error');
              });
            }
          });
        }
        cons.push(obj);
      }
      socket.emit('actualizar_vista_general',cons);
    },480000);

    socket.on('disconnect',async()=>{
      console.log('socket desconectado');
      await browser.close();
    });
}
