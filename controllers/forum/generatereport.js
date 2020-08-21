const express = require('express');
const moment = require('moment');
const moderateModel = require.main.require('./models/forum/moderateModel');
const postFormatter = require('./postFormatter');
const forumModel = require('../../models/forum/forumModel');
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const fs = require('fs')

const forumposts = require.main.require('./models/forum/forumposts');
const router = express.Router();


router.get('*', function (req, res, next) {
    if (req.cookies['user'] == null) {
        res.redirect('/login');
    } else {
        if (req.cookies['user'].role == 'moderator' || req.cookies['user'].role == 'admin') {
            next();
        } else {
            res.redirect('/forum');
        }
    }
});


router.get("/", (req, res) => {
    forumModel.getReport((result) => {
        if (result.length > 0) {
            const pendingCount = result[0].pendingCount;
            const postReports = result[0].postReports;
            const commentReports = result[0].commentReports;
            const deletePostReqs = result[0].deletePostReqs;
            const deleteCommentReqs = result[0].deleteCommentReqs;
            const mutedUsers = result[0].mutedUsers;
            const allUsers = result[0].allUsers;

            const user = req.cookies['user'].username;
            const dtime = moment().format('MM/DD/YYYY hh:mm:ss a');


            dres = { pendingCount, postReports, commentReports, deletePostReqs, deleteCommentReqs, mutedUsers, allUsers, user, dtime };

            ejs.renderFile(path.join(path.dirname(require.main.filename), '/views/forum/', "report-template.ejs"), dres, (err, data) => {
                if (err) {
                    res.send(err);
                } else {
                    let options = {
                        "height": "11.25in",
                        "width": "8.5in",
                        "header": {
                            "height": "20mm"
                        },
                        "footer": {
                            "height": "20mm",
                        },
                    };
                    const tp = path.join(path.dirname(require.main.filename), '/storage/fr/', 'report.pdf');

                    pdf.create(data, options).toFile(tp, function (err, data) {
                        if (err) {
                            res.send(err);
                        } else {
                            var datafile = fs.readFileSync(tp);
                            res.header('content-type', 'application/pdf');
                            res.set("Content-Disposition", "attachment;filename=report.pdf");
                            res.send(datafile);
                        }
                    });
                }
            });
        }
    });
})


module.exports = router;