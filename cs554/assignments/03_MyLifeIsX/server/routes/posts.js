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
    postList.unshift(makePost(`Post ${i}`, `This is the body of post ${i}`, 'http://www.placecage.com/c/500/300'));
}

router.get("/", (req, res) => {
    res.json(postList);
});

router.get("/list/:pageNum", (req, res) => {
    /*
    Page #          Records
    0               1-20
    1               21-40
    2               41-60
    */
    const pageNum = parseInt(req.params.pageNum);
    let sortedPostList = postList;//.reverse();

    let minRecordID = (pageNum * 20) + 1;
    let maxRecordID = (pageNum + 1) * 20;

    if(sortedPostList.length < minRecordID){
        res.sendStatus(404);
        return;
    }
    if(sortedPostList.length < maxRecordID){
        maxRecordID = sortedPostList.length;
    }

    let resultList = sortedPostList.slice(minRecordID, maxRecordID + 1);
    res.json(resultList);
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
    let title = req.body.title;
    let body = req.body.body;
    let imageUrl = req.body.imageUrl;
    let p = makePost(title, body, imageUrl);
    postList.unshift(p);
    res.json(p);

});

// Capture any other uncoded routes and 404 them
router.use("*", (req, res) => {
    res.sendStatus(404);
});

module.exports = router;