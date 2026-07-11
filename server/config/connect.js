import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
    return conn;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    
    if (error.message.includes('alert internal error') || error.message.includes('alert number 80') || error.message.includes('tlsv1 alert')) {
      console.log('\n==================================================================');
      console.log('💡 TROUBLESHOOTING TIP: SSL Alert Number 80 (TLS Internal Error)');
      console.log('This usually indicates that the MongoDB Atlas firewall rejected the connection.');
      console.log('Please ensure that:');
      console.log('1. Your current IP address is whitelisted in MongoDB Atlas Network Access.');
      console.log('2. Alternatively, whitelist "0.0.0.0/0" to allow access from any IP address.');
      console.log('3. Verify that your local network or proxy is not blocking outbound port 27017.');
      console.log('==================================================================\n');
    }
    
    process.exit(1);
  }
};

export default connectDB;
