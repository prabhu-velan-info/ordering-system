"use strict";

module.exports = function(sequelize, DataTypes) {
  
  var Order = sequelize.define("Order", {
    
  	productName : DataTypes.STRING,
    imageUrl : DataTypes.STRING,
    discount : DataTypes.STRING,
    salePrice : DataTypes.STRING,
    quantity : DataTypes.STRING,
    totalPrice : DataTypes.STRING,
    
  },{
  	classMethods : {
  		associate: function(models){
  			 Order.belongsTo(models.CustomerOrder);
         Order.belongsTo(models.Product);
  		}
  	}
  });

  return Order;

};

/* customerId, productId */
