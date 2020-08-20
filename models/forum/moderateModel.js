var db = require.main.require('./models/db');

module.exports = {
    getModerateCounts: (callback) => {
        const sql = "SELECT  (SELECT COUNT(*) FROM   forumpost where status=?) AS pendingCount, (SELECT COUNT(*) FROM  reports where status=? and reportof = ?) AS postReports, (SELECT COUNT(*) FROM  reports where status=? and reportof = ?) AS commentReports, (SELECT COUNT(*) FROM  deletereq where status=? and deleteof = ?) AS deletePostReqs , (SELECT COUNT(*) FROM  mutedusers) AS mutedUsers, (SELECT COUNT(*) FROM  alluser where role='enduser' or role='publisher') as allUsers FROM dual";
        db.getResults(sql, ['pending', 'pending', 'post', 'pending', 'comment', 'pending', 'post'], function (result) {
            callback(result || []);
        });
    },
    getActivity: (callback) => {
        const sql = "SELECT DISTINCT FROM_UNIXTIME(datestamp,'%d/%M/%Y') AS day, SUM(issuecreate)+SUM(reviewcreate)+SUM(walkthroughcreate) as postcreate, SUM(reportpost)+SUM(reportcomment) as report, SUM(deletereqpost)+SUM(deletereqcomment) as delreq, SUM(pvote)+SUM(cvote) as votes FROM log WHERE FROM_UNIXTIME(datestamp) >= CURDATE() - INTERVAL 15 Day GROUP by day order by day";
        db.getResults(sql, null, function (result) {
            if (result.length > 0) {
                const activity = { log: result };
                const sql2 = "select (select COUNT(postid) from forumpost where posttype = 'issue') issuecount, (select COUNT(postid) from forumpost where posttype = 'review') reviewcount,(select COUNT(postid) from forumpost where posttype = 'walkthrough') walkthroughcount from forumpost";
                db.getResults(sql2, null, function (result) {
                    if (result.length > 0) {
                        activity["counts"] = result[0];
                        callback(activity);
                    } else {
                        callback(false);
                    }
                });
            } else {
                callback(false);
            }
        });
    },
    getPostReports: (callback) => {
        const sql = "SELECT * from reports where status=? and reportof = ?";
        db.getResults(sql, ['pending', 'post'], function (result) {
            callback(result || []);
        });
    },
    getCommentReports: (callback) => {
        const sql = "SELECT * from reports where status=? and reportof = ?";
        db.getResults(sql, ['pending', 'comment'], function (result) {
            callback(result || []);
        });
    }
}