const mongoose=require('../connect');

const camion={
    id:String,
    placa:String,
    exceso:[{
      lat:String,
      lon:String,
      lugar:String,
      velocidad:String,
      fecha:String,
      hora:String
    }],
    horario:[{
      lat:String,
      lon:String,
      lugar:String,
      fecha:String,
      hora:String
    }],
    extintor:[{
      lugar:String,
      fecha:String,
      observacion:String,
      aplica:Boolean,
      check:{
        botella:String,
        etiqueta:String,
        mangera:String,
        boquilla:String,
        peso:String,
        manometro:String,
        seguro:String,
        ubicacion:String,
        limpieza:String,
        area:String,
        trabajo:String,
        señalizado:String
      }
    }],
    indicador:{
      intermedio:{
        desvioCamion:{
          total:Number,
          tipo:[{
            fecha:String,
            puntoControl:Number,
            usoProteccionPersonal:Number,
            noInspeccion:Number,
            noReport:Number,
            incumplimientoHorario:Number,
            cinturon:Number,
            convoy:Number,
            salud:Number,
            sinDescansar:Number,
            documentacion:Number,
            gpsInactivo:Number,
            alterado:Number,
            conPasajero:Number,
            sinConocimientoRuta:Number,
            Nuevo:Number,
            reporteFalso:Number,
            estacionamientoInseguro:Number,
            desvioRuta:Number,
            roboHurto:Number,
            luces:Number,
            descripcion:String
          }]
        },
        desvioConductor:{
          total:Number,
          tipo:[{
            fecha:String,
            descripcion:String
          }]
        },
        via:{
          total:Number,
          tipo:[{
            fecha:String,
            bache:Number,
            trafico:Number,
            inestable:Number,
            descripcion:String
          }]
        },
        viajeAfectado:{
          total:Number,
          tipo:[{
            fecha:String,
            zonaInestable:Number,
            cierreRuta:Number,
            bloqueo:Number,
            descripcion:String
          }]
        },
        otro:{
          total:Number,
          tipo:[{
            fecha:String,
            clima:Number,
            otro:Number,
            descripcion:String
          }]
        },
      },
      final:{}
    },
};

const camionModel=mongoose.model('camion',camion);

module.exports=camionModel;
