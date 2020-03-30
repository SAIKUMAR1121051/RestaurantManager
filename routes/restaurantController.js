const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const restaurant = require("../models/restaurant.js");
const membership = require("../models/membership.js");
var ObjectId = require('mongodb').ObjectId;


// Routes
/**
* @swagger
* /api/v1/restaurants:
*   get:
*     description: get all restaurant details
*     responses:
*       '200':
*         description: OK
*/
router.get("/", (req, res, next) => {
    restaurant.find().populate('membership')
      .select("title location _id membershipId")
      .exec()
      .then(docs => {
        const response = {
          count: docs.length,
          restaurants: docs.map(doc => {
            return {
              title: doc.title,
              location: doc.location,
              _id: doc._id,
              membershipId: doc.membershipId,
              request: {
                type: "GET",
                url: "http://159.65.32.185:3000/api/v1/restaurants/" + doc._id
              }
            };
          })
        };
        res.status(200).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });
  

  // Routes
/**
* @swagger
* /api/v1/restaurants:
*   post:
*     description: adds an restaurant
*     parameters:
 *       - name: title
 *         in: formData
 *         type: string
 *         required: true
 *       - name: location
 *         in: formData
 *         type: string
 *         required: true   
 *       - name: membershipId
 *         in: formData
 *         type: string
 *         required: true      
*     responses:
*       '200':
*         description: OK
*/
  router.post("/", (req, res, next) => {
    console.log(req.body.membershipId)
    membership.findById(req.body.membershipId)
      .then(membership => {
        console.log(""+membership)
        if (!membership) {
          return res.status(404).json({
            message: "Membership not found"
          });
        }
    const rest = new restaurant({
      title: req.body.title,
      location: req.body.location,
      membershipId: req.body.membershipId
    });
    
    rest.save().then(result => {
        console.log(result);
        res.status(201).json({
          message: "Restaurant Created successfully",
          createdRestaurant: {
              _id: result._id,
              title: result.title,
              location: result.location,
              membershipId: result.membership,
              request: {
                  type: 'GET',
                  url: "http://159.65.32.185:3000/api/v1/restaurants/" + result._id
              }
          }
        });
      });
  
    }).catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
          
        });
      });
  });

// Routes
/**
* @swagger
* /api/v1/restaurants/{restaurantId}:
*   get:
*     description: gets an particular restaurant details
*     parameters:
 *       - name: restaurantId
 *         in: path
 *         type: string
 *         required: true
*     responses:
*       '200':
*         description: OK
*/
  router.get("/:restaurantId", (req, res, next) => { 
    const id = req.params.restaurantId;
    restaurant.findById(id)
      .select('title location _id membershipId')
      .exec()
      .then(doc => {
        console.log(doc);
        if (doc) {
          res.status(200).json({
              restaurant: doc,
              request: {
                  type: 'GET',
                  url: 'http://159.65.32.185:3000/api/v1/restaurants'
              }
          });
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });


  // Routes
/**
* @swagger
* /api/v1/restaurants/{restaurantId}:
*   patch:
*     description: updates an restaurant details
*     parameters:
 *       - name: title
 *         in: formData
 *         type: string
 *         required: true
 *       - name: location
 *         in: formData
 *         type: string
 *         required: true   
 *       - name: membershipId
 *         in: formData
 *         type: string
 *         required: true
 *       - name: restaurantId
 *         in: path
 *         type: string
 *         required: true
*     responses:
*       '200':
*         description: OK
*/
  router.patch("/:restaurantId", (req, res, next) => {
    const restaurantId = req.params.restaurantId;
    console.log(req.body)
    restaurant.update({_id:restaurantId},{$set: req.body})
      .exec()
      .then(result => { 
        res.status(200).json({
            message: 'Restaurant updated.',
            request: {
                type: 'GET',
                url: 'http://159.65.32.185:3000/api/v1/restaurants/' + restaurantId
            }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

  // Routes
/**
* @swagger
* /api/v1/restaurants/{restaurantId}:
*   delete:
*     description: delete an particular restaurant
*     parameters:
 *       - name: restaurantId
 *         in: path
 *         type: string
 *         required: true
*     responses:
*       '200':
*         description: OK
*/
  router.delete("/:restaurantId", (req, res, next) => {
    const id = req.params.restaurantId;
    restaurant.remove({ _id: id })
      .exec()
      .then(result => {
        res.status(200).json({
            message: 'Restaurant deleted',
            request: {
                type: 'GET',
                url: 'http://159.65.32.185:3000/api/v1/restaurant',
                body: { title: 'String', location: 'String', membership: 'String'}
            }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });


  module.exports = router;