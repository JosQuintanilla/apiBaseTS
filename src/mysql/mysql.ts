import mysql = require('mysql');
import { configDB } from "../config/config";

const connection = mysql.createConnection({
    host: configDB.host,
    user: configDB.user,
    password: configDB.password,
    database: configDB.database
});

const getIdTransporte = async (idTransporteSap: string) => {
    return new Promise((resolve, reject) => {
        const sql = `select MAX(id_transporte) as id_transporte from Transporte where numero_transporte = '${idTransporteSap}'`;
        try {
            connection.query(sql, 0, (err, results) => {
                if (err) {
                    console.log("ERROR getIdTransporte",err);
                    reject(err);
                }
                resolve(results[0].id_transporte);
            });
        } catch (error) {
            console.log("ERROR try updateContenido",error);
            reject(error);
        }
        
    });
}

module.exports = { 
    getIdTransporte
}