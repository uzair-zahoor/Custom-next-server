const mongoose = require('mongoose');
async function connectDB() {
    try {
    const MONGO_URI = "mongodb+srv://uzairzahoor:alamawan@uzair-projects.mle7b2m.mongodb.net/graphql-next?retryWrites=true&w=majority";
    mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    console.log("Connected to MongoDB");
    }catch(err) {
        console.log(err)  
    }
}
module.exports = connectDB;