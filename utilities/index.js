const invModel = require("../models/inventoryModel")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    console.log(data)
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + ' details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }


/* **************************************
* Build vehicle details view HTML
* ************************************ */
Util.buildVehicleDet = async function(data){
    let grid
      if(data.length > 0){
       data.forEach(vehicle => {
        grid = '<div id="container-detail">'
        grid += '<div id="detail-content1">'
        grid += '<img src="' + vehicle.inv_image
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
        +' on CSE Motors" >'
        grid += '</div>'
        grid += '<div id="detail-content2">'
        grid += '<h2>' + vehicle.inv_make + " " + vehicle.inv_model + " " + 'Details</h2>'
        grid += '<span id="price">Price: $'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '<p><span>Description:</span> ' + vehicle.inv_description + '</p>'
        grid += '<p><span>Color:</span> ' + vehicle.inv_color + '</p>'
        grid += '<p><span>Miles:</span> '
        + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
        grid += '</div>'
        grid += '</div>' 
       })
  } else {
    grid += '<p class="notice"> Sorry, no matching vehicles could be found.</p>'
  }
  return grid
  }

/* **************************************
* Build classification options field - add inventory form.
* ************************************ */
Util.buildOptions = async function (optionSelected=null) {
  let data = await invModel.getClassifications()
  let options
    options = '<select name="classification_id" id="classificationId" required>'
    options += '<option value="" selected disabled hidden> Choose a classification </option>'
    data.rows.forEach(row => {
    options += `<option value="${row.classification_id}"
    ${row.classification_id === Number(optionSelected)? 'selected':''}
    >${row.classification_name} </option>`
    })
    options += '</select>'
  return options
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util