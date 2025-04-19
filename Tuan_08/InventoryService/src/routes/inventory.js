const express = require("express");
const inventoryController = require("../controllers/inventoryController");

const router = express.Router();

router.get("/", inventoryController.getInventory);
router.post("/", inventoryController.createInventory);
router.put("/:id", inventoryController.updateInventory);
router.post("/:id/reserve", inventoryController.reserveStock);
router.put("/:id/confirm", inventoryController.confirmReservation);
router.get("/check-stock", inventoryController.checkInventory);

module.exports = router;
