const mongoose = require('mongoose');

const URL = "mongodb+srv://AZL:C1RIIU6ywWLWBCMO@cluster0.wtqnueb.mongodb.net/ecommerce_teck?retryWrites=true&w=majority";

const connection = mongoose.connect(URL)
.then( _ => console.log('Connected to Atlas...'))

module.exports = connection