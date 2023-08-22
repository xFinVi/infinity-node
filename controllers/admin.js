const Post = require("../models/post");
const { validationResult } = require("express-validator");
/* const fileHelper = require("../util/file"); */

exports.getAddPost = (req, res, next) => {
  const user = req.session.user;

  if (!user) {
    // Handle the case where user is not authenticated or not available
    return res.redirect("/login"); // For example, redirect to the login page
  }

  res.render("admin/add-post", {
    pageTitle: "Add Post",
    path: "admin/add-post",
    editing: false,
    hasError: false,
    errorMessage: null,
  });
};

exports.postNewPost = (req, res, next) => {
  const { title, photo, description } = req.body;

  const newPost = new Post({
    title: title,
    image: photo,
    description: description,
    userId: req.user._id.toString(),
  });
  newPost
    .save()
    .then((result) => {
      console.log("POST ADDED SUCCESSFULLY");
      res.redirect("/news");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditPost = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
        console.log(post)
      if (!postId) {
        return res.redirect("/");
      }
      res.render("admin/add-post", {
        pageTitle: "Edit Post",
        path: "admin/Edit-post",
        editing: true,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
        post,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditPost = (req, res, next) => {
    const postId = req.body.postId;
  const updatedTitle = req.body.title;
  const updatedImg = req.body.photo;
  const updatedDesc = req.body.description;
/*   const user = req.session.user;
  if (!user) {
    // Handle the case where user is not authenticated or not available
    return res.redirect("/login"); // For example, redirect to the login page
  } */

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("add-post", {
      pageTitle: "Edit Post",
      path: "admin/Edit-post",
      editing: true,
      hasError: false,
      errorMessage: null,
      post: {
        title: updatedTitle,
        photo: updatedImg,
        description: updatedDesc,
        _id: postId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }


  Post.findById(postId)
    .then((post) => {
      post.title = updatedTitle;
      post.image = updatedImg;
      post.description = updatedDesc;
      return post.save();
    })
    .then((result) => {
      console.log("Post Updated");
      res.redirect("/news");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deletePost = (req, res, next) => {
    const postId = req.body.postId;
     Post.findByIdAndRemove(postId)
        .then( () => {        
            console.log("POST DELETED ==!!!===");
            res.redirect("/news");
        })
        .catch(err => res.status(500).json({ message: 'DELETING FAILED' }));
};
