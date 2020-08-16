const moment = require('moment');
const forumposts = require.main.require('./models/forum/forumposts');

const formatPost = (data, callback) => {
    const rsym = "fas fa-check-circle";
    const pwc = data.postWithComments;

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

    callback({
        post: pwc.post,
        comments: pwc.comments,
        user: data.user,
        reported_post: ''
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
        forumposts.getPost(obj.user.username, obj.postid, obj.type, (postWithComments) => {
            console.log(postWithComments);

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
    }
}