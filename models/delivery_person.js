"use strict"

module.exports = function(sequelize, DataTypes){

	var DeliveryPerson = sequelize.define("DeliveryPerson",{

		name : DataTypes.STRING,
		password : DataTypes.STRING,
		email : DataTypes.STRING,
		phone : DataTypes.STRING,
		deviceToken : {type : DataTypes.STRING, defaultValue : null },
		GPSLat : {type : DataTypes.STRING, defaultValue : null },
		GPSLong : {type : DataTypes.STRING, defaultValue : null }
	
	});

	return DeliveryPerson;
};