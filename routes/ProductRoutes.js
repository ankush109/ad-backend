const express = require("express");
const { getAllProuducts, createProduct, updateProduct, deleteProducts, getProductDetails, createProductReview, deleteProductReview, getProductReviews, getAdminProuducts } = require("../controllers/productController");
const {isAuthenticated, authorizeRoles}=require("../middlewares/auth")

const router=express.Router();
//Create new product -- Admin
router.route("/admin/products/new").post(isAuthenticated,authorizeRoles("admin"),createProduct);
//Update product --Admin
router.route("/admin/products/:id").put(isAuthenticated,authorizeRoles("admin"),updateProduct)
//Delete product --Admin
router.route("/admin/products/:id").delete(isAuthenticated,authorizeRoles("admin"),isAuthenticated,deleteProducts)
//Get the product details of a single product
router.route("/products/:id").get(getProductDetails)
router.route("/products/product/:id").get(getProductDetails)
//Get all products
router.route("/products").get(getAllProuducts);
//Get all product (admin)
router.route("/admin/products").get(isAuthenticated,authorizeRoles("admin"),getAdminProuducts);
//review
router.route("/review").put(isAuthenticated,createProductReview);
//delete review
router.route("/review").delete(isAuthenticated,deleteProductReview)
//get product review
if(isAuthenticated)
router.route("/review").get(isAuthenticated,getProductReviews)
else
router.route("/products").get(getAllProuducts);
module.exports = router