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

//Route for account management
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagementView)
);

//Route for logout process
router.get(
  "/logout",
  utilities.checkLogin,
  utilities.handleErrors(accountController.logoutProcess)
);

// Route to Update Account view
router.get(
  "/update/:accountId",
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccountView)
);

// Route to process the registration
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Route to Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Route to Process the account update 
router.post(
  "/",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Route to Process the password update
router.post(
  "/update",
  regValidate.upPassRules(),
  regValidate.checkPassData,
  utilities.handleErrors(accountController.updatePassword)
);

// Route to Check if loggen in account is an Admin
router.get('/editAccountType', 
  utilities.isAdminAccount,
  utilities.handleErrors(accountController.buildAccountType))

  // Route to process account type change
router.post(
  "/editAccountType",
  regValidate.accountTypeUpdateRules(),
  regValidate.checkAccountTypeUpdateData,
  utilities.handleErrors(accountController.updateAccountType)
)
module.exports = router;
