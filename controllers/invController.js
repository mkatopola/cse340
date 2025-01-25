const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}
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
      grid,
    });
  };

  /* **************************************** *
 *  Build error
 * **************************************** */
invCont.buildError = (req, res, next) => {
    const error500 = new Error();
    error500.status = 500;
    error500.message =
      "I am running away from my responsibilities. And it feels good";
    next(error500);
    //throw new Error("Intentional error occurred");
  };

module.exports = invCont