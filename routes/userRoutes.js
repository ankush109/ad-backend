const express=require("express");
const { registerUser, loginUser, logoutUser,  forgotPassword, resetPassword, getUserDetails, userChangePassword, updateProfile, getAllUsers, getSingleUser, updateRoles, deleteUser } = require("../controllers/userController");
const { isAuthenticated, authorizeRoles } = require("../middlewares/auth");


const router=express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset:token").put(resetPassword);

router.route("/password/update").put(isAuthenticated,userChangePassword)

router.route("/profile/update").put(isAuthenticated,updateProfile)

router.route("/logout").get(logoutUser);

router.route("/me").get(isAuthenticated,getUserDetails)

router.route("/admin/users").get(isAuthenticated,authorizeRoles("admin"),getAllUsers)

router.route("/admin/users/:id").get(isAuthenticated,authorizeRoles("admin"),getSingleUser).put(isAuthenticated,authorizeRoles("admin"),updateRoles).delete(isAuthenticated,authorizeRoles("admin"),deleteUser)

module.exports=router;