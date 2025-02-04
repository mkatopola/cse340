// Need Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const validate = require("../utilities/inventoryValidation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory detail view
router.get(
  "/detail/:detailId",
  utilities.handleErrors(invController.buildByDetailId)
);

// Route to Management View
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to Add Classification View
router.get(
  "/addClassification",
  utilities.handleErrors(invController.buildAddClassification)
);

//Process to add classification
router.post(
  "/addClassification",
  validate.addClassificationRules(),
  validate.checkAddClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to Add Inventory View
router.get(
  "/addInventory",
  utilities.handleErrors(invController.buildAddInventory)
);

router.post(
  "/addInventory",
  validate.inventoryRules(),
  validate.checkInvData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;
