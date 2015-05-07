"use strict";

module.exports = function(sequelize, DataTypes) {
  
  var Admin = sequelize.define("Admin", {
    
  	name : DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    
  });

  return Admin;

};
