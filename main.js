import express from 'express'

const app = express();

console.log('hello')

app.listen(3000, ()=> 
    console.log(`server is listening at http://localhost:3000`))