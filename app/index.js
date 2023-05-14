//uruchomienie serwera 
const app = require('./app');
const {port} = require('./config');

app.listen(port, ()=> {console.log(`Serwer słucha na port: ${port}`)});