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
router.get(
  "/",
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.buildManagementView)
);

// Route to Add Classification View
router.get(
  "/addClassification",
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.buildAddClassification)
);

//Process to add classification
router.post(
  "/addClassification",
  validate.addClassificationRules(),
  validate.checkAddClassificationData,
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.addClassification)
);

// Route to Add Inventory View
router.get(
  "/addInventory",
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.buildAddInventory)
);

//Route to process Add nventory
router.post(
  "/addInventory",
  validate.inventoryRules(),
  validate.checkInvData,
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.addInventory)
);

//Route to edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.buildEditInventoryView)
);

//Route to process edit inventory
router.post(
  "/editInventory",
  validate.inventoryRules(),
  validate.checkEditData,
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.editInventory)
);

//Route to delete an inventory item
router.get(
  "/delete/:inv_id",
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.buildDeleteInventoryView)
);

//Route to process inventory deletion
router.post(
  "/deleteInventory",
  utilities.checkLogin,
  utilities.checkPermission,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;
