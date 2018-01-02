/*------------------REQUIRED------------------/*/
const spicedPg = require('spiced-pg');
const bcrypt = require('bcryptjs');
////////////DATABASE////////////
const db = process.env.DATABASE_URL || spicedPg(`postgres:postgres:postgres@localhost:5432/social-network`);

/*------------------MODULES------------------/*/
module.exports.hashPassword = function(password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt((err, salt) => {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

module.exports.registerUser = function(firstname, lastname, email, hashedPassword) {
    const query = `
        INSERT INTO users (firstname, lastname, email, hashed_password)
        VALUES ($1, $2, $3, $4)
        RETURNING id`
    const params = [firstname, lastname, email, hashedPassword]
    return db.query(query, params).then((results) => {
        console.log('FROM DBSIDE: RESULTS.ROWS[0]', results.rows[0]);
        return results.rows[0];
    }).catch((err) => { console.log('ERR REGISTER USER || DB.JS', err) })
}

module.exports.checkHashPass = function(email) {
        const query = `SELECT hashed_password FROM users WHERE email = $1`
        const params = [ email ]
        // console.log('QUERY', query, 'PARAMS', params)
        return db.query(query, params).then((results) => {
            return results.rows[0].hashed_password
        }).catch((err) => {console.log('err with checking email || DB.JS', err)})
}

module.exports.checkPassword = function(password, hashedPassword) { //retrieve hashed password from database
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, doesMatch) => {
            if (err) {
                console.log('err with bcrypt checking password', err);
                reject(err);
            } else {
                resolve(doesMatch);
            }
        });
    });
}

module.exports.findUserByEmail = function(email) {
    //join would be here!
    const query = `SELECT id, firstname, lastname, email FROM users WHERE email = $1`
    const params = [ email ]
    return db.query(query, params).then((results) => {
        return results.rows[0]
    }).catch(err => { console.log('ERR FIND USER || DB.JS ', err)})
}

module.exports.getUserInfo = function(userId) {
    const query = `SELECT * FROM users WHERE id = $1`
    const params = [ userId ]
    return db.query(query, params).then(results => {
        // console.log('RESULTS FOR USER || DB.JS', results.rows[0])
        return results.rows[0]
    }).catch(err => { console.log('ERR WITH GETUSERINFO || DB.JS', err) })
}

module.exports.uploadProfPic = function(file, userId) { //THIS NEEDS UPDATING
    const query = `
        UPDATE users
        SET image = $1
        WHERE id = $2`
    const params = [ file, userId ]
    return db.query(query, params).then(results => {
        // console.log('RESULTS FOR UPLOADPIC || DB.JS', results)
        // console.log('RESULTS FOR UPLOADPIC || DB.JS', results.rows)
        // console.log('RESULTS.rows[0] FOR UPLOADPIC || DB.JS', results.rows[0])
        return results.rows[0]
    }).catch(err => { console.log('ERR WITH UPLOADPIC || DB.JS', err) })
}

module.exports.updateBio = function(bio, userId) {
    const query = `
        UPDATE users
        SET bio = $1
        WHERE id = $2`
    const params = [ bio, userId ]
    return db.query(query, params).then(results => {
        console.log('RESULTS FOR UPDATEBIO || DB.JS', results.rows[0])
        return results.rows[0]
    }).catch(err => { console.log('ERR WITH UPDATEBIO', err) })
}

module.exports.updateProfPic = function(userId) {
    const query = `SELECT image FROM users WHERE id = $1`
    const params = [ userId ]
    return db.query(query, params).then(results => {
        console.log('RESULTS FOR UPDATEPROFPIC || DB.JS', err)
        return results;
    }).catch(err => { console.log('ERR WITH UPDATEPROFPIC || DB.JS', err) })
}

module.exports.getOtherUser = function(userId) {
    const query = `SELECT * FROM users WHERE id = $1`
    const params = [ userId ]
    return db.query(query, params).then(results => {
        // console.log('RESULTS FOR GETOTHERPROFILE', results)
        // console.log('RESULTS FOR GETOTHERPROFILE.rows[0]', results.rows[0])
        return results.rows[0];
    }).catch(err => { console.log('ERR WITH GETOTHER USER || DB.JS || ', err)})
}

module.exports.checkFriendshipStatus = function(userId, otherUserId)  {
    const query = `
        SELECT * FROM fstatus
        WHERE sender_id = $1 AND reciever_id = $2
        OR sender_id = $2 AND reciever_id = $1 `
    const params = [ userId, otherUserId ]
    return db.query(query, params).then(results => {
        // console.log('RESULTS || CHECKFRIENDSHIP || DB.JS, ', results)
        // console.log('RESULTS.ROWS[0] || CHECKFRIENDSHIP || DB.JS, ', results.rows[0])
        return results.rows[0];
    })
}

module.exports.addFriendReq = function(userId, otherUserId, status) {
    const query = `
        INSERT INTO fstatus (sender_id, reciever_id, status)
        VALUES ($1, $2, $3)
        RETURNING id`
    const params = [ userId, otherUserId, status ]
    return db.query(query, params).then(results => {
        console.log('RESULTS || ADDFRIENDREQ', results)
        console.log('RESULTS || ADDFRIENDREQ.results.rows[0]', results.rows[0])
        return results.rows[0];
    }).catch(err => { console.log('ERR IN ADDFRIENDREQ || DB.JS', err)})
}

module.exports.changeFriendReq = function(userId, otherUserId, status) {
    const query =  `
        UPDATE fstatus
        SET status = $3
        WHERE sender_id = $1 AND reciever_id = $2
        OR sender_id = $2 AND reciever_id = $1
        RETURNING ID`
    const params = [ userId, otherUserId, status ]
    return db.query(query, params).then(results => {
        console.log('results of changing friend request', results)
        return results.rows[0];
    }).catch((err) => { console.log('ERR || DB.JS || change friend req', err) })
}

module.exports.deleteFriend = function(userId, otherUserId) {
    const query = `
        DELETE FROM fstatus
        WHERE sender_id = $1 AND reciever_id = $2
        OR sender_id = $2 AND reciever_id = $1`
    const params = [ userId, otherUserId ]
    return db.query(query, params).then(results => {
        return results
    }).catch(err => { console.log('err | db.js | delete friend', err) })
}

module.exports.getFriends = function(userId) {
    const query = `
        SELECT users.id, users.firstname, users.lastname, users.image, status FROM users
        JOIN fstatus
        ON (status = 1 AND reciever_id = $1 AND sender_id = users.id)
        OR (status = 2 AND reciever_id = $1 AND sender_id = users.id)
        OR (status = 2 AND reciever_id = users.id AND sender_id = $1)`
    const params = [ userId ]
    return db.query(query, params).then(results => {
        console.log('db res for getFriends: ', results.rows)
        return results.rows
    }).catch(err => { console.log("err in getting the useeerrrs || db.js || ", err)})
}

module.exports.getUsersByIds = function(arrayOfIds) {
    const query = `SELECT * FROM users WHERE id=ANY($1)`
    return db.query(query, [arrayOfIds]).then(results => {
        console.log('results', results)
        return results.rows
    }).catch(err => { console.log('err in getusersbyid || db.js || ', err) })
}
