const webSocketUrl = 'ws://127.0.0.1:8080';
const apiUrl = 'http://127.0.0.1/api';
const token = localStorage.getItem('token');

const socket = new WebSocket(webSocketUrl);

const messageBox = document.getElementById('message-box');
const messageForm = document.getElementById('message-form');

messageForm.onsubmit = (event) => {
    event.preventDefault();
    const message = messageBox.value;
    messageBox.value = '';

    if (message.trim() != '')
    sendMessage(message.trim());

    else
    console.log('bozo tried to send an empty message');

}
socket.onmessage = (event) => {
    receiveMessage(event.data);
}

function receiveMessage(message) {
    const data = JSON.parse(message);
    const messageList = document.getElementById('message-list');

    // message element
    const messageEl = document.createElement('div');
    messageEl.classList.add('message');
    messageList.appendChild(messageEl);

    // img element
    const pfpEl = document.createElement('img');
    pfpEl.src = `assets/pfp/${data.sender}.webp`;
    pfpEl.alt = 'pfp';
    pfpEl.classList.add('pfp');
    messageEl.appendChild(pfpEl);

    // div element
    const divEl = document.createElement('div');
    messageEl.appendChild(divEl);

    // sender element
    const senderEl = document.createElement('h3');
    senderEl.classList.add('sender');
    senderEl.innerText = data.sender;
    divEl.appendChild(senderEl);

    // message content element
    const messageContentEl = document.createElement('span');
    messageContentEl.classList.add('message-content');
    messageContentEl.innerText = data.message;
    divEl.appendChild(messageContentEl);
}

function sendMessage(message) {
    fetch(`${apiUrl}/send`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            message: message
        })
    });
}