const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');

router.post("/", controller.saveFile);

router.delete("/:login", controller.deleteUser);

router.put("/:login", controller.updateUser);

router.patch("/name", controller.changeUserName);

router.patch("/status", controller.changeUserStatus);

router.get("/one/:login", controller.getOneUser);

router.get("/oneId/:id", controller.getOneUserID);

router.get("/all", controller.getAll)

module.exports = router;