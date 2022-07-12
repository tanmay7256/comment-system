function dbconnect() {
    // console.log("js");
    const mongoose = require('mongoose');

    const url = "mongodb://localhost/comments";

    mongoose.connect(url, {
        userNewUrlParser: true,
        useUnifiedTopology: true,
        useFindandModify: true,
    })

    const connection = mongoose.connection
    connection.once('open', function () {
        console.log("Database connected...");
    }).on('error', function (err) {
        console.log("connection failed...");
        console.log(err);
    })
}

module.exports=dbconnect;