const express = require('express');
const { Router } = express;
const ProductsMongo = require('../operative/productHandlerMongo');

const db = require('../db/mongo/db');
const productModel = require('../db/mongo/models/productsModel');

const adminRouter = Router();

const productsMongo = new ProductsMongo(db, productModel)

//------- ROUTER -------


adminRouter.get('', (req, res) => {

    let logName = ''

        if (req.session.logName) {
            logName = req.session.alias;            
        }
        res.render('adminPanels', { logName });
})


adminRouter.get('/products', (req, res) => {

    if (req.query.idString == '') {
        // ;(async () => {
        //     const productList = await productsMongo.getAll()
        //     res.render('adminProducts', { productList })               
        // })()
        
        return productsMongo.getAll()
        .then(productList => {
            res.render('adminProducts', { productList })
        })
    } else {
        return productsMongo.getById(req.query.idString)
        .then( resp => {
            if(resp == []) {
                let message = 'This product does not exist'
                res.render('error', { message })
            }
            let productList = resp
            res.render('adminProducts', { productList, logName })
        })
    }
})

adminRouter.post('/products', (req, res, next) => {
    let productToAdd = {
        title: req.body.title,
        price: req.body.price,
        thumbnail: req.body.thumbnail,
        stock: Math.floor(Math.random() * 101)
    };

    return productsMongo.addProduct(productToAdd)
    .then( resp => {
        let productList = [];
        productList.push(resp)
        res.render('adminResponse', { productList, message: 'Product added successfully'})
    }).catch( resp => {
        let message = resp.message;
        res.render('error', {message})
    })
})

adminRouter.post('/products/delete', (req, res) => {
    return productsMongo.deleteById(req.body.id)
    .then( _ => {
        res.render('adminDeleteResponse', { message: 'Product Deleted'}) 
    }).catch( err => {
        res.render('error', { message: 'The product you inserted does not exist' })
    })
})


adminRouter.post('/products/put', (req, res) => {

    let productUpdate = {}

    if (req.body.title !== '') { productUpdate.title = req.body.title }
    if (req.body.price !== '') { productUpdate.price = Number(req.body.price) }
    if (req.body.thumbnail !== '') { productUpdate.thumbnail = req.body.thumbnail }
    
    return productsMongo.updateProduct(req.body.id, productUpdate)
    .then( resp => {
        if (resp.acknowledged === true) {
            return productsMongo.getById(req.body.id)
            .then( resp => {
                let productList = resp;
                res.render('adminResponse', { productList, message: 'Product Updated'})

            })
        }
    })
    .catch( resp => {
        res.render('error', { message: `This product does not exist: \n${resp.message}`})
    })
})



module.exports = adminRouter