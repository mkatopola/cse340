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

//Route to get inventory list by classification_id
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
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

//Route to process Add nventory
router.post(
  "/addInventory",
  validate.inventoryRules(),
  validate.checkInvData,
  utilities.handleErrors(invController.addInventory)
);

//Route to edit inventory view
// Route to get Edit
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.buildEditInventoryView)
);

module.exports = router;
