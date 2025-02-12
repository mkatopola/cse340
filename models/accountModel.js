const pool = require("../database");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password
    ]);
  } catch (error) {
    return error.message;
  }
}

/**********************************
 *  Check for existing email
 ***********************************/
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email =$1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/*****************************************
 * Return account data using email address
 * ************************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

/* *****************************
 * Get account data by Id
 * ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM public.account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("getaccountbyid error " + error);
  }
}

/* *****************************
 * Update account data
 * ***************************** */
async function updateAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_id
) {
  try {
    const sql =
      "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ]);
  } catch (error) {
    console.error("updateAccount error: " + error);
  }
}

/* *****************************
 * Update password
 * ***************************** */
async function updatePassword(account_password, account_id) {
  try {
    const sql =
      "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const data = await pool.query(sql, [account_password, account_id]);
    return data.rows[0];
  } catch (error) {
    console.error("updatePassword error " + error);
  }
}


async function getAccountsExcept(account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname FROM account WHERE account_id <> $1', [account_id])
    return result.rows

  } catch (error) {
    return error.message
  }
}

// Function to fetch the allowed account types from the enum
async function getAccountType() {
  try {
    // This query uses unnest with enum_range to get all allowed enum values
    const result = await pool.query(
      `SELECT unnest(enum_range(NULL::public.account_type)) as type_name`
    );
    // Map the results to the structure expected by your view (both keys set to the enum value)
    return result.rows.map(row => ({
      type_id: row.type_name,
      type_name: row.type_name
    }));
  } catch (error) {
    return error.message;
  }
}


// Function to update an account's type
async function updateAccountType(account_id, type_id) {
  try {
    // The query sets the account_type column (which is of the enum type) to the new value
    const result = await pool.query(
      `UPDATE public.account 
         SET account_type = $1 
         WHERE account_id = $2 
         RETURNING *`,
      [type_id, account_id]
    );
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
}


module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, updatePassword, getAccountsExcept, getAccountType, updateAccountType };
