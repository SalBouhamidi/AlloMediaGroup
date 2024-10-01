const app = require('./app');
const http= require('http');

const port = process.env.PORT || 3000;

app.set('port', port);

const server = http.createServer(app);

try{
    server.listen(port,()=>{
        console.log(`server is running ${port}`)
    })
}catch(e){
    console.error(e);
}


