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

for(let i=0; i<25; i++){
    postList.push(makePost(`Post ${i}`, `This is the body of post ${i}`, 'http://www.placecage.com/c/500/300'));
}

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