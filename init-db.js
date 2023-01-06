const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const collectionName = "ads";
const dbName = "nodepopdb";
const fs = require('fs');
const fileName = "./anuncios.json";

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function init_db() {

    await mongoose.connect(`mongodb://127.0.0.1:27017/` + dbName).then(() => {
        console.log('Connected to the database');
    });
    const collection = mongoose.connection.collection(collectionName);

    await collection.deleteMany({}).then(() => {
        console.log('All documents deleted from the collection');
    });

    const data = JSON.parse(fs.readFileSync(fileName, 'utf8'));

    await collection.insertMany(data).then(() => {
        console.log('Documents inserted into the collection');
    });

    mongoose.connection.close();
}

async function init_main() {

    rl.question('Do you really want to delete the database? (y/n) ', (answer) => {
        if (answer === 'y') {
            init_db();
        } else if (answer != 'n') {
            console.log('Invalid answer.');
        }

        rl.close();
    });
}


init_main();