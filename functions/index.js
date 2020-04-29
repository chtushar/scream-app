const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp();

const express = require('express');
const app = express();


app.get('/screams', (req, res) => {
    admin
    .firestore()
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

    admin.firestore()
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


exports.api = functions.https.onRequest(app);