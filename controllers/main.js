
const post = require('../models/post');
const Post = require('../models/post');

exports.getMainPage = (req,res ,next) => {
    Post.find()
        .then(posts => {        
        res.render('main', {
            pageTitle: 'Home Page',
            path: '/',   
            posts:posts ,
        });
    })
};

exports.getTeam = (req,res ,next) => {
    res.render('team', {
        pageTitle: 'Team',
        path: '/team'      
    });
}

exports.getStaff = (req,res ,next) => {
    res.render('staff', {
        pageTitle: 'Staff',
        path: '/staff',  
             
    });
}

exports.getNews = (req,res ,next) => {
    Post.find()
        .then(posts => {
        res.render('news', {
            pageTitle: 'News',
            path: '/news',      
            posts: posts,         
        });
    })
    .catch(err => console.log(err));  
};

exports.getContact = (req,res ,next) => {
    res.render('contact', {
        pageTitle: 'Contact',
        path: '/contact',     
    });
}

exports.getLatestNews = (req, res, next) => {
const newsId = req.params.newsId;
Post.findById(newsId)
    .then(news => {
        if (!news) {
            req.flash('error', "There are no posts with the provided ID");    
        }
        res.render('news-single-post', {
            pageTitle: news.title,
            path: '/latest-news',
            news: news,
            isAuthenticated: req.session.isLoggedIn,
            isAdmin: req.session.session.user    
        });
    })
    .catch(err => {
        console.error(err);
        req.flash('error', "An error occurred while fetching the post");           
    })
}; 


exports.getNewsDetails = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            if (!post) {
                req.flash('error', "There are no posts with the provided ID");    
            }
            res.render('news-details', {
                pageTitle: 'News Details',
                path: '/news-details',
                post: post      
            });
        })
        .catch(err => {
            console.error(err);
            req.flash('error', "An error occurred while fetching the post");           
        });
};


/* 
exports.getNewsDetails = (req, res, next) => {
    const imgId = req.params.imgId;

  
            res.render('includes/single-gallery', {
                pageTitle: 'Gallery Details',
                path: '/gallery',
                  
            });
};


exports.getGallery = (req,res ,next) => {
    res.render('gallery', {
        pageTitle: 'Gallery',
        path: '/gallery',     
    });
}
 */