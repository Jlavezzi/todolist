
const express = require('express');
const app = express();

const bodyParser = require ('body-parser')
const date = require(__dirname+'/date.js')

//array holding items of the todolist and the w0rk list
const updateToLists = ['buy food', 'cook food' ,'eat food']
const workitems =[]


//  ejs config
app.set('view engine','ejs');

//body parser config
app.use(bodyParser.urlencoded({extended:true}))

 //express static config
app.use(express.static('public'))

// get request to root route
app.get('/', (req,res)=>{
  const day =date.getDay()

// passing items from server to ejs files
 res.render('days' ,{ listTitle : day, item: updateToLists})

})

//post request from root route
app.post('/', (req,res)=>{
//passing inputs from the ejs files
const updateToList = req.body.todo
// checking the source of the input
  if (req.body.list ==='work') {
    workitems.push(updateToList);
    res.redirect('/work')
  }else {
     updateToLists.push(updateToList);
    res.redirect('/');
  }
})

//get request from the work route
app.get('/work', (req,res)=>{
  res.render('days', {listTitle: 'work list', item:workitems})
})


app.listen(3000, ()=>{
  console.log('server is upp and running');
})
