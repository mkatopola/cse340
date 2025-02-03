const pool = require("../database");
const Util = require("../utilities");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error);
  }
}

/* ***************************
 *  Get an inventory item by inventory_id
 * ************************** */
async function getVehicleByDetId(detail_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
            WHERE i.inv_id = $1`,
      [detail_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getVehicleByDetId error: " + error);
  }
}

/* ***************************
 *  Add Classification
 * ************************** */
async function addNewClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO public.classification (classification_name) VALUES ($1)";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    console.error("addNewClassification error" + error);
  }
}

/* *****************************
 *   Add new Inventory
 * *************************** */
async function addNewInventory(
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
) {
  try {
    const sql =
      "INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    return await pool.query(sql, [
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
    ]);
  } catch (error) {
    console.error("addNewInventory error" + error);
  }
}

module.exports = {
  getVehicleByDetId,
  getClassifications,
  getInventoryByClassificationId,
  addNewClassification,
  addNewInventory
};
