const palletdoc = require('./pallets.json');

const execQuery = require('./query');

export const getTask = async () =>{

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

    return result;
};