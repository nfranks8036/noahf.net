var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

  apiKey: "AIzaSyCr3I0YdZNMlN63DPxoTZHcizQnJtuDYYQ",

  authDomain: "noah-f-website.firebaseapp.com",

  projectId: "noah-f-website",

  storageBucket: "noah-f-website.appspot.com",

  messagingSenderId: "370140282943",

  appId: "1:370140282943:web:25c8775ce1d483f819f88a",

  measurementId: "G-LWLRB9T0W3"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

module.exports = router;