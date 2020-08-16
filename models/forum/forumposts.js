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
    getAllPost: (type, callback) => {
        const sql = "select forumpost.postid, forumpost.time, forumpost.posttype, forumpost.gamename,  forumpost.status, postcontent.title, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'up') upvote, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'down') downvote FROM forumpost inner join postcontent on forumpost.postid = postcontent.postid where forumpost.posttype = ? and forumpost.status = 'approved' order by postid desc";
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
    getPost: (username, postid, type, callback) => {
        const postAndComments = {
            post: [],
            comments: []
        };
        const sql = "select forumpost.postid, forumpost.time, forumpost.posttype, forumpost.gamename, forumpost.username, forumpost.status, postcontent.title, postcontent.body, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'up') upvote, (select count(*) from postvotes pv where pv.postid = forumpost.postid AND pv.vote = 'down') downvote, (SELECT reporttype from reports where reporter = ? and postid = ?) reporttype  FROM forumpost inner join postcontent on forumpost.postid = postcontent.postid where forumpost.postid = ? and forumpost.posttype = ? and forumpost.status= 'approved' ";
        db.getResults(sql, [username, postid, postid, type], function (result) {
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

            // callback(result[0] || false);
        });
    },
    getPendingPosts: (callback) => {
        const sql = "select forumpost.postid, forumpost.time, forumpost.posttype, forumpost.username, forumpost.gamename, postcontent.title FROM forumpost inner join postcontent on forumpost.postid = postcontent.postid where status = 'pending' order by postid desc";
        db.getResults(sql, null, function (result) {
            callback(result || []);
        });
    },

    getPendingPost: (postid, type, callback) => {
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