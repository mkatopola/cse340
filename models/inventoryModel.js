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

/* *****************************
 *   Edit Inventory Data
 * *************************** */
async function editInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* *****************************
 *   Delete Inventory Data
 * *************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *";
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    console.error("model error: " + error);
  }
}

module.exports = {
  getVehicleByDetId,
  getClassifications,
  getInventoryByClassificationId,
  addNewClassification,
  addNewInventory,
  editInventory,
  deleteInventoryItem
};
