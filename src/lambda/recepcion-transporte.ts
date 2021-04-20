const event = require('./transportes.json');

const execQuery = require('./query');

export const recepcionTransporte = async () =>{
    let jsonTransporte = undefined;
    console.log('Cambio de Fecha :', );
    try {
        console.log('event :', event);
        const queueName = 'input_sap'
        let response = {
            code: 0,
            type: "Recepción transporte",
            message: "",
            payload: event
        } 
        
        console.log( "length", event.transportes_json.length);

        for (let indexRecords = 0; indexRecords < event.transportes_json.length; indexRecords++) {
    
            jsonTransporte = event.transportes_json[indexRecords];
            try {
                console.log( "try jsonTransporte: ",jsonTransporte);
                //Recorrer transportes
                let transporte = undefined;
                let listaPallets = [];
                
                transporte = jsonTransporte;
                // Validamos que el Transporte no exista previamente
                let idTransporte = undefined;
                try {
                    idTransporte = await execQuery.verifyTransporteExist(transporte);
                    console.log( "idTransporte", idTransporte);
                }
                catch(err) {
                    console.error("err verificando transporte: ",err );
                    return "err verificando transporte: ";
                }

                // En caso de no existir el Transporte, lo insertamos
                if (idTransporte == 0) {
                    try {
                        idTransporte = await execQuery.insertTransporte(transporte);
                        if (idTransporte == 0) {
                            console.error( "Error insertando Transporte");
                        }
                    }
                    catch(err) {
                        console.error("err insertando transporte: "+ err );
                        return ("err verificando transporte: "+ err );
                    }
                }
                // Validamos que el Camion no exista previamente
                let idCamion = undefined;
                try {
                    idCamion = await execQuery.verifyCamionExist(transporte);
                }
                catch(err) {
                    console.error("err verificando camion: "+ err );
                    return ("err verificando camion: "+ err );
                }

                // En caso de no existir el Camion, lo insertamos
                if (idCamion == 0) {
                    try {
                        idCamion = await execQuery.insertCamion(transporte, idTransporte);
                        if (idCamion == 0) {
                            console.error( "Error insertando Camion");
                        }
                    }
                    catch(err) {
                        console.error("err insertando camion: "+ err );
                    }
                }
                // Validamos que la fecha no exista previamente
                let idFechaTransporte = undefined;
                try {
                    idFechaTransporte = await execQuery.verifyFechaTransporteExist(transporte);
                }
                catch(err) {
                    console.error("err verificando fecha transporte: "+ err );
                }

                // En caso de no existir la Fecha del Transporte, la insertamos
                if (idFechaTransporte == 0) {
                    try {
                        idFechaTransporte = await execQuery.insertFechaTransporte(transporte, idTransporte);
                        if (idFechaTransporte == 0) {
                            console.error( "Error insertando fecha transporte");
                        }
                    }
                    catch(err) {
                        console.error("err insertando fecha transporte: "+ err );
                    }
                }
                //Recorrer pallets
                let pallets = transporte.pallet;
                for (let indexPallet = 0; indexPallet < pallets.length; indexPallet++) {
                    let pallet = pallets[indexPallet];

                    // Validamos que el Pallet no exista previamente
                    let idPallet = undefined;
                    try {
                        idPallet = await execQuery.verifyPalletExist(pallet,idTransporte);
                    }
                    catch(err) {
                        console.error("err verificando pallet "+ err);
                    }

                    // En caso de no existir el Pallet, lo insertamos
                    if (idPallet == 0) {
                        try {
                            idPallet = await execQuery.insertPallet(pallet,idTransporte);
                            if (idPallet == 0) {
                                console.error( "Error insertando Pallet");
                            }
                        }
                        catch(err) {
                            console.error("err insertando pallet "+ err);
                        }
                    }
                    //Recorrer contenido pallet
                    let contenidos = pallet.contenidoPallet;
                    for (let indexContenido = 0; indexContenido < contenidos.length; indexContenido++) {
                        let contenido = contenidos[indexContenido];

                        // Validamos que la capa no exista previamente
                        let idCapa = undefined;
                        try {
                            idCapa = await execQuery.verifyCapaExist(contenido, idTransporte, idPallet);  
                        }
                        catch(err) {
                            console.error("err verificando capa ", err);
                        }
                            
                        // En caso de no existir la Capa, la insertamos
                        if (idCapa == 0) {
                            try {
                                idCapa = await execQuery.insertCapa(contenido, idPallet);
                                if (idCapa == 0) {
                                    console.error( "Error insertando Capa");
                                }
                            }
                            catch(err) {
                                console.error("err insertando capa "+ err);
                            }
                        }
                        // Validamos que el Producto_Capa no exista previamente
                        let idProductoCapa = undefined;
                        let mixtoPav = false;
            
                        try {
                            if (pallet.tipoPallet == 'Mixto PAV') mixtoPav = true;
                                idProductoCapa = await execQuery.verifyProductoCapaExist(contenido, idTransporte, idPallet, idCapa, mixtoPav);
                            }
                        catch(err) {
                            console.error("err verificando producto_capa "+ err);
                        }
                        // En caso de no existir el Producto_Capa, la insertamos
                        if (idProductoCapa == 0) {
                            try {
                                idProductoCapa = await execQuery.insertProductoCapa(contenido, idCapa);
                                if (idProductoCapa == 0) {
                                    console.error( "Error insertando ProductoCapa");
                                }
                            }
                            catch(err) {
                                console.error("err insertando producto_capa "+ err);
                            }
                        } 
                        /////////
                    }
                    
                }
                
            }catch(error){
                console.log('Error: ',error);
            }
        }
    ///
    }catch(error){
        console.log('Error: ',error);
    }
}