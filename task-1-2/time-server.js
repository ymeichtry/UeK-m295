const net = require('net');

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const server = net.createServer((socket) => {
    const date = new Date();
    const formattedDate = formatDate(date);
    socket.end(`${formattedDate}\n`);
});

const port = process.argv[2];
server.listen(port);
