require('dotenv').config();

module.exports = {
    port:process.env.PORT,
    database:process.env.DATABASE,
    accesstoken:process.env.ACCESS_TOKEN
}