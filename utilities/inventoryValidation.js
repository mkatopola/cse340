const utilities = require(".");
const invCont = require("../controllers/invController");
const invModel = require("../models/inventoryModel");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 * Classification Data Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification Name cannot be empty")
      .matches(/^[A-Za-z]+$/)
      .withMessage(
        "Classification Name must contain alphabetic characters only (no spaces or special characters)"
      )
      .isLength({ min: 3 })
      .withMessage("Classification Name must be at least 3 characters long")
  ];
};

/*  **********************************
 *  Check data and return errors or continue to add classification
 * ********************************* */
validate.checkAddClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inventory/addClassification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name
    });
    return;
  }
  next();
};

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .escape()
      .isNumeric()
      .isLength({ min: 1 })
      .withMessage("Please provide the classification."),

    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide the vehicle make."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide the vehicle model."),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Please provide the vehicle's description."),

    body("inv_image")
      .isLength({ min: 10 })
      .withMessage("Image field does not meet requirements"),

    body("inv_thumbnail")
      .isLength({ min: 10 })
      .withMessage("Thumbnail field does not meet requirements"),

    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .isLength({ min: 1 })
      .withMessage("Please provide a price."),

    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .isLength({ min: 4, max: 4 })
      .withMessage("Please provide a valid year."),

    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .isLength({ min: 1 })
      .withMessage("Please provide the mileage."),

    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide the color.")
  ];
};

/* ******************************
 * Check data and return errors or continue adding inventory
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let options = await utilities.buildOptions();
    res.render("./inventory/addInventory", {
      errors,
      title: "Add Inventory",
      nav,
      options,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    });
    return;
  }
  next();
};

module.exports = validate;
