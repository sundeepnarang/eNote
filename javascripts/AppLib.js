
var vars = require('./AppVars.js')  
    , MongoClient = require('mongodb').MongoClient;    //Mongo

  
//-----------------------------------------
//
// Fire up Mongo
//
//-----------------------------------------
/*
MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
  //logDoc("MongoClient.connect",arguments);
    if(err) throw err;

    var collection1 = db.collection('test1');

      // Locate all the entries using find
      collection1.find().toArray(function(err, results) {
        
        //widgets = clone(results);// Let's close the db
        //console.log(widgets);
        //db.close();
      }); 

    var collection2 = db.collection('test2');

      // Locate all the entries using find
      collection2.find().toArray(function(err, results) {
        
        //map = results[0];
        //console.log("map :",map);// Let's close the db
        db.close();
      }); 

    });
*/