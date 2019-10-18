var exinplusign=0;
var id='';
var placa='';
var daterangenvio="";
$(document).ready(function () {
  inicializar();
  limpiar();
  $.get('/general',null,function(response){
      $("#map").googleMap({
        zoom: 8, // Initial zoom level (optional)
        coords: [-19.578297, -65.758633], // Map center (optional)
        type: "ROADMAP" // Map type (optional)
      });

      for(var i=0;i<response.length;i++){
        let dato=response[i];
        //ids.push(dato['_id']);
        $('<li id="'+i+'tree">'
                  +'<a href="#"><i id="'+i+'f1"></i><span>'+dato['placa']+'</span>'
                  +'<span id="'+i+'spa">'
                  +'<i id="'+i+'f2"></i>'
                  +'</span>'
                  +'</a>'
                  +'<ul id="'+i+'tremen">'
                  +'<li><a href="#" id="'+i+'hor"><i class="fa fa-circle-o"></i>Horarios de conducción</a></li>'
                  +'<li><a href="#"><i class="fa fa-circle-o"></i>Kilometros recorridos</a></li>'
                  +'<li><a href="#"><i class="fa fa-circle-o"></i>Desvios</a></li>'
                  +'<li><a href="#"><i class="fa fa-circle-o"></i>Alcoholemia</a></li>'
                  +'<li><a href="#"><i class="fa fa-circle-o"></i>Botiquín</a></li>'
                  +'<li><a href="#" id="'+i+'ext"><i class="fa fa-circle-o"></i>Extintores</a></li>'
                  +'<li><a href="#" id="'+i+'exc"><i class="fa fa-circle-o"></i>excesos de velocidad</a></li>'
                  +'<li><a href="#" id="'+i+'cont"><i class="fa fa-circle-o"></i>Controlar estado del camion</a></li>'
                  +'</ul>'
                  +'</li>').appendTo('#incamion');
        $('#'+i+'tree').addClass('treeview');
        $('#'+i+'f1').addClass('fa fa-bus');
        $('#'+i+'spa').addClass('pull-right-container');
        $('#'+i+'f2').addClass('fa fa-angle-left pull-right');
        $('#'+i+'tremen').addClass('treeview-menu');
        //insertando punto en el mapa
        if(dato['control']){
          $("#map").addMarker({
            coords: [parseFloat(dato['lat']),parseFloat(dato['lon'])], // GPS coords
            //coords: [dato['lat'],dato['lon']],
            //url: 'http://www.tiloweb.com', // Link to redirect onclick (optional)
            //id: 'marker1', // Unique ID for your marker
            title:dato['lugar'],
            icon:'/fonts/icons/camion4.png',
            text:'<b>Lorem ipsum</b> dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
          });
        }
        //poner a la escucha y hacer operaciones
        //4232-ICI
        $('#'+i+'exc').on('click', function(e){
          e.preventDefault();
          id=dato['id'];
          placa=dato['placa']
          $("#map").googleMap({
            zoom: 8, // Initial zoom level (optional)
            coords: [-19.578297, -65.758633], // Map center (optional)
            type: "ROADMAP" // Map type (optional)
          });
          limpiar();
          let postdata={
            id:dato['id'],
            i:exinplusign
          };
          $.post('/camion/exceso2',postdata,function(resp,status){
            $('#excesosDiv').show();
            $('#dateRange').show();
            console.log(resp);
            resp.forEach(function(dat){
              $('<tr>'
                +'<td>'+dato['placa']+'</td>'
                +'<td>'+dat['lugar']+'</td>'
                +'<td>'+dat['velocidad']+'</td>'
                +'<td>'+dat['fecha']+'</td>'
                +'<td>'+dat['hora']+'</td>'
                +'</tr>').appendTo('#contenidoExc');
              //añadiendo puntos de exceso
              $("#map").addMarker({
                //coords: [parseFloat(dat['lat']),parseFloat(dat['lon'])], // GPS coords
                coords: [parseFloat(dat['lat']),parseFloat(dat['lon'])],
                  //url: 'http://www.tiloweb.com', // Link to redirect onclick (optional)
                title:dat['fecha'],
                icon:'/fonts/icons/alert.png',
                text:'<b>EVENTO</b> exceso de velocidad por el camion '+dato['id']+'a una altitud de '
              });
            });//aqui hay cambios
          },'json').fail(function(err){
            console.log(err);
          });
        });
        // horarios de conduccion
        $('#'+i+'hor').on('click', function(e){
          e.preventDefault();
          id=dato['id'];
          placa=dato['placa']
          $("#map").googleMap({
            zoom: 8, // Initial zoom level (optional)
            coords: [-19.578297, -65.758633], // Map center (optional)
            type: "ROADMAP" // Map type (optional)
          });
          limpiar();
          let postdata={
            id:dato['id'],
            i:exinplusign
          };
          $.post('/camion/horario',postdata,function(resp,status){
            $('#horarioDiv').show();
            $('#dateRangeH').show();
            console.log(resp);
            resp.forEach(function(dat){
              $('<tr>'
                +'<td>'+dato['placa']+'</td>'
                +'<td>'+dat['lugar']+'</td>'
                +'<td>'+dat['fecha']+'</td>'
                +'<td>'+dat['hora']+'</td>'
                +'</tr>').appendTo('#contenidoHor');
              //añadiendo puntos de exceso
              $("#map").addMarker({
                //coords: [parseFloat(dat['lat']),parseFloat(dat['lon'])], // GPS coords
                coords: [parseFloat(dat['lat']),parseFloat(dat['lon'])],
                  //url: 'http://www.tiloweb.com', // Link to redirect onclick (optional)
                title:dat['fecha'],
                icon:'/fonts/icons/alert.png',
                text:'<b>EVENTO</b> exceso de velocidad por el camion '+dato['id']+'a una altitud de '
              });
            });//aqui hay cambios
          },'json').fail(function(err){
            console.log(err);
          });
        });
        // horarios de conduccion final
        // extintores

        $('#'+i+'ext').on('click', function(e){
          e.preventDefault();
          id=dato['id'];
          placa=dato['placa'];
          limpiar();
          $('#map').hide();
          $('#formExtint').show();
          let postdata={
            id:dato['id'],
            i:exinplusign
          };
          $.post('/camion/dataextintor',postdata,function(resp,status){
            $('#tablaExt').show();
            console.log(resp);
            resp.forEach(function(dat){
              $('<tr>'
                +'<td>'+dat['lugar']+'</td>'
                +'<td>'+dat['observacion']+'</td>'
                +'<td>'+dat['fecha']+'</td>'
                +'<td>'+dat['check']+'</td>'
                +'<td>'+dat['aplica']+'</td>'
                +'</tr>').appendTo('#bodyExt');
            });//aqui hay cambios
          },'json').fail(function(err){
            console.log(err);
          });
        });
        // extintores final

      }

  });

  //botones de excesos de Velocidad
  $('#enviarDateRange').on('click',function(e){
    e.preventDefault();
    limpiar();
    $('#masDatos').addClass('disabled');
    var x=$('#reservation').val();
    var x2=x.split(' - ');
    let postdata={
      id:id,
      fi:x2[0],
      ff:x2[1]
    };
    $.post('/camion/fechaE', postdata, function(response,status) {
      $('#excesosDiv').show();
      $('#dateRange').show();
      try{
        response.forEach(function(dat){
          $('<tr>'
            +'<td>'+placa+'</td>'
            +'<td>'+dat['lugar']+'</td>'
            +'<td>'+dat['velocidad']+'</td>'
            +'<td>'+dat['fecha']+'</td>'
            +'<td>'+dat['hora']+'</td>'
            +'</tr>').appendTo('#contenidoExc');
          //añadiendo puntos de exceso
          $("#map").addMarker({
            //coords: [parseFloat(dat['lat']),parseFloat(dat['lon'])], // GPS coords
            coords: [parseFloat(dat['lat']),parseFloat(dat['lon'])],
              //url: 'http://www.tiloweb.com', // Link to redirect onclick (optional)
            title:dat['fecha'],
            icon:'/fonts/icons/alert.png',
            text:'<b>EVENTO</b> exceso de velocidad por el camion '+placa+'a una altitud de '
          });
        });//aqui hay cambios
      }catch(error){
        console.log(response);
      }

    },'json').fail(function(err){
      console.log(err);
    });
  });

  $('#masDatos').on('click',function(e){
    e.preventDefault();
    exinplusign++;
    let postdata={
      id:id,
      i:exinplusign
    };
    $.post('/camion/exceso2',postdata,function(resp,status){
      console.log(resp);
      resp.forEach(function(dat){
        $('<tr>'
          +'<td>'+placa+'</td>'
          +'<td>'+dat['lugar']+'</td>'
          +'<td>'+dat['velocidad']+'</td>'
          +'<td>'+dat['fecha']+'</td>'
          +'<td>'+dat['hora']+'</td>'
          +'</tr>').appendTo('#contenidoExc');
        //añadiendo puntos de exceso
        $("#map").addMarker({
          //coords: [parseFloat(dat['lat']),parseFloat(dat['lon'])], // GPS coords
          coords: [parseFloat(dat['lat']),parseFloat(dat['lon'])],
            //url: 'http://www.tiloweb.com', // Link to redirect onclick (optional)
          title:dat['fecha'],
          icon:'/fonts/icons/alert.png',
          text:'<b>EVENTO</b> exceso de velocidad por el camion '+placa+'a una altitud de '
        });
      });//aqui hay cambios
    },'json').fail(function(err){
      console.log(err);
    });
  });
  //botones exceso de velocidad fin

  //botones horarios

  $('#enviarDateRangeH').on('click',function(e){
    e.preventDefault();
    limpiar();
    $('#masDatosH').addClass('disabled');
    var x=$('#reservationH').val();
    var x2=x.split(' - ');
    let postdata={
      id:id,
      fi:x2[0],
      ff:x2[1]
    };
    $.post('/camion/fechaH', postdata, function(response,status) {
      $('#horarioDiv').show();
      $('#dateRangeH').show();
      try{
        response.forEach(function(dat){
          $('<tr>'
            +'<td>'+placa+'</td>'
            +'<td>'+dat['lugar']+'</td>'
            +'<td>'+dat['fecha']+'</td>'
            +'<td>'+dat['hora']+'</td>'
            +'</tr>').appendTo('#contenidoHor');
          //añadiendo puntos de exceso
          $("#map").addMarker({
            //coords: [parseFloat(dat['lat']),parseFloat(dat['lon'])], // GPS coords
            coords: [parseFloat(dat['lat']),parseFloat(dat['lon'])],
              //url: 'http://www.tiloweb.com', // Link to redirect onclick (optional)
            title:dat['fecha'],
            icon:'/fonts/icons/alert.png',
            text:'<b>EVENTO</b> exceso de velocidad por el camion '+placa+'a una altitud de '
          });
        });//aqui hay cambios
      }catch(error){
        console.log(response);
      }

    },'json').fail(function(err){
      console.log(err);
    });
  });

  $('#masDatosH').on('click',function(e){
    e.preventDefault();
    exinplusign++;
    let postdata={
      id:id,
      i:exinplusign
    };
    $.post('/camion/horario',postdata,function(resp,status){
      console.log(resp);
      resp.forEach(function(dat){
        $('<tr>'
          +'<td>'+placa+'</td>'
          +'<td>'+dat['lugar']+'</td>'
          +'<td>'+dat['fecha']+'</td>'
          +'<td>'+dat['hora']+'</td>'
          +'</tr>').appendTo('#contenidoHor');
        //añadiendo puntos de exceso
        $("#map").addMarker({
          //coords: [parseFloat(dat['lat']),parseFloat(dat['lon'])], // GPS coords
          coords: [parseFloat(dat['lat']),parseFloat(dat['lon'])],
            //url: 'http://www.tiloweb.com', // Link to redirect onclick (optional)
          title:dat['fecha'],
          icon:'/fonts/icons/alert.png',
          text:'<b>EVENTO</b> exceso de velocidad por el camion '+placa+'a una altitud de '
        });
      });//aqui hay cambios
    },'json').fail(function(err){
      console.log(err);
    });
  });
  //botones horarios final

  ////botones extintores
  $('#formExtint').submit(function(e) {
    e.preventDefault();
    var erm=[];
    for (var ii = 1; ii <=4; ii++) {
      erm.push($('#ext'+ii).val());
    }
    for (var ii = 1; ii <= 12; ii++) {
      erm.push($('input:radio[name=r'+ii+']:checked','#formExtint').val());
    }
    $.post('/camion/extintor',{data:erm+'',id:id},function(resp,status){
      console.log(resp);

    },'json').fail(function(err){
      console.log(err);
    });
    $(this).trigger("reset");
  });

  ////botones extintores final
});

function limpiar(){
  exinplusign=0;
  $("#map").show();
  $('#tablaExt').hide();
  $('#formExtint').hide();
  $('#dateRange').hide();
  $('#dateRangeH').hide();
  $('#excesosDiv').hide();
  $('#horarioDiv').hide();
  $('#masDatos').removeClass('disabled');
  $('#masDatosH').removeClass('disabled');
  $('#contenidoExc').empty();
  $('#contenidoHor').empty();
  $('#bodyExt').empty();
}
function inicializar(){
  //Date picker
  $('#ext3').datepicker({
    autoclose: true
  });
  //iCheck for checkbox and radio inputs
  $('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
    checkboxClass: 'icheckbox_minimal-blue',
    radioClass   : 'iradio_minimal-blue'
  });
  //Red color scheme for iCheck
  $('input[type="checkbox"].minimal-red, input[type="radio"].minimal-red').iCheck({
    checkboxClass: 'icheckbox_minimal-red',
    radioClass   : 'iradio_minimal-red'
  });
  //Flat red color scheme for iCheck
  $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
    checkboxClass: 'icheckbox_flat-green',
    radioClass   : 'iradio_flat-green'
  });
  $('.select2').select2();
  $('#reservation').daterangepicker();
  $('#reservationH').daterangepicker();

  //pie estadisticos

  am4core.ready(function() {
  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  // Create chart instance
  var chart = am4core.create("chartdiv", am4charts.PieChart);

  // Add data
  chart.data = [ {
    "country": "Lithuania",
    "litres": 501.9
  }, {
    "country": "Czechia",
    "litres": 301.9
  }, {
    "country": "Ireland",
    "litres": 201.1
  }, {
    "country": "Germany",
    "litres": 165.8
  }, {
    "country": "Australia",
    "litres": 139.9
  }, {
    "country": "Austria",
    "litres": 128.3
  }, {
    "country": "UK",
    "litres": 99
  }, {
    "country": "Belgium",
    "litres": 60
  }, {
    "country": "The Netherlands",
    "litres": 50
  } ];

  // Add and configure Series
  var pieSeries = chart.series.push(new am4charts.PieSeries());
  pieSeries.dataFields.value = "litres";
  pieSeries.dataFields.category = "country";
  pieSeries.slices.template.stroke = am4core.color("#fff");
  pieSeries.slices.template.strokeWidth = 2;
  pieSeries.slices.template.strokeOpacity = 1;

  // This creates initial animation
  pieSeries.hiddenState.properties.opacity = 1;
  pieSeries.hiddenState.properties.endAngle = -90;
  pieSeries.hiddenState.properties.startAngle = -90;

  });
}
