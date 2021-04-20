const event = require('./pallets.json');

const execQuery = require('./query');
const { validarPalletMixto } = require('./validate');

export const miLambda = async () =>{
    try {
        console.log('event :', event);
        console.log('HOLAAAAAAAAAAAAA :', );

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