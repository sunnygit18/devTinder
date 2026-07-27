const mongoose = require("mongoose");
const dns = require("dns")

dns.setServers([
    '1.1.1.1',
    '8.8.8.1'
])

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://sunny2404k_db_user:XH3TlMCSsmL83Y2S@cluster0.wjt8xk6.mongodb.net/devtTINDER");
};

module.exports = connectDB;


