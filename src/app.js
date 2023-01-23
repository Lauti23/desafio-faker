import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

import { configMySql, configSqlite3 } from "./options/mysql.config.js";
import { createDatabase, createTable, createTableSqlite3 } from "./middlewares/middlewares.js";

//ESTABLECEMOS LOS CONTROLADORES DE DATOS
import { DatabaseManager } from "./controllers/database.controller.js";

const ProductsManager = new DatabaseManager(configMySql, "products");
const MessagesManager = new DatabaseManager(configSqlite3, "messages");

import { faker } from "@faker-js/faker";

const app = express()
const PORT = process.env.PORT || 8080;

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//CONFIGURACIÓN DE HANDLEBARS
app.use(express.static("src/public"))
app.engine("handlebars", handlebars.engine())
app.set("views", "src/public/views")

app.get("/", createDatabase, createTable, createTableSqlite3, (req, res) => {
    res.render("index.handlebars")
})

app.get("/api/products-test", (req, res) => {
    let products = [];

    const fakerProducts = () => {
        for(let id = 0; id <= 4; id++) {
            let name = faker.commerce.product();
            let price = faker.commerce.price(100, 1000, 0);
            let image = faker.image.food(100, 100, true);
            products.push({id, name, price, image});
        }
        return products;
    }
    fakerProducts();
    res.render("itemList.handlebars", {products})
})

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const io = new Server(server)

io.on("connection", (socket) => {
    console.log("User connected")
    const getData = async () => {
        let products = await ProductsManager.getAll();
        let chatHistory = await MessagesManager.getAll();
        socket.emit("productsData", products);
        socket.emit("chatHistoryData", chatHistory);
    }
    getData();

    const updateItems = async () => {
        let data = await ProductsManager.getAll();
        io.emit("productsData", data);
    }

    socket.on("createProduct", async(item) => {
        let id = await ProductsManager.insert(item);
        let product = await ProductsManager.getById(id);
        io.emit("newProduct", product);
    })

    socket.on("createMessage", async (msg) => {
        let id = await MessagesManager.insert(msg);
        let message = await MessagesManager.getById(id);
        io.emit("newMessage", message);
    })

    socket.on("deleteProduct", async (id) => {
        await ProductsManager.delete(id)
        updateItems()
    })

    socket.on("updateProduct", async (id) => {
        let itemId = await ProductsManager.getById(id);
        socket.emit("updatedProduct", itemId);
    })

    socket.on("sendNewProduct", async (item) => {
        await ProductsManager.update(item);
        updateItems();
    })
})