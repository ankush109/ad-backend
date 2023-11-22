const express = require("express");
const {isAuthenticated, authorizeRoles}=require("../middlewares/auth");
const { route } = require("./ProductRoutes");
const { newOrder, getSingleOrder, myOrders, getAllOrder, updateOrder, deleteOrder } = require("../controllers/orderController");

const router=express.Router();
//order items
router.route("/newOrder").post(isAuthenticated,newOrder)
//show single order 
router.route("/order/:id").get(isAuthenticated,authorizeRoles("admin"),getSingleOrder)
//show all my orders
router.route("/orders/my").get(isAuthenticated,myOrders);
//get All orders (admin)
router.route("/admin/orders").get(isAuthenticated,authorizeRoles("admin"),getAllOrder);
//update order (admin)
router.route("/admin/order/:id").put(isAuthenticated,authorizeRoles("admin"),updateOrder).delete(isAuthenticated,authorizeRoles("admin"),deleteOrder);



module.exports=router;