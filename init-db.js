// todo add to npm

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const collectionName = "adds";
const dbName = "nodepopdb";
const fs = require('fs');
const fileName = "./anuncios.json";

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

init_db();