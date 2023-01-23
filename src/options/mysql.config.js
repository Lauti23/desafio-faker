export const configDb = {
    host: "localhost",
    user: "root",
    password: ""
}

export const configMySql = {
    client: "mysql",
    connection: {
        host: "localhost",
        user: "root",
        password: "",
        database: "ecommerce_database"
    }
}

export const configSqlite3 = {
    client: "sqlite3",
    connection: {
        filename: "./src/database/messages.sqlite"
    },
    useNullAsDefault: true
}