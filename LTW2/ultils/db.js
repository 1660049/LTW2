var mysql = require("mysql");

var createConnection = () => mysql.createConnection({
        host : 'localhost',
        port : 3306,
        user : 'root',
        password : '',
        database : 'qlbh',
    });    

module.exports = {
    load:(sql, fn)=>{
        
        var connection = createConnection();
        connection.connect();
        
        connection.query(sql,(error, results, fields)=>{
            if(error){
                console.log(error.sqlMessage);
            }
            else {
                fn(results);
            }
            connection.end();
        });
    },
    add : (tableName, entity, fn) => {
        var connection = createConnection();
        var sql = ` insert into ${tableName} set ? `;
        connection.connect();
        connection.query(sql, entity, (error, results, fields) => {
            if (error) {
                console.log(error.sqlMessage);
            } else {
                fn(results.insertID);
            }
            connection.end();
        });
    },
    update : (tableName, idField, entity, id, fn) => {
        var connection = createConnection();
        var sql = `update ${tableName} set ? where ${idField} `;
        connection.connect();
        connection.query(sql, [entity, id], (error, results, fields)=>{
            if (error) {
                console.log(error.sqlMessage);
            } else {
                fn(results.changedRows);
            }
            connection.end();
        });
    }
};