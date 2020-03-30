const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fetch = require('node-fetch');
const membership = require("../models/membership.js");
const restaurant = require("../models/restaurant.js");


// Routes
/**
* @swagger
* /api/v1/memberships:
*   get:
*     description: request all memberships
*     responses:
*       '200':
*         description: OK
*/
router.get("/", (req, res, next) => {
    membership.find()
    .populate('restaurant')
    .exec()
    .then(docs => {
      res.status(200).json({
        membership: docs.map(item => {
          return {
            _id: item._id,
            name: item.name,
            contact: item.contact,
            request: {
              type: "GET",
              url: "http://159.65.32.185:3000/api/v1/memberships/" + item._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

// Routes
/**
* @swagger
* /api/v1/memberships:
*   post:
*     description: add an membership
*     parameters:
 *       - name: name
 *         in: formData
 *         type: string
 *         required: true
 *       - name: contact
 *         in: formData
 *         type: string
 *         required: true   
 *     
*     responses:
*       '200':
*         description: OK
*/
router.post("/", (req, res, next) => {
    console.log(req.body.name);

    const memship = new membership({
      name: req.body.name,
      contact: req.body.contact
    });
    memship.save().then(result => {
    console.log(result);
    res.status(201).json({
      message: "Membership saved",
      createdMembership: {
        _id: result._id,
        name: result.name,
        contact: result.contact
      },
      request: {
        type: "GET",
        url: "http://159.65.32.185:3000/api/v1/memberships/" + result._id
      }
    })
  
}).catch(err => {
console.log(err);
res.status(500).json({
  error: err
});
});;

});

// Routes
/**
* @swagger
* /api/v1/memberships/{membershipId}:
*   get:
*     description: get an particular membership details
*     parameters:   
 *       - name: membershipId
 *         in: path
 *         type: string
 *         required: true
*     responses:
*       '200':
*         description: OK
*/
router.get("/:membershipId", (req, res, next) => {
    membership.findById(req.params.membershipId)
    .exec()
    .then(membership => {
      if (!membership) {
        return res.status(404).json({
          message: "Membership not found"
        });
      }
      res.status(200).json({
        membership: membership,
        request: {
          type: "GET",
          url: "http://159.65.32.185:3000/api/v1/memberships"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});



// Routes
/**
* @swagger
* /api/v1/memberships/{membershipId}:
*   delete:
*     description: delete an particular membership
*     parameters:   
 *       - name: membershipId
 *         in: path
 *         type: string
 *         required: true
*     responses:
*       '200':
*         description: OK
*/
router.delete("/:membershipId", (req, res, next) => {
    membership.remove({ _id: req.params.membershipId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Membership deleted",
        request: {
          type: "POST",
          url: "http://159.65.32.185:3000/api/v1/memberships",
          body: { membershipId: "ID", quantity: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});


// Routes
/**
* @swagger
* /api/v1/memberships/{membershipId}:
*   put:
*     description: update an particular membership
*     parameters:
 *       - name: name
 *         in: formData
 *         type: string
 *         required: true
 *       - name: contact
 *         in: formData
 *         type: string
 *         required: true   
 *       - name: membershipId
 *         in: path
 *         type: string
 *         required: true 
*     responses:
*       '200':
*         description: OK
*/
router.put("/:membershipId", (req, res, next) => {
    const membershipId = req.params.membershipId;
    console.log(req.body)
    membership.updateMany({_id:membershipId},{$set: req.body})
      .exec()
      .then(result => { 
        res.status(200).json({
            message: 'Membership updated.',
            request: {
                type: 'GET',
                url: 'http://159.65.32.185:3000/api/v1/memberships/' + membershipId
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