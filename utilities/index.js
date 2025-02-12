const invModel = require("../models/inventoryModel");
const accountModel = require("../models/accountModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  console.log(data);
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build vehicle details view HTML
 * ************************************ */
Util.buildVehicleDet = async function (data) {
  let grid;
  if (data.length > 0) {
    data.forEach((vehicle) => {
      grid = '<div id="container-detail">';
      grid += '<div id="detail-content1">';
      grid +=
        '<img src="' +
        vehicle.inv_image +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" >';
      grid += "</div>";
      grid += '<div id="detail-content2">';
      grid +=
        "<h2>" +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        " " +
        "Details</h2>";
      grid +=
        '<span id="price">Price: $' +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid +=
        "<p><span>Description:</span> " + vehicle.inv_description + "</p>";
      grid += "<p><span>Color:</span> " + vehicle.inv_color + "</p>";
      grid +=
        "<p><span>Miles:</span> " +
        new Intl.NumberFormat("en-US").format(vehicle.inv_miles) +
        "</p>";
      grid += "</div>";
      grid += "</div>";
    });
  } else {
    grid +=
      '<p class="notice"> Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build classification options field - add inventory form.
 * ************************************ */
Util.buildOptions = async function (optionSelected = null) {
  let data = await invModel.getClassifications();
  let options;
  options = '<select name="classification_id" id="classificationId" required>';
  options +=
    '<option value="" selected disabled hidden> Choose a classification </option>';
  data.rows.forEach((row) => {
    options += `<option value="${row.classification_id}"
    ${row.classification_id === Number(optionSelected) ? "selected" : ""}
    >${row.classification_name} </option>`;
  });
  options += "</select>";
  return options;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/************************************************
 * Middleware for checking token validity
 * ******************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookies("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/******************************
 * Check Login
 * ************************** */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/***************************************
 * Check Authorization
 ****************************************/
Util.checkPermission = (req, res, next) => {
  if (res.locals.loggedin) {
    const account_type = res.locals.accountData.account_type;
    if (account_type == "Admin" || account_type == "Employee") {
      next();
    } else {
      req.flash("notice", "Access denied");
      return res.redirect("../account/login");
    }
  }
};

// FINAL PROJECT
/***************************************
 * Check ADMIN ACCOUNT
 ****************************************/
Util.isAdminAccount = (req, res, next) => {
  const accountType = res.locals.accountData.account_type;
  if (accountType != "Admin") {
    return res.redirect("/account/login");
  }
  next();
};

/***************************************
 * BUILD LIST OF ACCOUNTS
 ****************************************/
Util.buildAccountList = async function (login_id = null, account_id = null) {
  let data = await accountModel.getAccountsExcept(login_id);

  let accountList = '<select name="account_id" id="account_id" required>';
  accountList += "<option value=''>Choose an account</option>";
  data.forEach((row) => {
    accountList += '<option value="' + row.account_id + '"';

    if (account_id != null && row.account_id == account_id) {
      accountList += " selected ";
    }

    accountList +=
      ">" + row.account_firstname + " " + row.account_lastname + "</option>";
  });

  accountList += "</select>";
  return accountList;
};

/***************************************
 * BUILD LIST OF ACCOUNT TYPES
 ****************************************/
Util.buildAccountTypeList = async function (type_id = null) {
  let data = await accountModel.getAccountType();
  let accountTypeList = '<select name="type_id" id="type_id" required>';
  accountTypeList += "<option value=''>Choose a type</option>";
  data.forEach((row) => {
    accountTypeList += '<option value="' + row.type_id + '"';

    if (type_id != null && row.type_id == type_id) {
      accountTypeList += " selected ";
    }

    accountTypeList += ">" + row.type_name + "</option>";
  });

  accountTypeList += "</select>";
  return accountTypeList;
};

module.exports = Util;
