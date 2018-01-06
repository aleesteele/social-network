/*/------------------MIDDLEWARE------------------/*/
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session');
const multer = require('multer');
const uidSafe = require('uid-safe');
const compression = require('compression');
const csurf = require('csurf');
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.use(compression());
app.use(cookieSession({
    secret: 'secret!!!',
    maxAge: 1000 * 60 * 60 * 24 * 14
}))
app.use(csurf());
app.use(function(req, res, next) {
    res.cookie('cookie-thing', req.csrfToken())
    next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('./public'));
if (process.env.NODE_ENV != 'production') {
    app.use('/bundle.js', require('http-proxy-middleware')({
        target: 'http://localhost:8081/'
    }));
}

//*------------------OTHER MODULES------------------*//
const db = require('./routes/db');
const s3 = require('./routes/s3');

//*------------------DISK STORAGE------------------*//
const diskStorage = multer.diskStorage({ //
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads'); //add uploading file to uploads...
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) { //makes code of 24 characters
          callback(null, uid + path.extname(file.originalname)); //gets code + ext name (i.e. .jpg, etc)
      });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

/*/------------------SOCKET.IO------------------/*/

var onlineUsers = [];
app.get("/connected/:socketId", (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        console.log('connected with socket.io || index.js')

        onlineUsers.push({
            userId: req.session.user.id,
            socketId: req.params.socketId
        })

        //user is in the ids array (aka i in for loop) && ids = array of just ids from the users array
        const ids = onlineUsers.map(
            user => user.userId
        )
        console.log('ids from socket.io || index.js ', ids);

        // let idsNoDuplicates = ids.

        db.getUsersByIds(ids).then(results => {
            console.log('index.js || socket getUsersByIds: ', results)
            // committing between client & the server
            var socketId = req.params.socketId

            //this is what allows you to broadcast it to the individual user
            //and not everybody in the entire thing
            io.sockets.sockets[socketId].emit('onlineUsers', {
                onlineUsers: results
            })
            // io.sockets.emit('onlineUsers', {
            //     onlineUsers : onlineUsers
            // })
        }).catch(err => { console.log('ERR WITH GETUSERSBYID || INDEX.JS: ', err)})

        res.send();
    }
});

//3 events
//all users online
//if statement: only add user to array if unique
//on disconnect: check if unique userid is gone

//you want the usesOnlines component to refresh automatically
//without refreshing the page
//in both cases you have to take the userId who just left joined
//remove or add them based on whether they've joined or
//redux store ----> update online
/////////thing behind updated

io.on('connection', function(socket) {
    console.log(`socket with the id ${socket.id} is now connected`);

    socket.on('disconnect', function() {
        console.log(`socket with the id ${socket.id} is now disconnected`);
    });

    socket.on('thanks', function(data) {
        console.log(data);
    });

    socket.emit('welcome', {
        message: 'Welcome. It is nice to see you. This is on the client side.'
    });
});

/*/------------------ROUTES------------------/*/

app.get('/welcome', (req, res) => {
    if (req.session.user) {
        res.redirect('/');
    }
    else {
        res.sendFile(__dirname + '/index.html');
    }
});

app.post('/register', (req, res) => {
    console.log('INSIDE REGISTER INDEX.JS')
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    if (!firstname || !lastname || !email || !password) {
        res.json({ success: false })
    }
    else {
        db.hashPassword(password).then((hashedPassword) => {
            db.registerUser(firstname, lastname, email, hashedPassword).then((user) => {
                req.session.user = {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    id: user.id
                };
                console.log('REGISTER || INDEX.JS REQ.SESSION.USER', req.session.user)
                res.json({ success: true });
            }).catch((err) => { console.log('ERR FROM REGISTER USER || INDEX.JS', err) });
        }).catch((err) => {
            console.log('ERR HASHING PW || INDEX.JS', err);
            return res.json({ success: false });
        })
    }
});

app.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    if (!req.body.email || !req.body.password) {
            res.json({ success: false })
    }
    else {
        //if already signed in, redirect to homepage
        //DO THIS LATER!!!
        db.checkHashPass(email).then((hashedPassword) => {
            db.checkPassword(password, hashedPassword).then((doesMatch) => {
                if (doesMatch) {
                    db.findUserByEmail(email).then((user) => {
                        req.session.user = {
                            firstname: user.firstname,
                            lastname: user.lastname,
                            email: user.email,
                            id: user.id
                        };
                        console.log('login || index.js', req.session.user);
                        res.json({ success: true });
                    })
                } else { res.json({ success: false }); }
            }).catch((err) => {
                console.log('err in app.post for login || INDEX.JS', err)
                res.json({ success: false });
            });
        }).catch((err) => {
            console.log('err with checkEmail || INDEX.JS ', err)
            res.json({ success: false });
        })
    }
})
// showUploader={ () => this.setState( {uploader} ) }
app.get('/get-user-info', (req, res) => {
    console.log('GETUSERINFO req.session || INDEX.JS', req.session.user.id)
    db.getUserInfo(req.session.user.id).then(results => {
        // console.log('results FOR GETUSERINFO || INDEX.JS', results)
        res.json({ results });
    }).catch(err => { console.log('ERR WITH GETUSERINFO || INDEX.JS', err) })
})

app.post('/upload-prof-pic', uploader.single('file'), (req, res) => { ///THIS NEEDS UPDATING
    console.log('UPLOADPIC || INDEX.JS || req.file', req.file)
    var picToUpload = 'https://s3.amazonaws.com/imgboard-anne-sp/' + req.file.filename
    if (req.file) {
        Promise.all([
            s3.uploadProfPic(req.file, req.session.user.id),
            db.uploadProfPic(picToUpload, req.session.user.id)
        ]).then(data => {
            console.log('DATA FROM PROMISE', data)
            res.json({
                success: true,
                newPic: picToUpload
            })
        }).catch((err) => { console.log('ERR IN PROFILE PROMISE.ALL', err) })
    } else {
        console.log('trying to upload req.file FAIL', req.file)
        res.json({ success: false });
    }
})

app.post('/update-prof-pic', (req, res) => {
    db.updateProfPic(req.session.user.id).then(data => {
        console.log('data from update-prof-pic || index.js', data)
        res.json({
            success: true,
        })
    })
})

app.post('/update-bio', (req, res) => {
var bio = req.body.bio
var userId = req.session.user.id;
console.log('bio: ', bio, 'userId: ', userId)
    db.updateBio(bio, userId).then(data => {
        console.log('BIO WAS UPDATED!!', data)
        res.json({
            data: data,
            newBio: bio,
            success: true
        })
    }).catch(err => { console.log('err in update bio || index.js', err)})
})

app.get('/user/:id', (req, res) => {
var otherUserId = req.params.id;
    db.getOtherUser(otherUserId).then(data => {
        // console.log('OTHER USER INFO INDEX.JS || OTHER USER ||', data);
        res.json({
            data: data,
            success: true
        })
    }).catch(err => { console.log('err in get other user || INDEX.JS', err) })
})

app.get('/get-friendship-status/:id', (req, res) => {
var userId = req.session.user.id;
var otherUserId = req.params.id;
console.log('get friendship status stuff', userId, otherUserId)
    db.checkFriendshipStatus(userId, otherUserId).then(data => {
        console.log('checkfriendship data || index.js', data)
        if (data === undefined) {
            // console.log("friendship data is undefined")
            res.json({
                success: false,
                data: data
            })
        }
        else {
            // console.log('checkfriendship has shown friendship');
            res.json({
                data: data,
                success: true
            })
        }
    }).catch(err => { console.log('err in get friendship || index.js', err) })
})

app.post('/add-friend-req/:id/:status', (req, res) => {
    var userId = req.session.user.id;
    var otherUserId = req.params.id;
    var status = req.params.status; //insert pending
    // console.log('req.params for add friend request', req.params)
    console.log('add-friend || index.js || userId & otherUserId', userId, otherUserId, status)
    db.addFriendReq(userId, otherUserId, status).then(data => {
        console.log('check friendship data || index.js', data)
        res.json({
            data: data,
            success: true
        })
    }).catch(err => { console.log('err in index.js || add friend req || ', err) })
})

app.post('/change-friend-req/:id/:status', (req, res) => {
    var userId = req.session.user.id;
    var otherUserId = req.params.id;
    var status = req.params.status; //insert status
    // console.log('req.params for change friend request', req.params)
    // console.log('change friend req status || index.js || userId & otherUserId', userId, otherUserId, status)
    db.changeFriendReq(userId, otherUserId, status).then(data => {
        console.log('change friend request || index.js', data)
        res.json({
            data: data,
            success: true
        })
    }).catch(err => { console.log('err || index.js || change friend req ', err) })
})

app.post('/delete-friend/:id', (req, res) => {
    var userId = req.session.user.id;
    var otherUserId = req.params.id;
    db.deleteFriend(userId, otherUserId).then(data => {
        console.log('delete friend || index.js', data)
        res.json({
            data : data,
            success: true
        })
    }).catch(err => { console.log('err || index.js || delete friend req ', err) })
})

app.get('/friend-list', (req, res) => {
    var userId = req.session.user.id
    console.log('before db query')
    db.getFriends(userId).then(data => {
        console.log('get friends for page || index.js', data)
        res.json({
            data : data,
            success : true
        })
    }).catch(err => { console.log('err || index.js || friend list ', err) })
})


app.get('*', (req, res) => {
    if(!req.session.user) {
        console.log('no session found, redirecting to /welcome')
        res.redirect('/welcome');
    } else {
        console.log('session found, sending index.html')
        res.sendFile(__dirname + '/index.html');
    }
});

server.listen(8080, function() { console.log("I'm listening.") });
