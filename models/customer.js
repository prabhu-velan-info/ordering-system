"use strict"

module.exports = function(sequelize, DataTypes){

	var Customer = sequelize.define("Customer",{

		authentication_token : DataTypes.STRING,
		name : DataTypes.STRING,
		email : DataTypes.STRING,
		password : DataTypes.STRING,
		storeName : DataTypes.STRING,
		address : DataTypes.STRING,
		phone : DataTypes.STRING,
		GPSLat : {type : DataTypes.STRING, defaultValue : null },
		GPSLong : {type : DataTypes.STRING, defaultValue : null }	

	},{
	    classMethods : {
	      associate: function(models){
	         Customer.hasMany(models.CustomerOrder);
	      }
	    }
  });

	return Customer;

};