const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect("mongodb+srv://admin:8zmSR64N8UmtVEhT@clusterccg.yjs1evk.mongodb.net/cats?retryWrites=true&w=majority&appName=ClusterCCG")
.then(() => {
    console.log("Database Connected!");
    app.listen(3000, () => {
        console.log(`Server running on port 3000`)
    })
})
.catch(err => console.log(`Failed conection. Error: ${err}`));