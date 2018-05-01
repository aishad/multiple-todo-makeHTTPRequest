const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser')

app.use(bodyParser.raw({ type: '*/*' }))


// The following two endpoints are so that the browser can load the HTML and Javascript
app.get('/', (req, res) => res.send(fs.readFileSync('./public/index.html').toString()))
app.get('/app.js', (req, res) => res.send(fs.readFileSync('./public/app.js').toString()))
app.get('/getItemsLastList', (req, res) =>res.send(serverState.lastListName))


// 
let serverState = {
    items: {},
    lastListName: "grocery list",
    importListName: ""
}

app.post('/setListName', (req,res)=>{
    let parsedBody = JSON.parse(req.body.toString());
    serverState.lastListName = parsedBody.lastListName;
    console.log(serverState)
    res.send(JSON.stringify(serverState.lastListName));

})

app.post('/items', (req, res) => {
    let parsedBody = JSON.parse(req.body.toString())
    let listName = parsedBody.listName;
    let items = serverState.items[listName];
    //change last list name here possible
    if (!items) items = []
    console.log(serverState)
    res.send(JSON.stringify(items));
})

app.post('/addItem', (req, res) => {
    // Remember: the body of an HTTP response is just a string.
    // You need to convert it to a javascript object
    let parsedBody = JSON.parse(req.body.toString())
    // This is just a convenience to save some typing later on
    let listName = parsedBody.listName;
    // If the list doesn't exist, create it
    if (!serverState.items[listName]) { serverState.items[listName] = [] }
    // The following could be rewritten in a shorter way using push.
    // Try rewriting it. It will help you understand it better.
    serverState.items[listName] = serverState.items[listName].concat(parsedBody.item)
    console.log(serverState)
    res.send(JSON.stringify(serverState.items[listName]));
})

app.post('/clearList', (req, res) => {
    let parsedBody = JSON.parse(req.body.toString())
    let listName = parsedBody.listName;
    serverState.items[listName] = []
    items = serverState.items[listName]
    res.send(JSON.stringify(items))


})

app.post('/reverselist', (req,res) =>{
    let parsedBody = JSON.parse(req.body.toString())
    let listName = parsedBody.listName;
    serverState.items[listName] = serverState.items[listName].reverse() 
    items = serverState.items[listName]
    res.send(JSON.stringify(items))
})


 app.post('/importList',(req,res) =>{
     let parsedBody = JSON.parse(req.body.toString())
     let importListName = parsedBody.importListInput;

    if(serverState.items[importListName]){
        serverState.items[importListName].forEach(element => {
            serverState.items[serverState.lastListName].push(element)
        });
    }
     res.send(JSON.stringify(serverState.items[serverState.importListName]))
 })

app.listen(3000, () => console.log('Example app listening on port 3000!'))
