const functions = require('firebase-functions');
const admin = require('firebase-admin')
const express = require('express');
const app = express();
admin.initializeApp();

const firebaseConfig = {
    apiKey: "AIzaSyCbPFRLz8sUIeohtm8M6SM8_55bnvLyYZg",
    authDomain: "scream-app-d9f03.firebaseapp.com",
    databaseURL: "https://scream-app-d9f03.firebaseio.com",
    projectId: "scream-app-d9f03",
    storageBucket: "scream-app-d9f03.appspot.com",
    messagingSenderId: "649923332323",
    appId: "1:649923332323:web:ac359d604550d210255dd6",
    measurementId: "G-RSX8SEQ8YV"
};




const firebase = require('firebase')
firebase.initializeApp(firebaseConfig)

const db = admin.firestore();

app.get('/screams', (req, res) => {
    
    db
    .collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
            let screams=[]
            data.forEach(doc => {

                let d = doc.data()
                screams.push({
                    screamId: doc.id,
                    body: d.body,
                    userHandle: d.userHandle,
                    createdAt: d.createdAt
                });
            }) 
            return res.json(screams)   
        })
        .catch(err => console.log(err))
})


app.post('/scream', (req, res) => {
    if (req.method != 'POST') {
        return res.sendStatus(400).json({error: 'Method not allowed'})
    }


    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    };

        db
        .collection('screams')
        .add(newScream)
        .then((doc) => {
            return res.json({message: `${doc.id} created successfully!`})
        })
        .catch((err) => {
            res.sendStatus(500).json({error: 'Something went wrong.'})
            console.log(err);
        })
})

//sign up
let token, userId;
app.post('/signup', (req, res) => {
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    }

    db.doc(`/users/${newUser.handle}`).get()
        .then(doc => {
            if (doc.exists) {
                return res.sendStatus(400).json({ handle: 'This handle is already taken' })
            }
            else{
                return firebase
                        .auth()
                        .createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then(data => {
            userId = data.user.uid;
            return data.user.getIdToken()            
        })
        .then(tok => {
            token = tok;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId
            }
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return res.sendStatus(201).json({token})
        })
        .catch(err => {
            console.log(err);
            if (err.code === "auth/email-already-in-use") {
                return res.sendStatus(400).json({email: 'email already in use.'})
            } else{
                return res.status(500).json({error: err.code})
            }
            
        }) 


})



exports.api = functions.https.onRequest(app);