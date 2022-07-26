//require modules
const express = require('express');
const app = express();
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');
main().catch(err => console.log(err));

const _ = require('lodash')
// const date = require(__dirname+'/date.js')

//  ejs config
app.set('view engine','ejs');
//body parser config
app.use(bodyParser.urlencoded({extended:true}))
 //express static config
app.use(express.static('public'))
//collect to mongodb
async function main() {
  await mongoose.connect('mongodb://localhost:27017/todolistDB')
};

//item schema
const itemSchema = new mongoose.Schema({
  name: String
})
//create a model
const item = mongoose.model('Item', itemSchema);

//mongoose Document

const item1 = new item({
  name: 'cook'
})

const item2 = new item({
  name: 'eat'
})

const item3 = new item({
  name: 'sleep'
})

const defaultItems = [item1,item2,item3];

//list schema
const listSchema = new mongoose.Schema({
  name:String,
  item: [itemSchema]
})
//list model
const list = mongoose.model('List', listSchema)

// get request to root route
app.get('/', (req,res)=>{
  // const day =date.getDay()

//find and send if db collection is empty
  item.find(function(err, items){

    if (items.length === 0) {
      //insert document to db

      item.insertMany( defaultItems, err=>{
        if (err) {
          console.log(err);
        }else {
          console.log('saved');
        }
      })
      res.redirect('/')
    }else {
      const updateToLists = items;
      // passing items from server to ejs files
      res.render('days' ,{ listTitle:'today', item: updateToLists})
    }

  })
})

//handling routers
app.get('/:customName', (req, res)=>{
  //convert params to uppercase
  const customName = _.capitalize(req.params.customName);
  //check if the list already exists
     list.findOne({name:customName }, function(err,foundList){
       if (!err) {
         if(!foundList){
           //create new list if list is not found
           const list_i = new list({
             name: customName,
             item: defaultItems
           });
           list_i.save();
             res.redirect('/' + customName);
         }else {
           //render an existing list
              res.render('days' ,{ listTitle: foundList.name, item: foundList.item})
         }
       }
     })
})


//post request from root route
app.post('/', (req,res)=>{
//passing inputs from client side
const itemName = req.body.todo
const listName = req.body.list;


// saving passed inputs into items collection
 const item_i = new item({
   name:itemName
 })
 //logic to check source of input
 //save to root directory if the title = 'today'
 if (listName === 'today') {
   item_i.save();
   res.redirect('/')
 }else {
   //save to the necessary route
   list.findOne({name:listName}, function(err, foundList){
     foundList.item.push(item_i);
     foundList.save();
     res.redirect('/'+listName)
   })
 }


})

// handling delete request
app.post('/delete', (req,res)=>{
const checked=  req.body.checkbox
const listName = req.body.listName;

if (listName === 'today') {
  item.findByIdAndRemove(checked, (err)=>{
    if (!err) {
      console.log('success');
      res.redirect('/')
  }
});
  }else {
  list.findOneAndUpdate({name:listName}, {$pull:{item:{_id:checked}}}, function(err, foundList){
    if(!err){
      res.redirect('/'+listName)
    }
  })
}

})
//get request from the work route

app.listen(3000, ()=>{
  console.log('server is upp and running');
})
