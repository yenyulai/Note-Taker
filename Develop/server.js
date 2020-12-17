
const generateUniqueId = require('generate-unique-id');
const express = require('express');
const app = express();
var path = require("path");
var fs = require("fs")

const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));



app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
  });

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });

// Displays all notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data)=>{
        if (err) throw err;
        res.json(JSON.parse(data))
    }); 
  });

 
app.post('/api/notes', (req, res) => {
    
    // // req.body hosts is equal to the JSON post sent from the user
    // // This works because of our body parsing middleware
    // const newNote = {"title":"Test Title input","text":"Test text input"}
    const newNote = req.body;
    
    
    newNote['id'] = generateUniqueId({
      length: 2,
      useLetters: false,
      excludeSymbols: ['!',"@","#","$","%","^","&","*","(",")","_","+","-",">"]
    });
   



    console.log(newNote);

    fs.readFile('./db/db.json', function (err, data) {
        // get previous db.json data
        var json = JSON.parse(data)
        
        // append new data in
        json.push(newNote)
    
        fs.writeFile('./db/db.json', JSON.stringify(json), (err) => {
            if (err) throw err;
            console.log('Data written to file');
        });
       
    })

    // Get latest db.json data => Show on note page
    fs.readFile('./db/db.json', (err, data)=>{
        if (err) throw err;
        res.json(JSON.parse(data))
    });

    // //write data to json file 
    // let data = JSON.stringify(testObj);
    // fs.writeFile('./db/db.json', data, { flag: "wx" }, (err) => {
    //     if (err) throw err;
    //     console.log('Data written to file');
    // });

});


//Delete note
app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', (err, data)=>{
      if (err) throw err;
      console.log(JSON.parse(data));
      // res.json(JSON.parse(data))
  }); 
});

app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, '/public/index.html'));
});
















app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
  });