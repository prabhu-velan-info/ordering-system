"use strict";

module.exports = function(sequelize, DataTypes) {
  
  var Product = sequelize.define("Product", {
    
  	productName : DataTypes.STRING,
    price : DataTypes.STRING,
    description : DataTypes.STRING,
    categoryName : DataTypes.STRING,
    imageUrl : DataTypes.STRING,
    quantity : DataTypes.STRING,
    inStock : DataTypes.STRING,
    startDate : DataTypes.STRING,
    endDate : DataTypes.STRING,
    discount : DataTypes.STRING,
    salePrice : DataTypes.STRING
    
  },{
  	classMethods : {
  		associate: function(models){

  			 Product.belongsTo(models.Category);
         Product.hasMany(models.Order);
  		
      }
  	}

  });

  return Product;

};
