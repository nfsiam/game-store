const moment = require('moment');
const forumModel = require('../../models/forum/forumModel');
const forumposts = require.main.require('./models/forum/forumposts');

const formatPost = (data, callback) => {
    const rsym = "fas fa-check-circle";
    const pwc = data.postWithComments;
    // console.log(data.username);
    forumModel.checkMutedUser(data.user.username, (result) => {
        // console.log(result);
        pwc.post["reportSpam"] = "";
        pwc.post["reportDuplicate"] = "";
        pwc.post["reportWrongCategory"] = "";
        pwc.post["reportOther"] = "";

        if (pwc.post.reporttype == 'spam') {
            pwc.post["reportSpam"] = rsym;
        } else if (pwc.post.reporttype == 'duplicate') {
            pwc.post["reportDuplicate"] = rsym;
        } else if (pwc.post.reporttype == 'wrongcategory') {
            pwc.post["reportWrongCategory"] = rsym;
        } else if (pwc.post.reporttype == 'other') {
            pwc.post["reportOther"] = rsym;
        }

        if (result.muted == true) {
            callback({
                post: pwc.post,
                comments: pwc.comments,
                user: data.user,
                reported_post: '',
                muted: true
            });
        } else {
            callback({
                post: pwc.post,
                comments: pwc.comments,
                user: data.user,
                reported_post: '',
                muted: false
            });
        }
    });


};

const formatPosts = (data, callback) => {
    const posts = data.posts;
    for (let j = 0; j < posts.length; j++) {
        const element = posts[j];
        const t = posts[j]['time'];
        posts[j]['time'] = moment.unix(t).format("MM/DD/YYYY hh:mm:ss a");
    }
    callback(data);
};


module.exports = {
    getPost: (obj, callback) => {
        forumposts.getPost(obj.user.username, parseInt(obj.postid), obj.type, (postWithComments) => {
            // console.log("kkkkkkkkkkkkkkkkkkkkkkkkkk");
            // console.log(postWithComments.post.fname);

            if (!postWithComments) {
                callback(false);
            } else {
                formatPost({
                    postWithComments,
                    user: obj.user,
                }, (data) => {
                    callback(data);
                });
            }
        });
    },
    getAllPost: (obj, callback) => {
        forumposts.getAllPost(obj.type, (posts) => {
            formatPosts({
                posts,
                user: obj.user,
                breadcumb: obj.type + 's'

            }, (formattedData) => {
                // console.log(formattedData);
                // res.render('forum/issues', formattedData);
                callback(formattedData);
            })
        });
    },
    getSearchPosts: (obj, callback) => {
        // console.log(obj);
        forumposts.getSearchPosts(obj.key, obj.type, (posts) => {
            formatPosts({
                posts,
                user: obj.user,
                breadcumb: 'search'

            }, (formattedData) => {
                // console.log(formattedData);
                // res.render('forum/issues', formattedData);
                callback(formattedData);
            })
        });
    }
}