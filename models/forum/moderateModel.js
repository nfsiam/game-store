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
    getModerateCounts: (callback) => {
        const sql = "SELECT  (SELECT COUNT(*) FROM   forumpost where status=?) AS pendingCount, (SELECT COUNT(*) FROM  reports where status=? and reportof = ?) AS postReports, (SELECT COUNT(*) FROM  reports where status=? and reportof = ?) AS commentReports FROM dual";
        db.getResults(sql, ['pending', 'pending', 'post', 'pending', 'comment'], function (result) {
            callback(result || []);
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