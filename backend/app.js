// const express = require('experss');
// const app = express();

const connectToDb = require('./config/db.js');

const runDatabaseOperations = async ()=> {
    let connection;
    try {

        connection = await connectToDb();
        // Example: Perform an INSERT query using parameterized queries to prevent SQL injection
        const newUser = { name: 'John Doe', phone : '8770215266' };
        const [insertResult] = await connection.execute('INSERT INTO users (name, phone) VALUES (?, ?)', [newUser.name, newUser.phone]);
        console.log('User inserted with ID : ', insertResult.insertId);

    } catch (error) {
        console.error('An error occurred during database operations:', error);
    } finally {
        if (connection) {
            connection.end(); // Close the connection
        }
    }
}

runDatabaseOperations();