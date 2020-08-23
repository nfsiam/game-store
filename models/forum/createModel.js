var db = require.main.require('./models/db');

module.exports = {

    getOwnedGames: (username, callback) => {
        const sql = "select library.id, library.gameid, (select gamelist.gametitle from gamelist gl where gl.gameid = library.gameid ) title FROM library inner join gamelist on library.gameid = gamelist.gameid WHERE username =?";
        db.getResults(sql, [username], function (result) {
            callback(result || []);
        });
    },

    createPost: (post, callback) => {
        const sql = "Insert into forumpost(posttype,gamename,time,username) values(?,?,UNIX_TIMESTAMP(),?)";
        db.operate(sql, [post.type, post.gamename, post.username], function (status) {
            if (!status) {
                callback(false);
            } else {
                const postid = status.insertId;
                const sql2 = "INSERT INTO postcontent(postid,title,body,codes,fname) VALUES (?,?,?,?,?);";
                db.execute(sql2, [postid, post.title, post.body, post.codes, post.fname], function (status) {
                    if (status) {
                        const sqlog = `INSERT INTO log(datestamp,${post.type}create,username) VALUES (UNIX_TIMESTAMP(),1,?);`;
                        db.execute(sqlog, [post.username], function (status) {
                        });
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            }
        });
    },

}