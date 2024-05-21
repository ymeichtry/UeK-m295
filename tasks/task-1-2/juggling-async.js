const http = require('http');

const results = [];
let count = 0;

function getData(url, index) {
    http.get(url, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            results[index] = data;
            count++;
            if (count === 3) {
                printResults();
            }
        });
    }).on('error', (error) => {
        console.error('Fehler beim Abrufen der Daten:', error);
    });
}

function printResults() {
    for (let result of results) {
        console.log(result);
    }
}

for (let i = 0; i < 3; i++) {
    getData(process.argv[2 + i], i);
}
