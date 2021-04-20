const event = require('./transporte.json');

const execQuery = require('./query');
const { validarCambioFecha } = require('./validate');

export const cambioFecha = async () =>{
    console.log('Cambio de Fecha :', );
    try {
        console.log('event :', event);
        //Validate Json

        var validate = await validarCambioFecha(event);
        console.log('validate :', validate);
        if (!validate.ok){
            console.error("Error validando formato JSON" );
        }

        const idTransporteSap = event.idTransporte;
        const fechaHora = event.fechaHora;
        console.log('idTransporteSap :', idTransporteSap);
        console.log('fechaHora :', fechaHora);
        var resultCambioFecha;
        try {
            resultCambioFecha = await execQuery.anularFechaTransporte(idTransporteSap);
            console.log('resultCambioFecha :', resultCambioFecha);
        } catch (error) {
            console.error("Error anulando la fecha: ",error );
        }      
        try {
            const resultInsertFecha = await execQuery.insertFechaTransporte(idTransporteSap, fechaHora);
            console.log('resultInsertFecha :', resultInsertFecha);
            //Se envia registro a SAP
            var response = {
                code: 0,
                type: "Insercion de fecha exitosa",
                message: "Insercion de fecha exitosa",
                payload: JSON.stringify(resultInsertFecha)
            }
            return response;
        }
        catch(err) {
            console.error("Error insertando fecha: ",err );
        }

    } catch (error) {
        console.error("Error general anulando el pallet: "+ error );
    }

}