exports.getMainPage = (req,res ,next) => {
    res.render('main', {
        pageTitle: 'Home Page',
        path: '/', 
        isAuthenticated: false,       
    });
}

exports.getTeam = (req,res ,next) => {
    res.render('team', {
        pageTitle: 'Team',
        path: '/team', 
        isAuthenticated: false,       
    });
}

exports.getStaff = (req,res ,next) => {
    res.render('staff', {
        pageTitle: 'Staff',
        path: '/staff',  
        isAuthenticated: false,      
    });
}
exports.getNews = (req,res ,next) => {
    res.render('news', {
        pageTitle: 'News',
        path: '/news',        
        isAuthenticated: false,
    });
}
exports.getGallery = (req,res ,next) => {
    res.render('gallery', {
        pageTitle: 'Gallery',
        path: '/gallery',  
        isAuthenticated: false,      
    });
}
exports.getContact = (req,res ,next) => {
    res.render('contact', {
        pageTitle: 'Contact',
        path: '/contact',     
        isAuthenticated: false,   
    });
}