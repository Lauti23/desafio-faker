import { configDb, configMySql, configSqlite3 } from "../options/mysql.config.js";
import knex from "knex";
import mysql from "mysql";

//DATABASE
const databaseMySql = knex(configMySql);
const databaseSqlite3 = knex(configSqlite3);

//FUNCIÓN PARA CREAR LA BASE DE DATOS
export const createDatabase = async (req, res, next) => {
    try {
        const createConnection = mysql.createConnection(configDb)
        createConnection.connect(function (err, result) {
            if(err) throw err;
            createConnection.query("CREATE DATABASE IF NOT EXISTS ecommerce_database", function(err, result) {
                console.log("Base de datos ecommerce_database creada")
                if(err) throw err;
            })
        })
        next();
    } catch (error) {
        console.log("Error al crear la base de datos", error.message);
    }
}

export const createTable = async (req, res, next) => {
    try {
        databaseMySql.initialize(databaseMySql);
        const existsTable = await databaseMySql.schema.hasTable("products");
        if(existsTable) {
            next();
        } else {
            await databaseMySql.schema.createTable("products", table => {
                table.increments("id");
                table.string("name");
                table.integer("price");
                table.string("image");
            })
                .then(() => console.log("Table created."))
                .catch(err => console.log(err.message))
                .finally(() => databaseMySql.destroy());
            next();
        }
    } catch (error) {
        console.log("Error al crear la tabla", error.message);
    }
}

export const createTableSqlite3 = async (req, res, next) => {
    try {
        const exists = await databaseSqlite3.schema.hasTable("messages");
        if(exists) {
            next();
        } else {
            await databaseSqlite3.schema.createTable("messages", table => {
                table.increments("id");
                table.string("email");
                table.string("date");
                table.string("message");
            })
                .then(() => console.log("Table messages created"))
                .catch(err => console.log(err.message))
                .finally(() => databaseSqlite3.destroy());
            next();
        }
    } catch (error) {
        console.log("Error al crear la tabla de sqlite3", error.message);
    }
}

//MIDDLEWARE PARA VER SI EL USUARIO YA ESTA LOGEADO
export const sessionChecker = (req, res, next) => {
    if(req.session.user && req.cookies.user_sid) {
        next()
    } else {
        res.redirect("/login")
    }
}