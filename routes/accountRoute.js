// Need Resources
const regValidate = require("../utilities/accountValidation");
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

// Route to build a login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build registration view
router.get(
    "/register",
    utilities.handleErrors(accountController.buildRegister)
);

// Route to process the registration
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
