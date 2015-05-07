"use strict";

module.exports = function(sequelize, DataTypes) {
  
  var CustomerOrder = sequelize.define("CustomerOrder", {
    
    customerName : DataTypes.STRING,
    placedDate : DataTypes.STRING,
    totalQuantity : DataTypes.INTEGER,
    totalPrice : DataTypes.STRING

  },{

    classMethods : {
      associate: function(models){        
        CustomerOrder.hasMany(models.Order);
        CustomerOrder.belongsTo(models.Customer);
        CustomerOrder.belongsTo(models.OrderStatus);
      }
    }
  });

  return CustomerOrder;

};



