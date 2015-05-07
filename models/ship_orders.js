"use strict";

module.exports = function(sequelize, DataTypes) {
  
  var ShipOrder = sequelize.define("ShipOrder", {
    
  	notes : DataTypes.STRING,
    comments : DataTypes.STRING,
        
  },{
  	classMethods : {
  		associate: function(models){

  			 ShipOrder.belongsTo(models.CustomerOrder);
         ShipOrder.belongsTo(models.DeliveryPerson);

  		}
  	}
  });

  return ShipOrder;

};

/* customerId, productId */
