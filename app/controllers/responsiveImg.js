const express = require("express")
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
// const { getSystemErrorMap } = require("util");
// const { rootCertificates } = require("tls");
const directory = path.resolve(__dirname, '../../Inventory/images');
const thumbnail = path.resolve(__dirname, '../../Inventory/thumbnails');
const router = express.Router();

// This file will eventually hold something more for 'utlity' because it will be responsible for receiving the images uploaded and creating the responsive layout for the page.

router.get("/lg", async (req,res) => {
    createThumbnailLg();
    console.log("Large Thumnails Created!");
})

async function createThumbnailLg(){
    const files = fs.readdirSync(directory);
    const promises = files.map(async img => {
        const product_id = path.parse(img).name;
        await sharp(`${directory}/${img}`)
            .resize({
                width: 246,
            })
            .rotate(90)
            .webp()
            .toFile(`${thumbnail}/${product_id}@lgthumb.webp`);
    });
    await Promise.all(promises);
}
module.exports = router;