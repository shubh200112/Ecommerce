const mongoose = require('mongoose')

const connectDatabase = () => {
    mongoose.connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
       
    }).then(con => {
        console.log('MongoDB Database connected with host ');
    })
}

module.exports = connectDatabase