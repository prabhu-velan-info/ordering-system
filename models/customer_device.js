"use strict";

module.exports = function(sequelize, DataTypes) {
  
  var CustomerDevice = sequelize.define("CustomerDevice", {
    
  	deviceToken : DataTypes.STRING
    
  },{
  	classMethods : {
  		associate: function(models){
  			 CustomerDevice.belongsTo(models.Customer);
         CustomerDevice.belongsTo(models.DeviceType);
  		}
  	}
  });

  return CustomerDevice;

};
