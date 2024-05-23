const express = require("express");
const pg = require("pg");
const fs = require("fs");
const config = require("../database/config.js");
const path = require('path');
const { fileURLToPath } = require('url');
const router = express.Router();
const db = new pg.Client(config);
db.connect();

var data = [];
var productCount = 0;

// 2 functions, one to get by category, the other to browse all. Will try to simplify into 1 function later.
async function getAllItems(LIMIT,OFFSET){
    data = [];
    const products = await db.query("SELECT * FROM products LIMIT $1 OFFSET $2", [LIMIT,OFFSET]);
    products.rows.forEach(function(product) {
        data.push(product);
    });
}
async function getItemsByCategory(LIMIT,OFFSET,TAG){
    data = [];
    const products = await db.query(
        "SELECT products.product_id, products.name,products.price, products.per "+
        "FROM tag_products "+
        "RIGHT JOIN products ON tag_products.product_id = products.product_id "+
        "RIGHT JOIN categories ON tag_products.tag_id = categories.tag_id "+
        "WHERE tag_products.tag_id = $1 LIMIT $2 OFFSET $3;",
        [TAG,LIMIT,OFFSET]
    );
    productCount = products.rowCount;
    products.rows.forEach(function(product) {
        data.push(product);
    });
}

var categories = [];
async function getTags(){
    categories = [];
    category = await db.query(
        "SELECT categories.*,COUNT(tag_products.tag_id) " + 
        "FROM tag_products " +
        "FULL JOIN categories ON categories.tag_id = tag_products.tag_id " +
        "GROUP BY categories.tag_id ORDER BY categories.tag_id ASC");
    category.rows.forEach(function(tag) {
        categories.push(tag);
    });
}
router.get("/", async (req, res) => {
    let TAG = req.query.TAG;
    let currentTag = Number(TAG);
    let LIMIT = req.query.LIMIT? Number(req.query.LIMIT) : 20;
    let OFFSET = req.query.OFFSET? Number(req.query.OFFSET) : 0;
    let VIEW = req.query.VIEW? req.query.VIEW : 0;
    var maxCount = TAG?
    await db.query("SELECT COUNT(*) FROM tag_products WHERE tag_id = $1",[TAG]) : await db.query("SELECT COUNT(*) FROM products");
    productCount = maxCount.rows[0].count;
    let pagination = {
        limit: LIMIT,
        offset: OFFSET,
        maxProduct: productCount,
    };
    await getTags();

    TAG ? await getItemsByCategory(LIMIT,OFFSET,TAG) : await getAllItems(LIMIT,OFFSET);
    res.render("browse.ejs", {data, pagination, categories, currentTag, VIEW});
});

module.exports = router;
