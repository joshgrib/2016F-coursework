const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Heres the calendar");
});

module.exports = router;