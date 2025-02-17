const utilities = require(".");
const accountModel = require("../models/accountModel");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    //firstname is required and must be a string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), //this message is sent on error

    //lastname is required and must be a string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), //this message is sent on error

    //valid email is required and cannot already exixt in the database
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("Please provide a valid email.") //this message is sent on error
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error(
            "There is an existing account for this email. Please log in or register with a different email"
          );
        }
      }),

    //password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage("Password does not meet requirements.")
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req); // get validation errors

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email
    });
    return;
  }
  next();
};

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the dataase
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("Please enter a valid account email."),

    // password is required and must be strong password
    body("account_password")
      .isLength({ min: 12 })
      .withMessage("Incorrect password! Please, type your password.")
  ];
};

/* ******************************
 * Check data and return errors or continue login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email
    });
    return;
  }
  next();
};

/*  **********************************
 *  Update Validation Rules
 * ********************************* */
validate.updateRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name. "), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const getaccount = await accountModel.getAccountById(
          req.body.account_id
        );
        if (getaccount.account_email != account_email) {
          const emailExists = await accountModel.checkExistingEmail(
            account_email
          );
          if (emailExists) {
            throw new Error(
              "This email is already used. Please enter another."
            );
          }
        }
      })
  ];
};

/* ***********************************************************
 * Check data and return errors or continue to registration  *
 * ********************************8************************ */
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } =
    req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./account/update", {
      errors,
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    });
    return;
  }
  next();
};

/*************************
 * Update password rules *
 *************************/
validate.upPassRules = () => {
  return [
    //account id is required and must be an integer
    body("account_id").trim().isInt(),

    //password is required and must be a strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
      .withMessage("Password does not meet requirements.")
  ];
};

/* *************************************************************
 * Check data and return errors or continue to update password *
 * *********************************************************** */
validate.checkPassData = async (req, res, next) => {
  const { account_id, account_password } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./account/update", {
      errors,
      title: "Edit Account",
      nav,
      account_id,
      account_password
    });
    return;
  }
  next();
};

// FINAL PROJECT

validate.accountTypeUpdateRules = () => {
  return [
    body("account_id")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please select an 'account'"),

    body("type_id")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please select a 'type'")
  ];
};

validate.checkAccountTypeUpdateData = async (req, res, next) => {
  const { account_id, type_id, account_firstname, account_lastname } = req.body;
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let accountTypeList = await utilities.buildAccountTypeList(type_id);
    let accountList = await utilities.buildAccountList(
      res.locals.accountData.account_id,
      account_id
    );

    res.render("account/editAccounttype", {
      errors,
      title: "Edit Account Type",
      nav,
      accountTypeList,
      accountList,
      account_id,
      type_id,
      account_firstname,
      account_lastname
    });
    return;
  }
  next();
};

/*  **********************************
 *  Delete Account Validation Rules  *
 * ********************************* */
validate.deleteAccountRules = () => {
  return [
    // Account ID is required and must be a number
    body("account_id")
      .trim()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Invalid account ID.")
  ];
};

/* ************************************************************
 * Check data and return errors or continue to delete account *
 * ********************************************************** */
validate.checkDeleteAccountData = async (req, res, next) => {
  const { account_id } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let accountList = await utilities.buildAccountList(
      res.locals.accountData.account_id,
      account_id
    );
    return res.render("account/deleteAccount", {
      errors,
      title: "Delete Account",
      nav,
      accountList,
      account_id
    });
  }
  next();
};

module.exports = validate;
