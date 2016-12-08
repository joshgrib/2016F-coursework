const express = require('express');
const router = express.Router();
const postList = [];

function makePost(title, body, imageUrl) {
    return {
        title: title,
        body: body,
        imageUrl: imageUrl,
        id: postList.length
    };
}

postList.push(makePost('Post 1', 'This is my post1 body'));
postList.push(makePost('Post 2', 'This is my post2 body', 'http://www.placecage.com/c/500/300'));
postList.push(makePost('Post 3', 'This is my post3 body', 'http://www.placecage.com/c/500/300'));

router.get("/", (req, res) => {
    res.json(postList);
});

router.get("/:id", (req, res) => {
    const id = parseInt(req.params.id);

    let post = postList.filter(x => x.id === id)[0];

    if (!post) {
        res.sendStatus(404);
    } else {
        res.json(post);
    }
});


router.post("/", (req, res) => {
});

// Capture any other uncoded routes and 404 them
router.use("*", (req, res) => {
    res.sendStatus(404);
});

module.exports = router;