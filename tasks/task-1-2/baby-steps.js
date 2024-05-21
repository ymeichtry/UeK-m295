const args = process.argv.slice(2);

let sum = 0;

for (let i = 0; i < args.length; i++) {
    sum += Number(args[i]);
}

console.log(sum)
