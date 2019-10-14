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
              /*if(doc.control){
                actualizarCamion(da[0],da[1],qu);
              }*/
              actualizarCamion(da[0],da[1],qu);
            }else{
              obj.control=false;
              let insert=new General(obj);
              let resul=await insert.save();
              console.log(resul);
            }
        });
        cons.push(obj);
      }
      General.find({},(err,doc)=>{
        socket.emit('actualizar_vista_general',doc);
      });
    },360000);

    async function actualizarCamion(id,pl,qu){
      //actualizar datos del camion
      console.log('actualizando datos de '+ pl+' en fecha '+qu);
      //await page.goto('http://200.87.207.36//googleMapsGenerarRecorrido.php?IdMov='+id+'&fechaDesde='+qu+'%2000:01&fechaHasta='+qu+'%2023:59');
      await page.goto('http://200.87.207.36//googleMapsGenerarRecorrido.php?IdMov='+id+'&fechaDesde=2019-10-12%2000:01&fechaHasta=2019-10-12%2023:59');
      const dataxcamion = await page.evaluate(() => {
      return {
          json: JSON.parse(document.documentElement.outerText)
        };
      });
      if(!empty(dataxcamion.json)){
        console.log('longitud de los valores rescatados');
        console.log(dataxcamion.json.length);
        Camion.find({id:id},(err,doc)=>{
          let t=false;
          let inf=[];
          let inf2=[];
          for (var k = 0; k < dataxcamion.json.length; k++) {
            let dat2=dataxcamion.json[k];
            let sep=dat2['Fecha'].split(' ');
            console.log(dat2['Fecha']);
            let hour=sep[1].split(':');
            if(dat2['Velocidad']>70){
              //cambio fecha y hora separados
              if(empty(doc)){
                inf.push({
                  lat:dat2['Latitud'],
                  lon:dat2['Longitud'],
                  lugar:dat2['Referencia'],
                  velocidad:dat2['Velocidad'],
                  fecha:sep[0],
                  hora:sep[1]
                });
              }else{
                if(!empty(doc.excesos)){
                  let verif=true;
                  for (let z = 0; z < doc.excesos.length; z++) {
                    let dat8=doc.excesos[z];
                    if(dat8.fecha==sep[0]&&dat8.hora==sep[1]&&dat8.lat==(dat2['Latitud']+'')&&dat8.lon==(dat2['Longitud']+'')){
                      verif=false;
                      break;
                    }
                  }
                  if(verif){
                    t=true;
                    doc.excesos.push({
                      lat:dat2['Latitud'],
                      lon:dat2['Longitud'],
                      lugar:dat2['Referencia'],
                      velocidad:dat2['Velocidad'],
                      fecha:sep[0],
                      hora:sep[1]
                    });
                  }
                }else{
                  t=true;
                  let ot=[];
                  ot.push({
                    lat:dat2['Latitud'],
                    lon:dat2['Longitud'],
                    lugar:dat2['Referencia'],
                    velocidad:dat2['Velocidad'],
                    fecha:sep[0],
                    hora:sep[1]
                  });
                  doc.excesos=ot;
                }
              }
            }
            if(parseInt(hour[0])>=0||parseInt(hour[0])<7){
              if(empty(doc)){
                inf2.push({
                  lat:dat2['Latitud'],
                  lon:dat2['Longitud'],
                  lugar:dat2['Referencia'],
                  fecha:sep[0],
                  hora:sep[1]
                });
              }else{
                if(!empty(doc.horario)){
                  let verif=true;
                  for (let z = 0; z < doc.horario.length; z++) {
                    let dat8=doc.horario[z];
                    if(dat8.fecha==sep[0]&&dat8.hora==sep[1]&&dat8.lat==(dat2['Latitud']+'')&&dat8.lon==(dat2['Longitud']+'')){
                      verif=false;
                      break;
                    }
                  }
                  if(verif){
                    t=true;
                    doc.horario.push({
                      lat:dat2['Latitud'],
                      lon:dat2['Longitud'],
                      lugar:dat2['Referencia'],
                      fecha:sep[0],
                      hora:sep[1]
                    });
                  }
                }else{
                  t=true;
                  let ot=[];
                  ot.push({
                    lat:dat2['Latitud'],
                    lon:dat2['Longitud'],
                    lugar:dat2['Referencia'],
                    fecha:sep[0],
                    hora:sep[1]
                  });
                  doc.horario=ot;
                }
              }
            }
          }
          if(empty(doc)){
            let ins=new Camion({
              id:id,
              placa:pl,
              excesos:inf,
              horario:inf2
            });
            ins.save().then(()=>{
              console.log('nuevo camion insertado');
            }).catch(()=>{
              console.log('error de la coleccion camion');
            });
          }else{
            if(t){
              Camion.findByIdAndUpdate(doc._id,doc,()=>{
                console.log('hubo una nueva infraccion');
              });
            }
          }
        });
      }
    }
    socket.on('disconnect',async()=>{
      console.log('socket desconectado');
      await browser.close();
    });
}
