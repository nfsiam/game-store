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
    deleteComment: function (commentid, callback) {
        var sql = "delete from postcomments where commentid=?";
        db.execute(sql, [commentid], function (status) {
            if (status) {
                var sql2 = "delete from commentvotes where commentid=?";
                db.execute(sql2, [commentid], function (status) {
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
                                        var sql5 = "delete from deletereq where postid=?";
                                        db.execute(sql5, [postid], function (status) {
                                        });
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
            const sql = "select forumpost.postid, forumpost.time, forumpost.posttype, forumpost.gamename, forumpost.username, forumpost.status, postcontent.title, postcontent.body, postcontent.codes, postcontent.fname, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'up') upvote, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'down') downvote, (SELECT reporttype from reports where reporter = ? and postid = ? and reportof = 'post') reporttype  FROM forumpost inner join postcontent on forumpost.postid = postcontent.postid where forumpost.postid = ? and forumpost.posttype = ? and forumpost.status <> 'pending' ";
            db.getResults(sql, [username, postid, postid, type], function (result) {
                if (result.length > 0) {
                    postAndComments.post = result[0];


                    const sql2 = "select postcomments.commentid, postcomments.postid, postcomments.username, postcomments.comment, postcomments.time, (select count(*) from commentvotes cv where cv.commentid = postcomments.commentid AND cv.vote = 'up') upvote, (select count(*) from commentvotes cv where cv.commentid = postcomments.commentid AND cv.vote = 'down') downvote from postcomments where postid = ?";

                    db.getResults(sql2, [postid], function (result) {
                        if (result.length > 0) {
                            postAndComments.comments = result;
                        }
                        // console.log("dddddddddddddddddddddddddddddddddddd", postAndComments);
                        callback(postAndComments);
                    });
                } else {
                    callback(false);
                }
            });
        } else {
            const sql = "select forumpost.postid, forumpost.time, forumpost.posttype, forumpost.gamename, forumpost.username, forumpost.status, postcontent.title, postcontent.body, postcontent.codes, postcontent.fname, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'up') upvote, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'down') downvote, (SELECT reporttype from reports where reporter = ? and postid = ?  and reportof = 'post') reporttype  FROM forumpost inner join postcontent on forumpost.postid = postcontent.postid where forumpost.postid = ? and forumpost.status <> 'pending' ";
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
        const sql = "select forumpost.postid, forumpost.time, forumpost.posttype, forumpost.username, forumpost.gamename, forumpost.status, postcontent.title, postcontent.body,  postcontent.codes, postcontent.fname, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'up') upvote, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'down') downvote FROM forumpost inner join postcontent on forumpost.postid = postcontent.postid where forumpost.postid = ? and forumpost.status = ?";
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
    getDeletePostReqList: (callback) => {
        const sql = "select id, time, username, postid from deletereq where status='pending'";
        db.getResults(sql, null, function (result) {
            callback(result || []);
        });
    },
    createComment: (comment, callback) => {
        const sql = "Insert into postcomments (postid,username,comment,time) values(?,?,?,UNIX_TIMESTAMP())";
        db.operate(sql, [comment.postid, comment.username, comment.comment], function (status) {
            if (!status) {
                callback(false);
            } else {
                const sqlog = `INSERT INTO log(datestamp,commentcreate,username) VALUES (UNIX_TIMESTAMP(),1,?);`;
                db.execute(sqlog, [comment.username], function (status) {
                });
                callback(status.insertId);
            }
        });
    },

    changeStatus: (postid, status, callback) => {
        const sql = "select * from forumpost where postid=? and status=?";
        db.getResults(sql, [postid, status], function (result) {
            if (result.length > 0) {
                const sql2 = "update forumpost set status=? where postid=?";
                db.execute(sql2, ['approved', postid], function (status) {
                    if (status) {
                        callback({ turnedoff: false });
                    } else {
                        callback(false);
                    }
                });
            } else {
                const sql3 = "update forumpost set status=? where postid=?";
                db.execute(sql3, [status, postid], function (status) {
                    if (status) {
                        callback({ turnedoff: true });
                    } else {
                        callback(false);
                    }
                });
            }
        });
    },
    checkStatus: (postid, status, callback) => {
        const sql = "select * from forumpost where postid=? and status=?";
        db.getResults(sql, [postid, status], function (result) {
            if (result.length > 0) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },

    upvotePost: (postid, username, callback) => {
        const sql = "SELECT vote FROM postvotes WHERE postid = ? and username =?";
        db.getResults(sql, [postid, username], function (result) {
            if (result.length > 0) {
                const prevVote = result[0].vote;
                if (prevVote == 'up') {
                    // perform delete vote
                    const sql2 = "delete from postvotes where postid=? and username = ?";
                    db.execute(sql2, [postid, username], function (status) {
                        if (status) {

                            const sqlog = `INSERT INTO log(datestamp,pvote,username) VALUES (UNIX_TIMESTAMP(),1,?);`;
                            db.execute(sqlog, [username], function (status) {
                            });

                            callback({ up: 'minus', down: 'none' });
                        } else {
                            callback(false);
                        }
                    });
                } else if (prevVote == 'down') {
                    //perform update vote
                    const sql2 = "update postvotes set vote = 'up' where username = ? and postid = ?";
                    db.execute(sql2, [username, postid], function (status) {
                        if (status) {

                            const sqlog = `INSERT INTO log(datestamp,pvote,username) VALUES (UNIX_TIMESTAMP(),1,?);`;
                            db.execute(sqlog, [username], function (status) {
                            });
                            callback({ up: 'plus', down: 'minus' });
                        } else {
                            callback(false);
                        }
                    });
                }
            } else {
                const sql3 = "insert into postvotes values(?, ?, ?, ?)";
                db.execute(sql3, ['', postid, username, 'up'], function (status) {
                    if (status) {
                        const sqlog = `INSERT INTO log(datestamp,pvote,username) VALUES (UNIX_TIMESTAMP(),1,?);`;
                        db.execute(sqlog, [username], function (status) {
                        });
                        callback({ up: 'plus', down: 'none' });
                    } else {
                        callback(false);
                    }
                });
            }
        });
    },
    downvotePost: (postid, username, callback) => {
        const sql = "SELECT vote FROM postvotes WHERE postid = ? and username =?";
        db.getResults(sql, [postid, username], function (result) {
            if (result.length > 0) {
                const prevVote = result[0].vote;
                if (prevVote == 'down') {
                    // perform delete vote
                    const sql2 = "delete from postvotes where postid=? and username = ?";
                    db.execute(sql2, [postid, username], function (status) {
                        if (status) {
                            const sqlog = `INSERT INTO log(datestamp,pvote,username) VALUES (UNIX_TIMESTAMP(),1,?);`;
                            db.execute(sqlog, [username], function (status) {
                            });
                            callback({ up: 'none', down: 'minus' });
                        } else {
                            callback(false);
                        }
                    });
                } else if (prevVote == 'up') {
                    //perform update vote
                    const sql2 = "update postvotes set vote = 'down' where username = ? and postid = ?";
                    db.execute(sql2, [username, postid], function (status) {
                        if (status) {
                            const sqlog = `INSERT INTO log(datestamp,pvote,username) VALUES (UNIX_TIMESTAMP(),1,?);`;
                            db.execute(sqlog, [username], function (status) {
                            });
                            callback({ up: 'minus', down: 'plus' });
                        } else {
                            callback(false);
                        }
                    });
                }
            } else {
                const sql3 = "insert into postvotes values(?, ?, ?, ?)";
                db.execute(sql3, ['', postid, username, 'down'], function (status) {
                    if (status) {
                        const sqlog = `INSERT INTO log(datestamp,pvote,username) VALUES (UNIX_TIMESTAMP(),1,?);`;
                        db.execute(sqlog, [username], function (status) {
                        });
                        callback({ up: 'none', down: 'plus' });
                    } else {
                        callback(false);
                    }
                });
            }
        });
    },
    upvoteComment: (commentid, username, callback) => {
        const sql = "SELECT vote FROM commentvotes WHERE commentid = ? and username =?";
        db.getResults(sql, [commentid, username], function (result) {
            if (result.length > 0) {
                const prevVote = result[0].vote;
                if (prevVote == 'up') {
                    // perform delete vote
                    const sql2 = "delete from commentvotes where commentid=? and username = ?";
                    db.execute(sql2, [commentid, username], function (status) {
                        if (status) {
                            const sqlog = `INSERT INTO log(datestamp,cvote,username) VALUES (UNIX_TIMESTAMP(),1,?);`;
                            db.execute(sqlog, [username], function (status) {
                            });
                            callback({ up: 'minus', down: 'none' });
                        } else {
                            callback(false);
                        }
                    });
                } else if (prevVote == 'down') {
                    //perform update vote
                    const sql2 = "update commentvotes set vote = 'up' where username = ? and commentid = ?";
                    db.execute(sql2, [username, commentid], function (status) {
                        if (status) {
                            const sqlog = `INSERT INTO log(datestamp,cvote,username) VALUES (UNIX_TIMESTAMP(),1,?);`;
                            db.execute(sqlog, [username], function (status) {
                            });
                            callback({ up: 'plus', down: 'minus' });
                        } else {
                            callback(false);
                        }
                    });
                }
            } else {
                const sql3 = "insert into commentvotes values(?, ?, ?, ?)";
                db.execute(sql3, ['', commentid, username, 'up'], function (status) {
                    if (status) {
                        const sqlog = `INSERT INTO log(datestamp,cvote,username) VALUES (UNIX_TIMESTAMP(),1,?);`;
                        db.execute(sqlog, [username], function (status) {
                        });
                        callback({ up: 'plus', down: 'none' });
                    } else {
                        callback(false);
                    }
                });
            }
        });
    },
    downvoteComment: (commentid, username, callback) => {
        const sql = "SELECT vote FROM commentvotes WHERE commentid = ? and username =?";
        db.getResults(sql, [commentid, username], function (result) {
            if (result.length > 0) {
                const prevVote = result[0].vote;
                if (prevVote == 'down') {
                    // perform delete vote
                    const sql2 = "delete from commentvotes where commentid=? and username = ?";
                    db.execute(sql2, [commentid, username], function (status) {
                        if (status) {
                            const sqlog = `INSERT INTO log(datestamp,cvote,username) VALUES (UNIX_TIMESTAMP(),1,?);`;
                            db.execute(sqlog, [username], function (status) {
                            });
                            callback({ up: 'none', down: 'minus' });
                        } else {
                            callback(false);
                        }
                    });
                } else if (prevVote == 'up') {
                    //perform update vote
                    const sql2 = "update commentvotes set vote = 'down' where username = ? and commentid = ?";
                    db.execute(sql2, [username, commentid], function (status) {
                        if (status) {
                            const sqlog = `INSERT INTO log(datestamp,cvote,username) VALUES (UNIX_TIMESTAMP(),1,?);`;
                            db.execute(sqlog, [username], function (status) {
                            });
                            callback({ up: 'minus', down: 'plus' });
                        } else {
                            callback(false);
                        }
                    });
                }
            } else {
                const sql3 = "insert into commentvotes values(?, ?, ?, ?)";
                db.execute(sql3, ['', commentid, username, 'down'], function (status) {
                    if (status) {
                        const sqlog = `INSERT INTO log(datestamp,cvote,username) VALUES (UNIX_TIMESTAMP(),1,?);`;
                        db.execute(sqlog, [username], function (status) {
                        });
                        callback({ up: 'none', down: 'plus' });
                    } else {
                        callback(false);
                    }
                });
            }
        });
    }

}