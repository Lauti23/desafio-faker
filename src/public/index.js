const socket = io();

//ELEMENTOS DEL DOM
let inputEmail = document.getElementById("inputEmail");
let chatBox = document.getElementById("chatBox");
let chatLogs = document.getElementById("chatHistory");
let messageBox = document.getElementById("messageBox");
let productsForm = document.getElementById("form");
let table = document.getElementById("table");
let needData = document.getElementById("noData");
let needDataForChat = document.getElementById("noInfoChat");

//FUNCIÓN PARA OBTENER EL PRODUCTO QUE SE QUIERE GUARDAR
const submitProducts = (e) => {
    e.preventDefault()
    let name = e.target[0].value;
    let price = e.target[1].value;
    let image = e.target[2].value;
    if(name && price && image) {
        let product = {name, price, image}
        socket.emit("createProduct", product)
        productsForm.reset()
    } else {
        needData.innerHTML = "Faltan campos por completar"
    }
}

//FUNCIÓN PARA OBTENER EL MENSAGE QUE SE QUIERE ENVIAR
const submitChat = (e) => {
    e.preventDefault();
    let message = e.target[0].value;
    let email = inputEmail.value;
    if(message && email) {
        let date = new Date().toLocaleString()
        let chat = {email, date, message}
        console.log(chat)
        socket.emit("createMessage", chat)
    } else {
        needDataForChat.innerHTML = "Faltan datos para enviar el mensaje..."
    }
}



productsForm.addEventListener("submit", (e) => submitProducts(e));
chatBox.addEventListener("submit", (e) => submitChat(e));

socket.on("productsData", data => {
    if(data.length === 0) {
        table.innerHTML = `<p class="noProdcuts">No hay productos almacenados.</p>`
    } else {
        data.forEach(prod => {
            let tr = document.createElement("tr");
            tr.innerHTML = `<td class="td">${prod.name}</td>
                            <td class="td">$ ${prod.price}</td>
                            <td class="td"><img class="prodImage" src=${prod.image}></td>
                            <td class="td"><button id="deleteProdBtn" class="${prod.id}">X</button></td>`
            table.append(tr);
        });
    }
})

socket.on("newProduct", data => {
    let product = data[data.length - 1];
    let tr = document.createElement("tr");
    tr.innerHTML = `<td class="td">${product.name}</td>
                    <td class="td">$ ${product.price}</td>
                    <td class="td"><img class="prodImage" src=${product.image}></td>
                    <td class="td"><button id="deleteProdBtn" class="${product.id}">X</button></td>`
    table.append(tr);
}) 

//FUNCIÓN PARA ELIMINAR UN PRODUCTO.
const deleteItem = (e) => {
    if(e.target.nodeName == "BUTTON") {
        let buttonClicked = e.target;
        let itemId = buttonClicked.className;
        socket.emit("deleteProduct", itemId);
    }
}
table.addEventListener("click", (e) => deleteItem(e))



socket.on("chatHistoryData", data => {
    let messages = "";
    data.forEach(text => {
        messages += `<p class="messageBox"><span class= "email"> ${text.email}</span><span class= "date">[${text.date}]</span><span class= "message">: ${text.message}</span></p>`
    })
    chatLogs.innerHTML = messages;
    messageBox.value = "";
}) 

socket.on("newMessage", data => {
    let message = data[data.length - 1];
    let chat = document.createElement("p");
    chat.innerHTML = `<span class="email">${message.email}</span><span class="date">[${message.date}]:</span><span class="message"> ${message.message}</span>`;
    chatLogs.append(chat);
})


