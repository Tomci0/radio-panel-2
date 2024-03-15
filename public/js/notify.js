let Notify = {}

Notify['messageTypes'] = {
    ['success']: {
        background: '#019232',
        color: '#fff',
    },
    ['error']: {
        background: '#920101',
        color: '#fff',
    },
    ['warning']: {
        background: '#ff7900',
        color: '#fff',
    },
    ['info']: {
        background: '#ffe100',
        color: '#fff',
    },
}

Notify.show = function (message, type = 'info') {
    if (!Notify.messageTypes[type]) {
        console.error('Invalid message type');
        return;
    }

    if (message == undefined || message == '') {
        return console.error('Empty message!')
    }

    Toastify({
        text: message,
        duration: 3000,
        gravity: 'top',
        position: 'center',
        style: Notify['messageTypes'][type],
        stopOnFocus: true,
    }).showToast();
}