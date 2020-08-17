var db = require.main.require('./models/db');

module.exports = {

    // get: function (id, callback) {
    //     var sql = "select * from user where id=?";
    //     db.getResults(sql, [id], function (result) {
    //         if (result.length > 0) {
    //             callback(result[0]);
    //         } else {
    //             callback([]);
    //         }
    //     });
    // },

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
    turnoffPost: function (postid, callback) {

    },
    deletePost: function (postid, callback) {
        var sql = "delete from forumpost where postid=?";
        db.execute(sql, [postid], function (status) {
            if (status) {
                var sql2 = "delete from postcontent where postid=?";
                db.execute(sql2, [postid], function (status) {
                    if (status) {
                        var sql3 = "delete from postcomments where postid=?";
                        db.execute(sql3, [postid], function (status) {
                            if (status) {
                                var sql4 = "delete from reports where postid=?";
                                db.execute(sql4, [postid], function (status) {
                                    if (status) {
                                        callback(true);
                                    } else {
                                        callback(false);
                                    }
                                });
                            } else {
                                callback(false);
                            }
                        });
                    } else {
                        callback(false);
                    }
                });
            } else {
                callback(false);
            }
        });
    },
    getAllPost: (type, callback) => {
        const sql = "select forumpost.postid, forumpost.time, forumpost.posttype, forumpost.gamename,  forumpost.status, postcontent.title, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'up') upvote, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'down') downvote FROM forumpost inner join postcontent on forumpost.postid = postcontent.postid where forumpost.posttype = ? and forumpost.status <> 'pending' order by postid desc";
        db.getResults(sql, [type], function (result) {
            callback(result || []);
        });
    },
    getAllIssues: (callback) => {
        const sql = "select forumpost.postid, forumpost.time, forumpost.posttype, forumpost.gamename,  forumpost.status, postcontent.title, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'up') upvote, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'down') downvote FROM forumpost inner join postcontent on forumpost.postid = postcontent.postid where forumpost.posttype = 'issue' order by postid desc";
        db.getResults(sql, null, function (result) {
            callback(result || []);
        });
    },
    getAllReviews: (callback) => {
        const sql = "select forumpost.postid, forumpost.time, forumpost.posttype, forumpost.gamename,  forumpost.status, postcontent.title, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'up') upvote, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'down') downvote FROM forumpost inner join postcontent on forumpost.postid = postcontent.postid where forumpost.posttype = 'review' order by postid desc";
        db.getResults(sql, null, function (result) {
            callback(result || []);
        });
    },
    getAllWalkthroughs: (callback) => {
        const sql = "select forumpost.postid, forumpost.time, forumpost.posttype, forumpost.gamename,  forumpost.status, postcontent.title, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'up') upvote, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'down') downvote FROM forumpost inner join postcontent on forumpost.postid = postcontent.postid where forumpost.posttype = 'walkthrough' order by postid desc";
        db.getResults(sql, null, function (result) {
            callback(result || []);
        });
    },
    getPost: (username, postid, type = '', callback) => {
        const postAndComments = {
            post: [],
            comments: []
        };
        if (type != '') {
            const sql = "select forumpost.postid, forumpost.time, forumpost.posttype, forumpost.gamename, forumpost.username, forumpost.status, postcontent.title, postcontent.body, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'up') upvote, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'down') downvote, (SELECT reporttype from reports where reporter = ? and postid = ? and reportof = 'post') reporttype  FROM forumpost inner join postcontent on forumpost.postid = postcontent.postid where forumpost.postid = ? and forumpost.posttype = ? and forumpost.status <> 'pending' ";
            db.getResults(sql, [username, postid, postid, type], function (result) {
                if (result.length > 0) {
                    postAndComments.post = result[0];


                    const sql2 = "select postcomments.commentid, postcomments.postid, postcomments.username, postcomments.comment, postcomments.time, (select count(*) from commentvotes cv where cv.commentid = postcomments.commentid AND cv.vote = 'up') upvote, (select count(*) from commentvotes cv where cv.commentid = postcomments.commentid AND cv.vote = 'down') downvote from postcomments where postid = ?";

                    db.getResults(sql2, [postid], function (result) {
                        if (result.length > 0) {
                            postAndComments.comments = result;
                        }
                        console.log("dddddddddddddddddddddddddddddddddddd", postAndComments);
                        callback(postAndComments);
                    });
                } else {
                    callback(false);
                }
            });
        } else {
            const sql = "select forumpost.postid, forumpost.time, forumpost.posttype, forumpost.gamename, forumpost.username, forumpost.status, postcontent.title, postcontent.body, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'up') upvote, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'down') downvote, (SELECT reporttype from reports where reporter = ? and postid = ?  and reportof = 'post') reporttype  FROM forumpost inner join postcontent on forumpost.postid = postcontent.postid where forumpost.postid = ? and forumpost.status <> 'pending' ";
            db.getResults(sql, [username, postid, postid], function (result) {
                if (result.length > 0) {
                    postAndComments.post = result[0];

                    const sql2 = "select postcomments.commentid, postcomments.postid, postcomments.username, postcomments.comment, postcomments.time, (select count(*) from commentvotes cv where cv.commentid = postcomments.commentid AND cv.vote = 'up') upvote, (select count(*) from commentvotes cv where cv.commentid = postcomments.commentid AND cv.vote = 'down') downvote from postcomments where postid = ?;";
                    db.getResults(sql2, [postid], function (result) {
                        if (result.length > 0) {
                            postAndComments.comments = result;
                        }
                        callback(postAndComments);
                    });
                } else {
                    callback(false);
                }
            });
        }
    },
    getPendingPosts: (callback) => {
        const sql = "select forumpost.postid, forumpost.time, forumpost.posttype, forumpost.username, forumpost.gamename, postcontent.title FROM forumpost inner join postcontent on forumpost.postid = postcontent.postid where status = 'pending' order by postid desc";
        db.getResults(sql, null, function (result) {
            callback(result || []);
        });
    },

    getPendingPost: (postid, callback) => {
        const postAndComments = {
            post: [],
            comments: []
        };
        const sql = "select forumpost.postid, forumpost.time, forumpost.posttype, forumpost.gamename, forumpost.status, postcontent.title, postcontent.body, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'up') upvote, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'down') downvote FROM forumpost inner join postcontent on forumpost.postid = postcontent.postid where forumpost.postid = ? and forumpost.status = ?";
        db.getResults(sql, [postid, 'pending'], function (result) {
            if (result.length > 0) {
                postAndComments.post = result[0];
                callback(postAndComments);
            } else {
                callback(false);
            }

            // callback(result[0] || false);
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

    changeStatus: (postid, decision, callback) => {
        const sql = "update forumpost set status=? where postid=?";
        db.execute(sql, [decision, postid], function (status) {
            if (status) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },

    upvotePost: (postid, username, callback) => {
        const sql = "SELECT COUNT(*) as count FROM postvotes WHERE postid = ? and username =?";
        db.getResults(sql, [postid, username], function (result) {
            console.log(result[0].count);
            if (result[0].count > 0) {
                var sql2 = "update postvotes set vote = 'up' where username = ? and postid = ?";
                db.execute(sql2, [username, postid], function (status) {
                    if (status) {
                        console.log(status);
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            } else {
                var sql3 = "insert into postvotes values(?, ?, ?, ?)";
                db.execute(sql3, ['', postid, username, 'up'], function (status) {
                    if (status) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            }
        });
    },
    downvotePost: (postid, username, callback) => {
        const sql = "SELECT COUNT(*) as count FROM postvotes WHERE postid = ? and username =?";
        db.getResults(sql, [postid, username], function (result) {
            console.log(result[0].count);
            if (result[0].count > 0) {
                var sql2 = "update postvotes set vote = 'down' where username = ? and postid = ?";
                db.execute(sql2, [username, postid], function (status) {
                    if (status) {
                        console.log(status);
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            } else {
                var sql3 = "insert into postvotes values(?, ?, ?, ?)";
                db.execute(sql3, ['', postid, username, 'down'], function (status) {
                    if (status) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            }
        });
    }


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