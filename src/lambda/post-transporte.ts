const palletdoc = require('./pallets.json');

const execQuery = require('./query');
const { validarModificarCamion } = require('./validate');

export const postTransporte = async () =>{

    console.log('palletdoc :', palletdoc);

    try {
        var validate = await validarModificarCamion(palletdoc);
        console.log('validate :', validate);
        if (!validate.ok){
            console.error("Error validando formato JSON" );
            return ("Error validando formato JSON" );
        }else{

            console.log("post-transporte -> palletdoc :",palletdoc);
            const idTransporteSap = palletdoc.idTransporte;
            console.log('post-transporte -> idTransporteSap :', idTransporteSap);
            var idTransporte;
            idTransporte = await execQuery.getIdTransporte(idTransporteSap);

            console.log('post-transporte -> idTransporte :', idTransporte);
            const result = {
                "name": "Nombreeeeeeeeeeeeeeeeeee",
                idTransporteSap: idTransporteSap,
                idTransporte: idTransporte
            }
            console.log('post-transporte -> result :', result);

        }
    } catch (error) {
        console.log('post-transporte -> error :', error);

        return error;
    }

};