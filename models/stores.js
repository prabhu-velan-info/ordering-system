"use strict";

module.exports = function(sequelize, DataTypes) {
  
  var Store = sequelize.define("Store", {
    
  	name : DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    addedBy: DataTypes.STRING,
    
  });

  return Store;

};
