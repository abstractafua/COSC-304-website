const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><head><link rel="stylesheet" href="/css/main.css"></head><body>');

    console.log("i'm in");

    // TODO: Get order id
    let orderId = req.query.orderId;

    console.log("order id secured");


    (async function () {
        try {
            let pool = await sql.connect(dbConfig);
            // // TODO: Check if valid order id
            SQL1 = "SELECT * FROM ordersummary WHERE orderId = @orderId";
            let r = await pool.request().input('orderId', sql.Int, orderId).query(SQL1);

            console.log(r.recordset);
            if (r.recordset.length == 0) { //if no record of orderId in order summary

                res.write(`<h1>Invalid order id or no items in order.</h1>`)
                res.end();
                return;
            }

            // TODO: Start a transaction
            let transaction = new sql.Transaction(pool); //can i do this???
            await transaction.begin();

            // TODO: Retrieve all items in order with given id
            //need ordersummary.orderDate, ordersummary.orderId, productId,productName,orderproduct.quantity,orderproduct.price,
            let SQL = "SELECT * FROM orderproduct WHERE orderId=@orderId";
            orderItemResults = await pool.request().input('orderId', sql.Int, orderId).query(SQL);

            // TODO: Create a new shipment record.
            //   SQL2 = "INSERT INTO shipment(shipmentDate,shipmentDesc,warehouseId) VALUES (@shipDate,@shipDesc,@warehouseId)";

            let shipmentDate = new Date();
            let shipmentDesc = "Customer Order";
            let warehouseId = 1;

            sqlQuery = "INSERT INTO shipment VALUES(@a0,@a1,@a2)";

            await pool.request()
                .input('a0', sql.DateTime, shipmentDate)
                .input('a1', sql.VarChar, shipmentDesc)
                .input('a2', sql.Int, warehouseId)
                .query(sqlQuery);

            // TODO: For each item verify sufficient quantity available in warehouse 1.
            for (let i = 0; i < orderItemResults.recordset.length; i++) {

                let orderItem = orderItemResults.recordset[i];
                let productId = orderItem.productId;
                let quantity = orderItem.quantity;
                let SQL2 = "SELECT * FROM productInventory WHERE productId = @productId AND warehouseId = 1";
               

                let warehouse_results = await pool.request().input('productId', sql.Int, productId).input('quantity', sql.Int, quantity).query(SQL2);

                let warehouseItem = warehouse_results.recordset[0];

                let warehouse_inventory = warehouseItem.quantity;
                console.log("passed");

                // TODO: If any item does not have sufficient inventory, cancel transaction and rollback. Otherwise, update inventory for each item.
                if (quantity > warehouse_inventory) {
                    console.log("condition met");
                    await transaction.rollback();
                    res.write(`<p1><h3>Shipment not done. Insufficient inventory for product id: ${productId}<h3></p1>`);
                    res.write(`<h3><a href='/'>Back to Main Page</a></h3>`);
                    res.end();
                    return;
                } else if (!warehouse_inventory) {


                } else {

                    let SQL3 = "UPDATE productinventory SET quantity= quantity - @quantity WHERE productId = @productId AND warehouseId=1";
                    await pool.request().input('quantity', sql.Int, quantity).input('productId', sql.Int, productId).query(SQL3);

                    let current_inventory = warehouse_inventory - quantity;

                    res.write(`<p><h3>Ordered Product: ${productId} QTY: ${quantity}  Previous Inventory: ${warehouse_inventory} Current Inventory: ${current_inventory}</h3></p>`);
                }
            }

            await transaction.commit();
            res.write(`<p1><h1>Shipment successfully processed </h1></p1>`);
            res.write(`<h1><a href='/'>Back to Main Page</a></h1>`);
            res.end();

        } catch (err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;