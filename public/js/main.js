const socket = io.connect();

const formProducts = document.getElementById('FormProducts');

formProducts.addEventListener('submit', (e) => {
    e.preventDefault();

    const product = {
        title: formProducts[0].value,
        price: formProducts[1].value,
        thumbnail: formProducts[2].value,
    }

    socket.emit('new-product', product);

    formProducts.reset();
});

socket.on('products', handleEventProducts);

async function handleEventProducts(products) {

    const remoteResource = await fetch('plantilla/table-products.hbs');

    const templateText = await remoteResource.text();

    const functionTemplate = Handlebars.compile(templateText);

    const html = functionTemplate({ products });

    document.getElementById('Products').innerHTML = html;

}

const btn = document.getElementById('btnSend');

btn.addEventListener('click', (e) => {
    e.preventDefault();

    const user = document.getElementById('user').value;
    const message = document.getElementById('message').value;

    if(user == '') {
        alert('¡Ingrese su email!');
        document.getElementById('user').focus();
        return;
    }

    const bodyMessage = {
        user: user,
        date: new Date().toLocaleString(),
        message: message,
    }

    socket.emit('new-message', bodyMessage);

    document.getElementById('user').value = '';
    document.getElementById('message').value = '';
});

socket.on('messages', messages =>{

    if(messages.length == 0) {
        document.getElementById('Messages').innerHTML = '¡No hay mensajes!';
    }else{
        const htmlMessages = messages.map(msg => `<span style='color: blue; font-weight: bold;'>${msg.user}</span> <span style='color: maroon'>[${msg.date}]:</span>  <span style='color: black; font-style: italic'>${msg.message}</span>`)
        .join('<br>')
        document.getElementById('Messages').innerHTML = htmlMessages;
    }
});