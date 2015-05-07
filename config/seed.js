var bcrypt = require('bcrypt-nodejs');
var db = require('../models');


//Purpose : The function is to convert the user password to hash
//Input   : password
//Output   : passwordHash
var generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


///Seed Section
createSampleAdmins();
createSampleCustomer();
createSampleDeliveryPersons();
createSampleCategory();
createOrderStatus();
createDeviceTypes();

//call this Function to add sample Products
//input callback
//output creates sample category
createCategory(function(err, category){
      
  if(!err){
    for(loop = 0; loop < 2; loop++){

      db.Product.create({
        "productName" : "product"+loop,
        "price" : "1000",
        "description" : "desc",
        "categoryName" : category.categoryName,
        "imageUrl" : "test/image.png",
        "quantity" : "20",
        "inStock" : "Available",
        "startDate" : "25/04/2015",
        "endDate" : "25/04/2015",
        "discount" : "10",
        "salePrice" : "900",
        "CategoryId" : category.id
      }).complete(function(err, record){
        if(!err){
          // response = {"status":true, "message" : "Product successfully created!"};
          console.log("Sample Product Created");

        }
        else{
          throw new Error("Product creation failed...!");
          console.log("Sample Cannot created!");
        }
      });

    }
  }

});

//End of seed section






//Purpose : The function to add sample admi data
//Input   : none
//Output   : add sample admin
function createOrderStatus(){
 
  var states = ["new", "pending", "confirmed", "delivered", "cancelled"];
  for(loop = 0; loop < states.length; loop++){

    db.OrderStatus.create({"status" : states[loop]}).success(function(record) {

        if (!record) {
          throw err;
        } else {
          console.log("Status created");
        }

    });

  }
  
}

//Purpose : The function to default device types
//Input   : none
//Output   : add sample device types
function createDeviceTypes(){
 
  var types = ["android", "ios"];

  for(loop = 0; loop < types.length; loop++){

    db.DeviceType.create({"type" : types[loop]}).success(function(record) {

        if (!record) {
          throw err;
        } else {
          console.log("Device Type updated");
        }

    });

  }
  
}






//Purpose : The function to add sample admi data
//Input   : none
//Output   : add sample admin
function createSampleAdmins(){
  for(loop = 0; loop < 3; loop++){
    var hashedPassword = generateHash("Comet123$")
    db.Admin.create({
      'name' : "admin"+loop,
      'email' : "admin"+loop+"@admin.com",
      'password' : hashedPassword
    }).success(function(record) {

      if (!record) {
        throw err;
      } else {
        var newUser = record.values;
        console.log("Admin Successfully created");
      }

    });
  }
}

//Purpose : The function to add sample customer data
//Input   : none
//Output   : add sample customers
function createSampleCustomer(){
  for(loop = 0; loop < 3; loop++){

    var hashedPassword = generateHash("Comet123$")
    db.Customer.create({'name' : "customer"+loop, 'email' : "customer"+loop+"@customer.com", 'password': hashedPassword, 'storeName' : 'Sample Store Name', 'address' : 'Sample Address', 'phone' : '1234567980' }).success(function(record){                                            
        if(!record){
            throw err;
        }
        else{
            var newUser = record.values;
            console.log("----New USER----");
            console.log("Customer Record Saved!");
        }            
    });

  }

}


//Purpose : The function to add sample delivery person data
//Input   : none
//Output   : add sample delivery person
function createSampleDeliveryPersons(){
  for(loop = 0; loop < 3; loop++){
    var hashedPassword = generateHash("Comet123$")
    db.DeliveryPerson.create({
      'name' : "dperson"+loop,
      'email' : "dperson"+loop+"@dperson.com",
      'phone' : "123456789",
      'password' : hashedPassword
    }).success(function(record) {

      if (!record) {
        throw err;
      } else {
        var newUser = record.values;
        console.log("Delivery Person Successfully created to test List Delivery Person feature");
      }

    });
  }
}

//Function to create a new Category if its not available
//input callback
//output true or false
function createCategory(callback){

  db.Category.findAll().complete(function(err, categoryPresent){

    if(err)
      throw new Error(err);

    //Category Present so add
    if(categoryPresent.length ==0){

      db.Category.create({"categoryName" : "Test categoryName", "imageUrl": "Sample path"}).complete(function(err, record){
        if(!err){
          console.log("Category is empty so Test case created a new Category!");
          var categoryRecord = record.values;
          callback(null, categoryRecord);
        }
        else{
          throw new Error("Category creation failed...!");
          console.log("Category creation failed...!");
          callback(false, "Category creation failed...!");
        }
      });
    }
    else{
      var categoryRecord = categoryPresent[0].values;
      callback(null, categoryRecord);
    }
        
  });
}


    
//Purpose : The function to add category info
//Input   : none
//Output   : add sample categoruy info
function createSampleCategory(){

 for(var loop = 0; loop < 2; loop++){
    
   db.Category.create({"name" : "Test" + loop, "imageUrl": "test/image"}).complete(function(err, record){
     if(!err){       
       console.log("Category created");
     }
     else{
       throw new Error("Category creation failed...!");
       console.log("Category cannot created");
     }
   }); 

 } 
}