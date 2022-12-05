import * as mysql from "mysql2";



const connecting = ()=>{
    const connection = mysql.createConnection({
        "host": process.env.DB_HOST,
        "user": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME
    });
    connection.connect();
    return connection;
}

export default connecting;