// Remember: no copy pasting!

// Controlled input. This is similar to what you did in react.
function addItemInputChanged() {
    setState({ addItemInput: event.target.value });
}

// Controlled input. This is similar to what you did in react.
function nameInputChanged() {
    setState({ listNameInput: event.target.value });
}


function importListName(){
    setState({ importListInput: event.target.value });
    console.log(state)
}

// Don't try to understand the body of this function. You just 
// need to understand what each parameter represents
function makeHTTPRequest(meth, url, body, cb) {
    fetch(url, {
        body: body,
        method: meth
    })
        .then(response => response.text())
        .then(responseBody => cb ? cb(responseBody) : undefined)
}

// We're going to try and stick with React's way of doing things
let state = {
    items: [],
    addItemInput: "", // The contents of the add item input box
    listNameInput: "", // The contents of the input box related to changing the list
    listName: "grocery list",
    importListInput: ""
}

// Calling rerender changes the UI to reflect what's in the state

function rerender() {
    let inputElement = document.getElementById('itemInput');
    inputElement.value = state.addItemInput; // you can ignore this line

    let listNameElement = document.getElementById('listName')
    listNameElement.innerText = state.listName;

    let listNameInputChanged = document.getElementById('listNameInputChanged')
    listNameInputChanged.value=state.listNameInput
    
      let importName = document.getElementById('importName');
        importName.innervalue = state.importListInput;

    let d = document.getElementById("items");
    d.innerHTML = '';
    state.items.forEach(item => {
        let li = document.createElement("li");
        li.innerText = item;
        d.appendChild(li)
    })
}

// Our good friend setState paying us a visit from ReactVille
function setState(newState) {
    if (newState.items) state.items = newState.items;
    if (newState.addItemInput) state.addItemInput = newState.addItemInput;
    if (newState.listNameInput) state.listNameInput = newState.listNameInput;
    if (newState.listName) state.listName = newState.listName;
    if (newState.importListInput) state.importListInput = newState.importListInput
    rerender();
}

function sendItemToServer(it, ln) {
    // This function is so short it could be inlined
    let cb = (itemsFromServer) => {
        let parsedItems = JSON.parse(itemsFromServer)
        setState({items: parsedItems })
        setState({addItemInput: " "})

    }
    makeHTTPRequest('POST',
        '/addItem',
        JSON.stringify({ item: it, listName: ln }),
        cb)
}

// When you submit the form, it sends the item to the server
function addItemSubmit() {

    event.preventDefault();
    sendItemToServer(state.addItemInput, state.listName)
}

function listNameSubmit() {
    event.preventDefault();
    setState({ listName: state.listNameInput})
    makeHTTPRequest('POST', '/setListName', JSON.stringify({ lastListName: state.listName }), (res) => console.log(res));
    populateItems(state.listName);
    setState({listNameInput: " "})    

}

 function importListSubmit(){
     event.preventDefault();
     let body = JSON.stringify({importListInput:state.importListInput})
     fetch("/importList",{method: "POST",body: body})
     .then(e => e.text())
     .then(e => getLastListName().then(populateItems))

    }

function getLastListName(){
    return fetch('/getItemsLastList')
    .then((res)=> res.text())
    .then((body)=>setState({listName:body}))
}

// When the client starts he needs to populate the list of items
function populateItems() {
    let body = JSON.stringify({ listName: state.listName })
    fetch('/items', {
        method: 'POST',body: body})
        .then(response =>response.text())
        .then(cb)
    
    // let cb = itemsString => {
    //     let itemsParsed = JSON.parse(itemsString)
    //     setState({ items: itemsParsed })
    // }
   // makeHTTPRequest('POST', '/items', body, cb)
}

function clearList(){ 
    // let cb = itemsString => {
    //     let itemsParsed = JSON.parse(itemsString)
    //     setState({ items: itemsParsed })
    // }
     let body=JSON.stringify({listName: state.listName})
     fetch('/clearlist', {
         method:'POST', body:body})
          .then(response =>response.text())
          .then(cb)
     //.then((res)=>res.text())
    // .then((body)=>setState({items:body}))
    //makeHTTPRequest('POST', '/clearlist', body, cb)
}

function reverseList(){
    // let cb = itemsString => {
    //     let itemsParsed = JSON.parse(itemsString)
    //     setState({ items: itemsParsed })
    // }
    let body=JSON.stringify({listName: state.listName})
    fetch('/reverselist', {
        method:'POST', 
        body:body
        })
        .then(response =>response.text())
        .then(cb)

 //  makeHTTPRequest('POST', '/reverselist', body, cb)
}

 let cb = itemsString => {
     let itemsParsed = JSON.parse(itemsString)
     setState({ items: itemsParsed })
 }


// We define a function and then call it right away. I did this to give the file a nice structure.

getLastListName()
.then(populateItems);