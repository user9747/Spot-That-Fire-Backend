const express = require('express');
const app = express();
const debug = require('debug')('verify');
const router = express.Router();
const firebase = require('firebase');
// const firebaseConfig = require('../../firebaseConfig.js');
const axios = require('axios');

const calcDistance = require('./calcDistance.js');
// firebase.initializeApp(firebaseConfig);
const VERIFY_COUNT_THRESHOLD = 5;

module.exports = function(lat,long){
  // console.log(lat + " "+long);
  axios.get('https://nominatim.openstreetmap.org/reverse.php?format=jsonv2&lat='+lat+'&lon='+long+'&zoom=20')
  .then(response => {
    var country=response.data.address.country;
    var state=response.data.address.state;
    var district=response.data.address.state_district ||response.data.address.city_district || response.data.address.neighbourhood || response.data.address.suburb ||response.data.address.village ||response.data.address.county;
    // console.log(district);

    // console.log('fire_loc/'+ country +"/"+ state+"/"+district);
    firebase.database().ref('fire_loc/'+ country +"/"+ state+"/"+district ).once('value').then(function(snapshot){
      // console.log(snapshot.val());
      var count = snapshot.numChildren();
      console.log(count);
      if(count>= VERIFY_COUNT_THRESHOLD){
        console.log("YEAH VERIFIED");
        return true;
      }
      else{
        console.log("NOT VERIFIED");
        
        return false;

      }
      })
      .catch(function(err){
        return null;  
      });
    
  })
  .catch(function(err){
    console.log(err);
    return null;
  });
}