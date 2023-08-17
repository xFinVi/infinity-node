exports.getMainPage = (req,res ,next) => {
    res.render('main', {
        pageTitle: 'Home Page',
        path: '/',        
    });
}

exports.getTeam = (req,res ,next) => {
    res.render('team', {
        pageTitle: 'Team',
        path: '/team',        
    });
}

exports.getStaff = (req,res ,next) => {
    res.render('staff', {
        pageTitle: 'Staff',
        path: '/staff',        
    });
}
exports.getNews = (req,res ,next) => {
    res.render('news', {
        pageTitle: 'News',
        path: '/news',        
    });
}
exports.getGallery = (req,res ,next) => {
    res.render('gallery', {
        pageTitle: 'Gallery',
        path: '/gallery',        
    });
}
exports.getContact = (req,res ,next) => {
    res.render('contact', {
        pageTitle: 'Contact',
        path: '/contact',        
    });
}