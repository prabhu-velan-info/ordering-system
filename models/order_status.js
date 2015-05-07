"use strict";

module.exports = function(sequelize, DataTypes) {
  
  var OrderStatus = sequelize.define("OrderStatus", {
    
  	status : DataTypes.STRING,
    
  },{
  	classMethods : {
  		associate: function(models){
  			 OrderStatus.hasMany(models.CustomerOrder);
  		}
  	}
  });

  return OrderStatus;

};
