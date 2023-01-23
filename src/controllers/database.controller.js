import knex from "knex";

export class DatabaseManager {
    constructor(config, table) {
        this.database = knex(config);
        this.table = table;
    }

    async insert(item) {
        try {
            let id = this.database(this.table).insert(item);
            return id;
        } catch (error) {
            console.log("Error al insertar el objeto", error.message);
        }
    }

    async getById(id) {
        try {
            let item = await this.database(this.table).whereRaw("id = ?", id);
            return JSON.parse(JSON.stringify(item))
        } catch (error) {
            console.log("Error al obtener el item por id", error.message);
        }
    }

    async getAll() {
        try {
            let data = await this.database.from(this.table).select("*");
            return JSON.parse(JSON.stringify(data))
        } catch (error) {
            console.log("Error al obtener todos los datos", error.message);
        }
    }

    async update(item) {
        try {
            let data = await this.database(this.table).where({id: item.id}).update({name: item.name, price: item.price, image: item.image});
            return data;
        } catch (error) {
            console.log("Error al actualizar el item", error.message);
        }
    }

    async delete(id) {
        try {
            let itemDeleted = await this.database(this.table).where({id: id}).del();
            return itemDeleted;
        } catch (error) {
            console.log("Error al eliminar item", error.message);
        }
    }
}