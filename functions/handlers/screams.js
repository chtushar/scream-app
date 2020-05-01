const {db} = require('../util/admin')

exports.getAllScreams  = (req, res) => {
    
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
}

exports.postOneScream = (req, res) => {
    if (req.method != 'POST') {
        return res.sendStatus(400).json({error: 'Method not allowed'})
    }


    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
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
}