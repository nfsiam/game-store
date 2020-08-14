var db = require('./db');

module.exports = {
    validate: function (user, callback) {
        var sql = "select * from user where username=? and password=?";
        db.getResults(sql, [user.uname, user.password], function (result) {
            if (result.length > 0) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },
}

module.exports = {
    validate: (user, cbLoginController) => {
        const sql = "select * from user where username=? and password=?";
        const params = [user.username, user.password];

        //passed to db and called 
        const cbAlluserModel = (result) => {
            if (result.length > 0) {
                console.log(result);
                cbLoginController(result[0].type);
            } else {
                cbLoginController(false);
            }
        };

        db.getResults(sql, params, cbAlluserModel);
    }
}