const moment = require('moment');
const forumposts = require.main.require('./models/forum/forumposts');

const formatPost = (data, callback) => {
    const rsym = "fas fa-check-circle";
    const pwc = data.postWithComments;

    // console.log("---------------------------------------------------------------------------------------------------------------------------");
    // console.log(pwc.comments);
    // console.log("---------------------------------------------------------------------------------------------------------------------------");

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

    // for (let k = 0; k < pwc.comments.length; k++) {
    //     pwc.comments[k]["reportSpam"] = "";
    //     pwc.comments[k]["reportDuplicate"] = "";
    //     pwc.comments[k]["reportOther"] = "";

    //     if (pwc.comments[k].commentid == pwc.comments[k].cid) {

    //         if (pwc.comments[k].reporttype == 'spam') {
    //             pwc.comments[k]["reportSpam"] = rsym;
    //         } else if (pwc.comments[k].reporttype == 'duplicate') {
    //             pwc.comments[k]["reportDuplicate"] = rsym;
    //         } else if (pwc.comments[k].reporttype == 'other') {
    //             pwc.comments[k]["reportOther"] = rsym;
    //         }
    //     }
    // }
    // console.log({
    //     post: pwc.post,
    //     comments: pwc.comments,
    //     user: data.user,
    //     reported_post: ''
    // });
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
    }
}