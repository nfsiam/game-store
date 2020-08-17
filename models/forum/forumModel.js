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
            console.log(result[0].count);
            if (result[0].count > 0) {
                var sql2 = "update reports set reporttime = ?, reporttype = ?, status = ? where postid = ? and reporter = ?";
                db.execute(sql2, [moment().unix(), report.reporttype, 'pending', report.postid, report.reporter], function (status) {
                    if (status) {
                        console.log(status);
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
            console.log('############################');

            if (result[0].count > 0) {
                var sql2 = "update reports set reporttime = ?, reporttype = ?, status = ? where postid = ? and commentid= ? and reporter = ?";
                db.execute(sql2, [moment().unix(), report.reporttype, 'pending', report.postid, report.commentid, report.reporter], function (status) {
                    if (status) {
                        console.log(status);
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