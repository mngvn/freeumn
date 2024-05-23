const fs = require("fs");
const express = require("express");
const multer = require("multer");
const upload = multer({ dest: './' });
const path = require('path');
const pg = require("pg");
const config = require("../database/config.js");
const router = express.Router();
const db = new pg.Client(config);

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '.');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
try{
    db.connect();
} catch(err){
    console.log(err);
}


// router.post( '/newinv', upload.single('file'), (req, res) => {
//     if (!req.file){
//         return res.status(400).send('No file uploaded.');
//     }

//     // Move the uploaded file to a permanent location
//     const oldPath = req.file.path;
//     const newPath = path.join(__dirname, "./Inventory/tempFiles/inv"+req.file.filename);

//     // fs.rename(oldPath, newPath, (err) => {
//     //     if (err) {
//     //         console.error(err);
//     //         return res.status(500).send('Error saving file.');
//     //     }

//     //     res.send('File uploaded and saved successfully.');

//     //     // Pass the path to the final renamed file to addInventory
//     //     const finalPath = path.join(__dirname, "./Inventory/tempFiles/inv" + req.file.filename);
//     //     addInventory(finalPath);
//     // });
//     addInventory("cheese");

// });
router.post('/newinv', async (req,res) => {
    addInventory("cheese");
})

router.post('/newsale', upload.single('file'), (req, res) => {
    if (!req.file){
        return res.status(400).send('No file uploaded.');
    }

    // Move the uploaded file to a permanent location
    const oldPath = req.file.path;
    const newPath = path.join(__dirname, "./Inventory/tempFiles/sale"+req.file.filename);

    fs.rename(oldPath, newPath, (err) => {
        if(err){
            console.error(err);
            return res.status(500).send('Error saving file.');
        }
        res.send('File uploaded and saved successfully.');
        removeSales(newPath);
    });
});

//Input: object's barcode number, price, catagory, name
//Output: barcode, title, price, catagory
async function addInventory(file) {
    // console.log("File: "+file);
    console.log("Commencing Inventory Addition...");
    // Path to the existing Inventory.csv file
    const inventoryFilePath = path.join(__dirname, '../../Inventory/Inventory.csv');
    // Read the input CSV file
    reader = fs.createReadStream(inventoryFilePath, { 
        flag: 'a+', 
        encoding: 'UTF-8' 
    }); 
    // Read and display the file data on console 
    reader.on('data', async function (chunk) { 
        // console.log(chunk);
        const newInvArrayRows = chunk.trim().split('\n');
        const newInvArray = newInvArrayRows.map(newInvArrayRows => newInvArrayRows.split(','));
        // console.log("newInvArray: "+newInvArray);

        for(const row of newInvArray) {
            console.log("Array:", row);
            const barcode = row[0];
            // console.log("-> barcode: "+barcode);
            const title = row[1];
            // console.log("-> title: "+title);
            const price = row[2];
            // console.log("-> price: "+price);
            const category = row[3];
            // console.log("-> category: "+category);

            // CAUTION: PROBLEMS WITH MAKING THE 'PER POUND' OBJECTS SUBMIT CORRECTLY
            // if(row.length == 5){
            //     const per = row[4];
            //     console.log("-> per: " + per);
            // }
            const formattedRow = `${barcode},${title},${price},${category}\n`;
            // try{
            //     if(row.length == 5){
            //         console.log("row 4!")
            //         await db.query("INSERT INTO products VALUES($1,$2,$3,$4", [barcode,title,price,per])
            //         const categories = await db.query("SELECT * FROM categories");
            //     }
            //     else{
            //         await db.query("INSERT INTO products VALUES($1,$2,$3)", [barcode,title,price]);
            //         const categories = await db.query("SELECT * FROM categories");
            //     }
            // }catch(err){
            //     console.log(err);
            // }

            var duplicate = {};
            async function getTag(){
                duplicate = await db.query("SELECT * FROM categories WHERE tag_name LIKE CONCAT('%',CAST($1 AS TEXT),'%')", [category]);
            }
            try{
                await getTag();
                if(duplicate.rowCount==0){
                    await db.query("INSERT INTO categories (tag_name) VALUES($1)",[category]);
                    console.log("added category:" + category);
                    await getTag();
                    await db.query("INSERT INTO tag_products VALUES($1,$2)",[barcode,duplicate.rows[0].tag_id]);
                    console.log(`Added ${barcode} to  ${duplicate.rows[0].tag_name}`);
                }
                else{
                    await db.query("INSERT INTO tag_products VALUES($1,$2)",[barcode,duplicate.rows[0].tag_id]);
                    console.log(`Added ${barcode} to  ${duplicate.rows[0].tag_name}`);
                }
            }catch(err){
                console.log(err);
            }
            // Append the formatted row to the Inventory.csv file
            // fs.appendFileSync(inventoryFilePath, formattedRow);
        };
        console.log("DB updated")
    });
}
function removeSales(file){
    console.log("Removing Sold Objects...");
    reader = fs.createReadStream(file, { 
        flag: 'a+', 
        encoding: 'UTF-8' 
    }); 
    reader.on('data', function (chunk) { 
        console.log("sold items: ");
        console.log(chunk);
        const newInvArrayRows = chunk.trim().split('\n');
        const newInvArray = newInvArrayRows.map(newInvArrayRows => newInvArrayRows.split(','));

        reader2 = fs.createReadStream('./Inventory/Inventory.csv', { 
            flag: 'a+', 
            encoding: 'UTF-8' 
        });
        reader2.on('data', function (chunk2) { 
            console.log("inventory: ");
            console.log(chunk2);
            const InvArrayRows = chunk2.trim().split('\n');
            const InvArray = InvArrayRows.map(InvArrayRows => InvArrayRows.split(','));

            console.log("\n\n");
            newInvArray.forEach(newInvrow => {
                console.log("newInvrow: ",newInvrow);
                var rowNum = 0;
                InvArray.forEach(Invrow => {
                    console.log("Invrow: ",Invrow);
                    rowNum++;
                    console.log(Invrow[0], " ", newInvrow[0], " ", Invrow[0] == newInvrow[0]);
                    if(Invrow[0] == newInvrow[0]){
                        console.log("removing "+Invrow)
                        InvArray.splice(rowNum, 1);
                    }
                });
            });
            console.log("\n\n");

            console.log("new inventory: ");
            var newInventoryCSVStr = InvArray.map(row => row.join(',')).join('\n');
            console.log(newInventoryCSVStr);

            fs.writeFileSync("./Inventory/Inventory.csv", newInventoryCSVStr);               
            console.log("\nSold Items Removed!");
        });
    });
}

module.exports = router;


