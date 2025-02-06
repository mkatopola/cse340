const invModel = require("../models/inventoryModel");
const utilities = require("../utilities/");
const bcrypt = require("bcryptjs");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid
  });
};

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByDetailId = async function (req, res, next) {
  const detail_id = req.params.detailId;
  const data = await invModel.getVehicleByDetId(detail_id);
  const grid = await utilities.buildVehicleDet(data);
  let nav = await utilities.getNav();
  const vehicleInfo =
    data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
  res.render("./inventory/views", {
    title: vehicleInfo,
    nav,
    grid
  });
};

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  let options = await utilities.buildOptions();
  try {
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      options,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build Add Classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  try {
    res.render("./inventory/addClassification", {
      title: "Add New Classification",
      nav,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/**********************************
 * Process add classification
 ***********************************/
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const addResult = await invModel.addNewClassification(classification_name);
  let options = await utilities.buildOptions();

  if (addResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was succesfully added.`
    );
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      options,
      errors: null
    });
  } else {
    req.flash("notice", "Sorry, the operation failed.");
    res.status(501).render("./inventory/addClassification", {
      title: "Add Classification",
      nav,
      errors: null
    });
  }
};

/* ***************************
 *  Build Add Inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let options = await utilities.buildOptions();
  let nav = await utilities.getNav();
  try {
    res.render("./inventory/addInventory", {
      title: "Add Inventory",
      nav,
      options,
      errors: null
    });
  } catch (error) {
    next(error);
  }
};

/***************************
 * Process add inventory
 * ************************ */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let options = await utilities.buildOptions();

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

  const addResult = await invModel.addNewInventory(
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
  );

  if (addResult) {
    req.flash("notice", `The ${inv_model} vehicle was succesfully added.`);
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      options,
      errors: null
    });
  } else {
    req.flash("notice", "Sorry, the operation failed.");
    res.status(501).render("./inventory/addInventory", {
      title: "Add Inventory",
      nav,
      options,
      errors: null
    });
  }
};

/* **************************************** *
 *  Build error
 * **************************************** */
invCont.buildError = (req, res, next) => {
  const error500 = new Error();
  error500.status = 500;
  error500.message = "Sorry, this was intentional";
  next(error500);
};

/*********************************************
 * Return Inventory by Classification as JSON
 **********************************************/
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const data = await invModel.getVehicleByDetId(inv_id);
  const itemData = data[0];
  const options = await utilities.buildOptions(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/editInventory", {
    title: "Edit " + itemName,
    nav,
    options: options,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });
};

module.exports = invCont;
