"use strict";

module.exports = function(sequelize, DataTypes) {
  
  var DeviceType = sequelize.define("DeviceType", {
    
  	type : DataTypes.STRING,
    
  },{
  	classMethods : {
  		associate: function(models){
  			 DeviceType.hasMany(models.CustomerDevice);
  		}
  	}
  });

  return DeviceType;

};
