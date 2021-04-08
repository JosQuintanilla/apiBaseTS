

export const configAWS = {
    ip: process.env.AWS_SDK_IP || '192.168.0.3',
    port : process.env.AWS_SDK_PORT || '4566',
    region: process.env.AWS_SDK_REGION || 'REGION',
    accessKeyId: process.env.AWS_SDK_ACCESS_KEY_ID || 'na',
    secretAccessKey: process.env.AWS_SDK_SECRET_ACCESS_KEY || 'na'
};
export const configDB = {
    host: process.env.DATA_BASE_HOST || '192.168.0.3',
    user: process.env.DATA_BASE_USER || 'root',
    password: process.env.DATA_BASE_PASSWORD || 'password',
    database: process.env.DATA_BASE_DATA_BASE || 'db'
};
export const configQueue = {
    queueName: process.env.QUEUE_NAME || 'ProcessSQS2SQS',
    queuePort: process.env.QUEUE_PORT || '000000000000',
}
