import mysql = require('mysql');
import { configDB, estadoCamion } from "./config";

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

const insertCamion = async (idTransporteSap : string, idCamion: string) => {
    return new Promise((resolve, reject) => {
        let id = 0;
        const sql = `INSERT INTO db.Camion 
        (numero_camion,
        fecha_camion,
        estado_camion,
        fk_transporte)
        VALUES ('${idCamion}',
        now(),
        '${estadoCamion.activo}',
        (select MAX(t.id_transporte) as id_transporte 
        from db.Transporte t 
        where t.numero_transporte = '${idTransporteSap}'
        and t.estado_transporte = '${estadoCamion.activo}'))`;

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


module.exports = { 
    anularCamion, 
    insertCamion
}