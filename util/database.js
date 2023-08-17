const mongoose = require('mongoose');


const MONGODB_URI =process.env.DATABASE_URI;


  const connectDb = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB!');
      } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
      }
    };


    module.exports = connectDb;