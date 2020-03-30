const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const restRoutes = require("./routes/restaurantController.js");
const membRoutes = require("./routes/membershipController.js");
const webApiRoutes = require("./routes/webAppController.js");
const path =require('path');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require ('swagger-ui-express');

const swaggerOptions ={
swaggerDefinition: {
  info: {
    title: 'Restaurant api',
    description: 'implementation of swagger for restaurant api',
    contact: {
      name:' sai Kumar Erpina'
    },
    basePath:"/api/v1",
    servers:["http://localhost:3000"]
  }
},
apis: ['./routes/membershipController.js', './routes/restaurantController.js']
}

const swaggerDocs= swaggerJsDoc(swaggerOptions);




app.use('/assets',express.static('assets'));
app.set('view engine','ejs');

mongoose.connect(
  "mongodb+srv://SAIKUMAR112:Skerpina@112@midterm-cnomu.mongodb.net/test?retryWrites=true&w=majority",
    {
       useNewUrlParser: true,useUnifiedTopology:true 
    }
);
mongoose.Promise = global.Promise;

//app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});


app.use("/api/v1/restaurants", restRoutes);
app.use("/api/v1/memberships", membRoutes);
app.use("/", webApiRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/v1', express.static(path.join(__dirname, 'routes')));
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });
  
  app.listen(3000);