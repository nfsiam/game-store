var db = require.main.require('./models/db');
const moment = require('moment');

module.exports = {

    get: function (id, callback) {
        var sql = "select * from user where id=?";
        db.getResults(sql, [id], function (result) {
            if (result.length > 0) {
                callback(result[0]);
            } else {
                callback([]);
            }
        });
    },

    reportPost: function (report, callback) {
        const sql = "SELECT COUNT(*) as count FROM reports WHERE reporter = ? and postid = ? and reportof =?";
        db.getResults(sql, [report.reporter, report.postid, report.reportof], function (result) {
            // console.log(result[0].count);
            if (result[0].count > 0) {
                var sql2 = "update reports set reporttime = ?, reporttype = ?, status = ? where postid = ? and reporter = ?";
                db.execute(sql2, [moment().unix(), report.reporttype, 'pending', report.postid, report.reporter], function (status) {
                    if (status) {
                        // console.log(status);
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            } else {
                var sql3 = "insert into reports values(?, ?, ?, ?, ?, ? ,? ,?)";
                db.execute(sql3, ['', report.reportof, report.postid, null, report.reporter, moment().unix(), report.reporttype, 'pending'], function (status) {
                    if (status) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            }
        });
    },
    reportComment: function (report, callback) {
        const sql = "SELECT COUNT(*) as count FROM reports WHERE reporter = ? and postid = ? and commentid = ? and reportof =?";
        db.getResults(sql, [report.reporter, report.postid, report.commentid, report.reportof], function (result) {
            // console.log('############################');

            if (result[0].count > 0) {
                var sql2 = "update reports set reporttime = ?, reporttype = ?, status = ? where postid = ? and commentid= ? and reporter = ?";
                db.execute(sql2, [moment().unix(), report.reporttype, 'pending', report.postid, report.commentid, report.reporter], function (status) {
                    if (status) {
                        // console.log(status);
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            } else {
                var sql3 = "insert into reports values(?, ?, ?, ?, ?, ? ,? ,?)";
                db.execute(sql3, ['', report.reportof, report.postid, report.commentid, report.reporter, moment().unix(), report.reporttype, 'pending'], function (status) {
                    if (status) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            }
        });
    },

    reqDeleteComment: (postid, commentid, username, callback) => {
        const sql = "SELECT * FROM deletereq WHERE postid = ? and commentid=? and deleteof=? and username = ? and status = ?";
        db.getResults(sql, [postid, commentid, 'comment', username, 'pending'], function (result) {
            if (result.length > 0) {
                if (result[0].username == username) {
                    const sql2 = "delete from deletereq where postid=? and commentid=? and deleteof=? and username = ? and status =?";
                    db.execute(sql2, [postid, commentid, 'comment', username, 'pending'], function (status) {
                        if (status) {
                            console.log("here in cancel true");
                            callback({ cancel: true });
                        } else {
                            callback(false);
                        }
                    });
                }
            } else {
                const sql3 = "insert into deletereq values(?, UNIX_TIMESTAMP(), ?, ?, ?,?,?)";
                db.execute(sql3, [null, username, 'comment', postid, commentid, 'pending'], function (status) {
                    if (status) {
                        callback({ requested: true });
                    } else {
                        callback(false);
                    }
                });
            }
        });
    },
    checkReqDeleteComment: (postid, commentid, username, callback) => {
        const sql = "SELECT * FROM deletereq WHERE postid = ? and commentid=? and deleteof=? and username = ? and status = ?";
        db.getResults(sql, [postid, commentid, 'comment', username, 'pending'], function (result) {
            if (result.length > 0) {
                callback({ requested: true });
            } else {
                callback({ requested: false });
            }
        });
    },

    reqDeletePost: (postid, username, callback) => {
        const sql = "SELECT * FROM deletereq WHERE postid = ? and deleteof=? and username = ? and status = ?";
        db.getResults(sql, [postid, 'post', username, 'pending'], function (result) {
            if (result.length > 0) {
                if (result[0].username == username) {
                    const sql2 = "delete from deletereq where postid=? and deleteof=? and username = ? and status = ?";
                    db.execute(sql2, [postid, 'post', username, 'pending'], function (status) {
                        if (status) {
                            callback({ cancel: true });
                        } else {
                            callback(false);
                        }
                    });
                }
            } else {
                const sql3 = "insert into deletereq values(?, UNIX_TIMESTAMP(), ?, ?, ?,?,?)";
                db.execute(sql3, [null, username, 'post', postid, null, 'pending'], function (status) {
                    if (status) {
                        callback({ requested: true });
                    } else {
                        callback(false);
                    }
                });
            }
        });
    },

    checkReqDeletePost: (postid, username, callback) => {
        const sql = "SELECT * FROM deletereq WHERE postid = ? and deleteof=? and username = ? and status = ?";
        db.getResults(sql, [postid, 'post', username, 'pending'], function (result) {
            if (result.length > 0) {
                callback({ requested: true });
            } else {
                callback({ requested: false });
            }
        });
    },
    muteUser: (username, callback) => {
        const sql = "SELECT * FROM mutedusers WHERE username = ?";
        db.getResults(sql, [username], function (result) {
            if (result.length > 0) {
                const sql2 = "delete from mutedusers where username = ?";
                db.execute(sql2, [username], function (status) {
                    if (status) {
                        callback({ muted: false });
                    } else {
                        callback(false);
                    }
                });
            } else {
                const sql3 = "insert into mutedusers values(?,?, UNIX_TIMESTAMP())";
                db.execute(sql3, ['', username], function (status) {
                    if (status) {
                        callback({ muted: true });
                    } else {
                        callback(false);
                    }
                });
            }
        });
    },
    checkMutedUser: (username, callback) => {
        const sql = "SELECT * FROM mutedusers WHERE username = ?";
        db.getResults(sql, [username], function (result) {
            if (result.length > 0) {
                callback({ muted: true });
            } else {
                callback({ muted: false });
            }
        });
    },
    getMutedUserList: (callback) => {
        const sql = "SELECT * FROM mutedusers";
        db.getResults(sql, null, function (result) {
            if (result.length > 0) {
                callback(result);
            } else {
                callback([]);
            }
        });
    },
    getAllUserList: (callback) => {
        const sql = "select alluser.username, alluser.role, (SELECT COUNT(*) from mutedusers where username =alluser.username) muted, (SELECT count(*) from forumpost where username = alluser.username) postcount, (SELECT count(*) from postcomments where username=alluser.username) commentcount, (SELECT count(*) from postvotes where username=alluser.username) pvcount, (SELECT count(*) from commentvotes where username=alluser.username) cvcount from alluser ORDER by username";
        db.getResults(sql, null, function (result) {
            if (result.length > 0) {
                callback(result);
            } else {
                callback([]);
            }
        });
    },

    // getAll: function (callback) {
    //     var sql = "select * from user";
    //     db.getResults(sql, null, function (result) {
    //         if (result.length > 0) {
    //             callback(result);
    //         } else {
    //             callback([]);
    //         }
    //     });
    // },
    getLandingPosts: (callback) => {
        const landingPosts = [];
        const sql = "select forumpost.postid, forumpost.time, forumpost.posttype, forumpost.gamename, postcontent.title, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'up') upvote, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'down') downvote FROM forumpost inner join postcontent on forumpost.postid = postcontent.postid where forumpost.posttype = 'issue' and forumpost.status <> 'pending' order by postid desc limit 3";
        db.getResults(sql, null, function (result) {
            landingPosts.push(result);
            const sql2 = "select forumpost.postid, forumpost.time, forumpost.posttype, forumpost.gamename, postcontent.title, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'up') upvote, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'down') downvote FROM forumpost inner join postcontent on forumpost.postid = postcontent.postid where forumpost.posttype = 'review' and forumpost.status <> 'pending' order by postid desc limit 3";
            db.getResults(sql2, null, function (result) {
                landingPosts.push(result);
                const sql3 = "select forumpost.postid, forumpost.time, forumpost.posttype, forumpost.gamename, postcontent.title, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'up') upvote, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'down') downvote FROM forumpost inner join postcontent on forumpost.postid = postcontent.postid where forumpost.posttype = 'walkthrough' and forumpost.status <> 'pending' order by postid desc limit 3";
                db.getResults(sql3, null, function (result) {
                    landingPosts.push(result);
                    callback(landingPosts);
                });
            });
        });
    },

    // validate: function (user, callback) {
    //     var sql = "select * from user where username=? and password=?";
    //     db.getResults(sql, [user.uname, user.password], function (result) {
    //         if (result.length > 0) {
    //             callback(true);
    //         } else {
    //             callback(false);
    //         }
    //     });
    // },

    // insert: function (user, callback) {
    //     var sql = "insert into user values(?, ?, ?, ?)";

    //     db.execute(sql, ['', user.uname, user.password, user.type], function (status) {
    //         if (status) {
    //             callback(true);
    //         } else {
    //             callback(false);
    //         }
    //     });
    // },

    // update: function (user, callback) {
    //     var sql = "update user set username=?, password=?, type=? where id=?";
    //     db.execute(sql, [user.uname, user.password, user.type, user.id], function (status) {
    //         if (status) {
    //             callback(true);
    //         } else {
    //             callback(false);
    //         }
    //     });
    // },

    // delete: function (id, callback) {
    //     var sql = "delete from user where id=?";
    //     db.execute(sql, [id], function (status) {
    //         if (status) {
    //             callback(true);
    //         } else {
    //             callback(false);
    //         }
    //     });
    // }
}