const event = require('./pallets.json');

const execQuery = require('./query');
const { validarPalletMixto } = require('./validate');

export const putTransportePalletMixto = async () =>{
    try {
        console.log('event :', event);
        //Validate Json
        var validate = await validarPalletMixto(event);
        console.log('validate :', validate);
        if (!validate.ok){
            console.error("Error validando formato JSON" );
        }
        const idTransporteSap = event.idTransporte;
        const idCamion = event.idCamion;
        console.log('idTransporteSap :', idTransporteSap);
        console.log('idCamion :', idCamion);
        //Recorrer pallets
        let pallets = event.pallet;
        for (let indexPallet = 0; indexPallet < pallets.length; indexPallet++) {
            let pallet = pallets[indexPallet];
            // Validamos que el Pallet no exista previamente
            let resultAnulacion = undefined;
            try {
                resultAnulacion = await execQuery.anularPallet(pallet,idTransporteSap);
                console.log('resultAnulacion :', resultAnulacion);

                if(resultAnulacion != null && resultAnulacion != undefined){
                    //Recorrer contenido pallet

                    let contenidos = pallet.contenidoPallet;
                    for (let indexContenido = 0; indexContenido < contenidos.length; indexContenido++) {
                        let contenido = contenidos[indexContenido];

                        const resultAnularCapa = await execQuery.anularCapa(pallet, pallet.idPallet);
                        console.log('resultAnularCapa :', resultAnularCapa);


                        for (let index = 0; index < pallet.contenido.length; index++) {
                            const resultAnularProductoCapa = await execQuery.anularProductoCapa( pallet.contenido[index], pallet.idPallet);
                            console.log('resultAnularProductoCapa :', resultAnularProductoCapa);
                            
                        }
                    }
                }

            }
            catch(err) {
                console.error("err anulando el pallet ", err);
            }
        }
        //Se envia registro a SAP
        var response = {
            code: 0,
            type: "Anulacion de Pallet",
            message: "Anulacion de Pallet",
            payload: JSON.stringify(event.pallet)
        }
        return response;

    } catch (error) {
        console.error("Error general anulando el pallet: "+ error );
    }

}