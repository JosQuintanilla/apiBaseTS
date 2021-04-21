import mysql = require('mysql');
import { configDB, estadoCamion, estado } from "./config";

const connection = mysql.createConnection({
    host: configDB.host,
    user: configDB.user,
    password: configDB.password,
    database: configDB.database
});

const anularCamion = async (idTransporteSap : string) => {
    return new Promise((resolve, reject) => {
        let rowAffected = 0;
        const sql = `UPDATE db.Camion 
        SET estado_camion = '${estadoCamion.inactivo}'
        WHERE id_camion = (select MAX(c.id_camion) as id_camion 
                            from db.Camion c 
                            where c.fk_transporte = (select MAX(t.id_transporte) as id_transporte 
                                        from db.Transporte t 
                                        where t.numero_transporte = '${idTransporteSap}'
                                        and t.estado_transporte = '${estadoCamion.activo}')
                            and c.estado_camion = '${estadoCamion.activo}')`;

        connection.query(sql, (err:any, results:any) => {
            if (err) {
                reject(err);
            }
            if (results != undefined && results != null && results.affectedRows > 0) {
                rowAffected = results.affectedRows;
            }
            resolve(rowAffected);
        });
    });
}

const insertCamion = async (transporte:any, idTransporte:any) => {
    return new Promise((resolve, reject) => {
        let id = 0;
        const sql = `INSERT INTO db.Camion
        (numero_camion,
        fecha_camion,
        estado_camion,
        fk_transporte)
        VALUES 
        ( '${transporte.idCamion}',
        '${transporte.fechaHora}',
        '${estado.activo}',
        '${idTransporte}')`;

        connection.query(sql, (err, results) => {
            if (err) {
                reject(err);
            }
            if (results != undefined && results != null && results.insertId > 0) {
                id = results.insertId;
            }
            resolve(id);
        });
    });
}

const anularPallet = async (pallet : any) => {
    return new Promise((resolve, reject) => {
        let id = 0;
        const sql = ``;

        connection.query(sql, (err, results) => {
            if (err) {
                reject(err);
            }
            if (results != undefined && results != null && results.insertId > 0) {
                id = results.insertId;
            }
            resolve(id);
        });
    });
}



const verifyTransporteExist = async  (transporte:any) => {
    return new Promise((resolve, reject) => {
        console.log(transporte.idTransporte);
        let id = 0;
        const sql = `select t.id_transporte 
        from db.Transporte t
        where t.numero_transporte = '${transporte.idTransporte}'
        and t.estado_transporte = '${estado.activo}'`;
        connection.query(sql, (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results != undefined && results != null && results.length > 0) {
                    id = results[0].id_transporte;
                }
                resolve(id);
            }
        });
    });
}

const insertTransporte = async (transporte:any) => {
    return new Promise((resolve, reject) => {
        
        let id = 0;
        const sql = `INSERT INTO db.Transporte
        (numero_transporte,
        tipo_transporte,
        carga_tecnica_transporte,
        cantidad_pallet_transporte,
        estado_transporte,
        fecha_creacion,
        fk_cd)
        VALUES 
        ( '${transporte.idTransporte}',
        '-',
        '-',
        0,
        '${estado.activo}',
        now(),
        '${transporte.idCentroDistribucion}')`;

        console.log("sql: ",sql);
        connection.query(sql, (err, results) => {
            if (err) {
                reject(err);
            }
            if (results != undefined && results != null && results.insertId > 0) {
                id = results.insertId;
            }
            resolve(id);
        });
    });
}

const verifyCamionExist = async  (transporte:any) => {
    return new Promise((resolve, reject) => {
        let id = 0;
        const sql = `select c.id_camion 
        from db.Camion c, db.Transporte t
        where t.numero_transporte = '${transporte.idTransporte}'
        and t.estado_transporte = '${estado.activo}'
        and c.fk_transporte = t.id_transporte
        and c.numero_camion = '${transporte.idCamion}'
        and c.estado_camion = '${estado.activo}'`;
        connection.query(sql, (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results != undefined && results != null && results.length > 0) {
                    id = results[0].id_camion;
                }
                resolve(id);
            }
        });
    });
}




const verifyPalletExist = async (pallet:any, idTransporte:string) => {
    return new Promise((resolve, reject) => {
        let id = 0;
        const sql = `select p.id_pallet_transporte 
        from db.Pallet_Transporte p, db.Transporte t
        where p.fk_transporte = t.id_transporte
        and p.numero_pallet = '${pallet.idPallet}'
        and t.id_transporte = '${idTransporte}'
        and t.estado_transporte = '${estado.activo}'
        and p.estado_pallet = '${estado.activo}'`;

        connection.query(sql, (err, results) => {
            if (err) {
                reject(err);
            }
            if (results != undefined && results != null && results.length > 0) {
                id = results[0].id_pallet_transporte;
            }
            resolve(id);
        });
    });
}

const insertPallet = async (pallet:any, idTransporte:string) => {
    return new Promise((resolve, reject) => {
        let id = 0;
        let sql = "";

        switch (parseInt(pallet.remonte) > 0) {
            case true:
                sql = `insert into db.Pallet_Transporte 
                (numero_pallet, 
                id_ola, 
                prioridad_pallet,
                remonte_pallet, 
                estado_pallet, 
                estado_pallet_cola, 
                total_capas_pallet,
                impresora_pallet, 
                fecha_creacion,
                fk_pallet_transporte,
                fk_tipo_pallet,
                fk_transporte) 
                values ('${pallet.idPallet}',
                '${pallet.idOla}',
                '${parseInt(pallet.prioridadArmadoPallet)}',
                '${parseInt(pallet.remonte)}',
                '${estado.activo}',
                '${estado.inactivo}',
                '${parseInt(pallet.totalCapas)}',
                '-',
                now(),
                (select p.id_pallet_transporte 
                    from db.Pallet_Transporte p, db.Transporte t
                    where p.fk_transporte = t.id_transporte
                    and p.remonte_pallet = 0
                    and p.estado_pallet = '${estado.activo}'
                    and p.numero_pallet = '${pallet.palletRemonte}'
                    and t.id_transporte = '${idTransporte}'
                    and t.estado_transporte = '${estado.activo}'),
                (select tp.id_tipo_pallet
                    from db.Tipo_Pallet tp
                    where tp.nombre_tipo_pallet = '${pallet.tipoPallet}'),
                '${idTransporte}')`;
                break;
            default:
                sql = `insert into db.Pallet_Transporte 
                (numero_pallet, 
                id_ola, 
                prioridad_pallet,
                remonte_pallet, 
                estado_pallet,
                estado_pallet_cola,  
                total_capas_pallet,
                impresora_pallet, 
                fecha_creacion,
                fk_tipo_pallet,
                fk_transporte) 
                values ('${pallet.idPallet}',
                '${pallet.idOla}',
                '${parseInt(pallet.prioridadArmadoPallet)}',
                '${parseInt(pallet.remonte)}',
                '${estado.activo}',
                '${estado.inactivo}',
                '${parseInt(pallet.totalCapas)}',
                '-',
                now(),
                (select tp.id_tipo_pallet
                    from db.Tipo_Pallet tp
                    where tp.nombre_tipo_pallet = '${pallet.tipoPallet}'),
                '${idTransporte}')`;
        }

        connection.query(sql, (err, results) => {
            if (err) {
                reject(err);
            }
            if (results != undefined && results != null && results.insertId > 0) {
                id = results.insertId;
            }
            resolve(id);
        });
    });
}

const verifyCapaExist = async (contenido:any, idTransporte:string, idPallet:string) => {
    return new Promise((resolve, reject) => {
        let id = 0;
        const sql = `select c.id_capa 
        from db.Capa c, db.Pallet_Transporte p
        where p.fk_transporte = '${idTransporte}'
        and p.id_pallet_transporte = '${idPallet}'
        and p.estado_pallet = '${estado.activo}'
        and c.fk_pallet_transporte = p.id_pallet_transporte
        and c.sku_capa = '${contenido.capaSku}'
        and c.estado_capa = '${estado.activo}'`;

        connection.query(sql, (err, results) => {
            if (err) {
                reject(err);
            }
            if (results != undefined && results != null && results.length > 0) {
                id = results[0].id_capa;
            }
            resolve(id);
        });
    });
}

const insertCapa = async (contenido:any, idPallet:string) => {
    return new Promise((resolve, reject) => {
        let id = 0;
        const sql = `insert into db.Capa
        (tipo_capa, 
        sku_capa, 
        estado_capa,
        fk_pallet_transporte)
        values ('-',
        '${contenido.capaSku}',
        '${estado.activo}',
        '${idPallet}')`;

        connection.query(sql, (err, results) => {
            if (err) {
                reject(err);
            }
            if (results != undefined && results != null && results.insertId > 0) {
                id = results.insertId;
            }
            resolve(id);
        });
    });
}

const verifyProductoCapaExist = async (contenido:any, idTransporte:string, idPallet:string, idCapa:string, mixtoPAV:any) => {
    return new Promise((resolve, reject) => {
        let id = 0;
        let sql = `select pc.id_producto_capa
        from db.Producto_Capa pc, db.Capa c, db.Pallet_Transporte p, db.Transporte t
        where pc.sku_producto = '${contenido.sku}'
        and pc.fk_capa = '${idCapa}'
        and pc.estado_producto = '${estado.activo}'
        and p.id_pallet_transporte = '${idPallet}'
        and c.sku_capa = '${contenido.capaSku}'
        and c.estado_capa = '${estado.activo}'
        and p.fk_transporte = t.id_transporte
        and p.estado_pallet = '${estado.activo}'
        and t.id_transporte = '${idTransporte}'
        and t.estado_transporte = '${estado.activo}'`;
        
        if (mixtoPAV) sql += `and pc.conversion_producto = 1`; 

        connection.query(sql, (err, results) => {
            if (err) {
                reject(err);
            }
            if (results != undefined && results != null && results.length > 0) {
                id = results[0].id_producto_capa;
            }
            resolve(id);
        });
    });
}

const insertProductoCapa = async (contenido:any, idCapa:string) => {
    return new Promise((resolve, reject) => {
        let id = 0;
        const sql = `insert into db.Producto_Capa 
        (secuencia_picking_producto, 
        sku_producto,
        glosa_sku_producto, 
        nombre_producto, 
        tipo_producto, 
        estado_producto,
        conversion_producto, 
        cantidad_producto_sap, 
        unidad_medida_producto, 
        ubicacion_producto, 
        cantidad_producto_picking,
        cantidad_contenedores,
        fk_capa)
        values ('${contenido.secuenciaPicking}',
        '${contenido.sku}',
        '${contenido.glosaSku}',
        '-',
        '-',
        '${estado.activo}',
        '${contenido.conversion}',
        '${contenido.cantidad}',
        '${contenido.unidadDeMedida}',
        '${contenido.ubicacion}',
        0,
        '1',
        '${idCapa}')`;

        connection.query(sql, (err, results) => {
            if (err) {
                reject(err);
            }
            if (results != undefined && results != null && results.insertId > 0) {
                id = results.insertId;
            }
            resolve(id);
        });
    });
}

const verifyFechaTransporteExist = async  (transporte:any) => {
    return new Promise((resolve, reject) => {
        let id = 0;
        const sql = `select f.id_fecha_transporte 
        from db.Fecha_Transporte f, db.Transporte t
        where t.numero_transporte = '${transporte.idTransporte}'
        and t.estado_transporte = '${estado.activo}'
        and f.fk_transporte = t.id_transporte
        and f.fecha_transporte = '${transporte.fechaHora}'
        and f.estado_fecha_transporte = '${estado.activo}'`;
        connection.query(sql, (err, results) => {
            if (err) {
                reject(err);
            } else {
                if (results != undefined && results != null && results.length > 0) {
                    id = results[0].id_fecha_transporte;
                }
                resolve(id);
            }
        });
    });
}

const anularFechaTransporte = async (idTransporteSap : string) => {
    return new Promise((resolve, reject) => {
        console.log('anularFechaTransporte');
        let rowAffected = 0;
        const sql = `UPDATE db.Fecha_Transporte 
        SET estado_fecha_transporte = '${estado.inactivo}'
        WHERE id_fecha_transporte = (select temp.id_fecha_transporte from (select MAX(f.id_fecha_transporte) as id_fecha_transporte 
                            from db.Fecha_Transporte f 
                            where f.fk_transporte = (select MAX(t.id_transporte) as id_transporte 
                                        from db.Transporte t 
                                        where t.numero_transporte = '${idTransporteSap}'
                                        and t.estado_transporte = '${estado.activo}')
                            and f.estado_fecha_transporte = '${estado.activo}') temp)`;

        connection.query(sql, (err, results) => {
            if (err) {
                reject(err);
            }
            if (results != undefined && results != null && results.affectedRows > 0) {
                rowAffected = results.affectedRows;
            }
            resolve(rowAffected);
        });
    });
}

const insertFechaTransporte = async (idTransporteSap : string, fechaHora: string) => {
    return new Promise((resolve, reject) => {
        console.log('insertFechaTransporte');
        let id = 0;
        const sql = `INSERT INTO db.Fecha_Transporte 
        (fecha_transporte,
        estado_fecha_transporte,
        fk_transporte)
        VALUES ('${fechaHora}',
        '${estado.activo}',
        (select MAX(t.id_transporte) as id_transporte 
        from db.Transporte t 
        where t.numero_transporte = '${idTransporteSap}'
        and t.estado_transporte = '${estado.activo}'))`;

        connection.query(sql, (err:any, results:any) => {
            if (err) {
                reject(err);
            }
            if (results != undefined && results != null && results.insertId > 0) {
                id = results.insertId;
            }
            resolve(id);
        });
    });
}

module.exports = { 
    verifyTransporteExist,
    insertTransporte,
    verifyCamionExist,
    verifyFechaTransporteExist,
    verifyPalletExist,
    insertPallet,
    verifyCapaExist,
    insertCapa,
    verifyProductoCapaExist,
    insertProductoCapa,
    anularCamion, 
    insertCamion,
    anularFechaTransporte,
    insertFechaTransporte
}