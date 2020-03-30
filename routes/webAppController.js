const express = require("express");
const router = express.Router();
const fetch = require('node-fetch');

router.get('/',function(req,res){

    res.render('index');
});

router.get('/restaurant',function(req,res){

    fetch('http://159.65.32.185:3000/api/v1/restaurants').then(res => res.json()).then(json => {
        var restaurants = json.restaurants;
        console.log(restaurants);
        res.render('restaurants',{data: restaurants});
    })

});

router.get('/membership',function(req,res){

    fetch('http://159.65.32.185:3000/api/v1/memberships').then(res => res.json()).then(json => {
        var memberships = json.membership;
        console.log(memberships);
        res.render('memberships',{data: memberships});
    })

});

router.delete('/restaurant/:id',function(req,res){
    console.log("hhh")
    fetch('http://159.65.32.185:3000/api/v1/restaurants/'+req.params.id,{
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(result => result.json()).then(result => {res.redirect('restaurant')});
});

router.get('/addRestaurant',function(req,res){

    fetch('http://159.65.32.185:3000/api/v1/memberships').then(res => res.json()).then(json => {
        var memberships = json.membership;
        res.render('addRestaurant',{data: memberships});
    })

});

router.get('/updateRestaurant/:restaurantId', function(req,res){

    console.log('hitting in update get');
    console.log(req.params.restaurantId);
    
    fetch('http://159.65.32.185:3000/api/v1/restaurants/'+req.params.restaurantId).then(res => res.json()).then(json => {
        var restaurant = json.restaurant;
        res.render('updateRestaurant',{data: restaurant});
    })

});

router.post('/updateRestaurant', function(req, res){
    console.log('hitting in patch');
    
    console.log(req.body);
   
    var body= {
        'title':req.body.title,
        'location':req.body.location 
    };
    fetch('http://159.65.32.185:3000/api/v1/restaurants/'+req.body.restaurantId, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()).then(json => {
        var restaurant = json.restaurant;
        res.redirect('restaurant');
    })

})











router.get('/updateMembership/:membershipId', function(req,res){

    console.log('hitting in update get membership');
    console.log(req.params.membershipId);
    
    fetch('http://159.65.32.185:3000/api/v1/memberships/'+req.params.membershipId).then(res => res.json()).then(json => {
        var membership = json.membership;
        res.render('updateMembership',{data: membership});
    })

});

router.post('/updateMembership', function(req, res){
    console.log('hitting in patch post Membership');
    
    console.log(req.body);
   
    var body= {
        'name':req.body.name,
        'contact':req.body.contact 
    };
    fetch('http://159.65.32.185:3000/api/v1/memberships/'+req.body.membershipId, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()).then(json => {
        console.log(json);
        //var restaurant = json.restaurant;
        res.redirect('membership');
    })

})


router.post('/restaurant',function(req,res){

    var body = req.body;
    console.log(body);
    fetch('http://159.65.32.185:3000/api/v1/restaurants',{
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json()).then(json => {  res.redirect('/restaurant');})
});

module.exports = router;