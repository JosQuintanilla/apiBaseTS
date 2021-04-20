export const configAWS = {
    ip: '192.168.0.9',
    port :  '4566',
    region: 'REGION',
    accessKeyId: 'na',
    secretAccessKey:'na'
};
export const configDB = {
    host: '192.168.0.9',
    user: 'root',
    password:'password',
    database:  'db'
};
export const configQueue = {
    queueName: 'ProcessSQS2SQS',
    queuePort: '000000000000',
    queueType: 'fifo'
};

export const estado = {
    activo: '1',
    inactivo: '0'
};
export const estadoCamion = {
    activo: '1',
    inactivo: '0',
    anulado: '12'
};