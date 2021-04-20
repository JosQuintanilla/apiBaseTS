"use strict";
/* utils */

var JSONValidation = require('json-validation').JSONValidation;

exports.validarModificarCamion = async function(data:any) {
    var jv = new JSONValidation();
    var schema = {
        properties: {
            origenModificacion: { type: "string", required: true },
            idTransporte: { type: "string", required: true },
            fechaHora: { type: "string", required: true },
            estadoTransporte: { type: "string", required: true },
            idCentroDistribucion: { type: "string", required: true },
            centroDistribucion: { type: "string", required: true },
            idCamion: { type: "string", required: true }
        }
    };
    var result = jv.validate(data, schema);
   
    console.log('result: ',result);

    return result;

}

exports.validarPalletMixto = async function(data:any) {
    var jv = new JSONValidation();
    var schema = {
        type: "object",
        properties: {
            origenModificacion: { type: "string", required: true },
            idTransporte: { type: "string", required: true },
            fechaHora: { type: "string", required: true },
            estadoTransporte: { type: "string", required: true },
            idCentroDistribucion: { type: "string", required: true },
            centroDistribucion: { type: "string", required: true },
            idCamion: { type: "string", required: true }
        }
    };
    var result = jv.validate(data, schema);
    console.log('result: ',result);
    return result;

}