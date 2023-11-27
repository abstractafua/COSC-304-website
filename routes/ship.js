const express = require('express');
const router = express.Router();
const sql = require('mssql');
const moment = require('moment');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');

    console.log("i'm in");

	// TODO: Get order id
    let orderId = req.query.orderId;

    console.log("order id secured");
          
	// // TODO: Check if valid order id
    // if(orderId==false){
    //     return;
    // }

    // (async function() {
    //     try {
    //         let pool = await sql.connect(dbConfig);

    //        // TODO: Start a transaction
    //        let transaction = await sql.beginTransaction(); //can i do this???

	//    	// TODO: Retrieve all items in order with given id
    //     //need ordersummary.orderDate, ordersummary.orderId, productId,productName,orderproduct.quantity,orderproduct.price,
    //             SQL = "SELECT * FROM orderproduct WHERE orderId=@orderId";
    //             orderItemResults = await pool.request().input('orderId', sql.Int, orderId).query(SQL);

	//    	// TODO: Create a new shipment record.
    //          //   SQL2 = "INSERT INTO shipment(shipmentDate,shipmentDesc,warehouseId) VALUES (@shipDate,@shipDesc,@warehouseId)";
            
    //             let shipmentDate = new sql.DateTime();
    //             let shipmentDesc = "Customer Order";
    //             let warehouseId = 1;

    //             sqlQuery = "INSERT INTO shipment VALUES(@a0,@a1,@a2,@a3)";
                
    //             await pool.request()
    //            .input('a0', sql.DateTime, shipmentDate)
    //            .input('a1',sql.VarChar, shipmentDesc)
    //            .input('a2',sql.Int, warehouseId)
    //            .query(sqlQuery);

    //          //   ship_results = await pool.request().input('orderId', sql.Int, orderId).query(sqlQuery);

    //         //    let shipID = ship_results.recordset[0].shipmentId;


	//    	// TODO: For each item verify sufficient quantity available in warehouse 1.
    //                 for(let i =0; i<orderItemResults.length; i++){

    //                         let orderItem = orderItemResults.recordset[i];
    //                         let productId = orderItem.productId;
    //                         let quantity = orderItem.quantity;
                            
    //                         SQL2 = "SELECT * FROM productinventory WHERE productId = @productId AND warehouseId = 1 AND quantity>@quantity;"
    //                        let warehouse_results = await pool.request().input(productId).input(quantity).query(SQL2);

    //                         let warehouseItem = warehouse_results.recordset[i];
    //                         let warehouse_inventory = warehouseItem.quantity;

    //                          	// TODO: If any item does not have sufficient inventory, cancel transaction and rollback. Otherwise, update inventory for each item.
    //                         if(!warehouseItem){
    //                             await transaction.rollack(); 
    //                             res.write(`Shipment not done. Insufficient inventory for product id: ${productId}`);
    //                         }else{

    //                             SQL3 = "UPDATE productinventory SET quantity= quantity -@quantity WHERE productId = @productId AND warehouseId=1";
    //                             await pool.request.input('quantity',sql.Int,quantity).input('productId',sql.Int,productId).query(SQL3);
                               
    //                             let current_inventory = warehouse_inventory-quantity;

    //                             res.write(`Ordered Product: ${productId} QTY: ${quantity} Previous Inventoy: ${inventory} Current Inventory: ${current_inventory}`);

    //                         }

    //                 }	 
    //                 transaction.commit();  		
 
    //     } catch(err) {
    //         console.dir(err);
    //         res.write(err + "")
    //         res.end();
    //     }
    // })();
});

module.exports = router;
