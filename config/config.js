const mongoose = require('mongoose');

mongoose.connect(process.env.MongoURI)
.then(res => console.log(`Connection Succesful ${res}`))
.catch(err => console.log(`Error in DB connection ${err}`));