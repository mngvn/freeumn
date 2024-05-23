const express = require("express");
const router = express.Router();

router.get("/", (req,res) => {
    res.render("uploadCSV.ejs");
})

module.exports = router;