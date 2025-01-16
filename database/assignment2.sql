-- Assignment2 SQL 

-- Query 1: Create Tony Stark account
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Query 2: Change account type from 'Client' to 'Admin'
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

-- Query 3: Delete Tony Stark account
DELETE
FROM account
WHERE account_email = 'tony@starkent.com';

-- Query 4: cange GM description from 'small interiors' to 'huge interior'
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Query 5: Using an inner join on a select statement
SELECT inventory.inv_make, inventory.inv_model, classification.classification_name
FROM inventory
INNER JOIN classification 
ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

-- Query 6: Update inventory table image routes
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');