"use strict";

module.exports = function(sequelize, DataTypes) {
  
  var TimeZone = sequelize.define("TimeZone", {
    
  	currentTimeZone : DataTypes.STRING,
    currenttimeZoneDiff: DataTypes.STRING,
    userId : DataTypes.STRING
        
  });

  return TimeZone;

};
