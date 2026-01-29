const mysql = require('mysql2/promise');

const connectionConfig = {
    host: 'localhost',      // Your MySQL host
    user: 'root',           // Your MySQL username
    password: 'kamal2002', // Your MySQL password
    database: 'users'      // The name of your database
};

const connectToDb = async ()=>{
    try {
        const connection = await mysql.createConnection(connectionConfig);
        console.log('Connected to MySQL database!');
        return connection;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error;
    }
}

module.exports = connectToDb;