const apiUrl = 'http://127.0.0.1/api';

const loginForm = document.getElementById('login-form');
loginForm.onsubmit = (event) => {
    event.preventDefault();
    console.log('sumbitting');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    login(username, password);
}

async function login(username, password) {
    fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    }).then(res => res.text()).then(token => {
        if (token != '') {
            localStorage.setItem('token', token);
            window.location.href = '../';
        } else {
            console.log('Login failed');
        }
    });
}