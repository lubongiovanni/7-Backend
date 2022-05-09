const express = require('express');

const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');

const MessagesContainer = require('./containers/messagesContainer');
const ProductsContainer = require('./containers/productsContainer');

const { options: mariaDBOptions } = require('./options/MariaDB');
const { options: sqLite3Options } = require('./options/SQLite3');

const productsApi = new ProductsContainer(mariaDBOptions, 'products');
productsApi.dropTable();
productsApi.createTable();

const messagesApi = new MessagesContainer(sqLite3Options, 'messages');
messagesApi.dropTable();
messagesApi.createTable();

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

io.on('connection', async socket => {
    console.log('¡Un nuevo cliente se ha conectado!');

    socket.emit('products', await productsApi.getAll());

    socket.on('new-product', async(data) => {
        productsApi.save(data);
        io.sockets.emit('products', await productsApi.getAll());
    });

    socket.emit('messages', await messagesApi.getAll());

    socket.on('new-message', async(data) => {
        await messagesApi.save(data.user, data.date, data.message);
        io.sockets.emit('messages', await messagesApi.getAll());
    });
});

const PORT = process.env.PORT || 8081;
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http con Websockets escuchando en el puerto ${connectedServer.address().port}`);
});
connectedServer.on('error', error => console.log(`Error en el servidor: ${error}`));