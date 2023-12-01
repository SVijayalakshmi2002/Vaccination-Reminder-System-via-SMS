const express = require("express");
const router = express.Router();
// const userController = require("../controllers/control");
// router.post("/register",userController.register);

// router.post("/login",userController.login);

const { register, login, vaccination_detail, report} = require("../controllers/control");

router.post('/register', register);
router.post('/login', login);   
router.get('/users/vaccination_detail/:id', vaccination_detail);
router.post('/vaccination_detail',vaccination_detail);
router.post('/report',report);


module.exports = router;


