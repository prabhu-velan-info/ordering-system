var userCurrentTimeZone = null;
var selectedOrderState = null;
var socket = null;

//Function will be used to make API
//Input : path, type, params, callback
//Output : response will be send to the callback function
function makeAPI(path, type, params, callback) {
	
	showLoader();
	$.ajax({
		type : type,
		url : path,
		data : params,
		success : function(data) {
			hideLoader();
			callback(data);
		}
	});
}


//Function loads the local time zone from the given page
//Input : name, value
//Output : Storing data in cache
function loadTimeZone(){

	apiPath = "/getTimeZone";
	makeAPI(apiPath, "post", null, function(response){	
		if(response.data != undefined){
			userCurrentTimeZone = response.data.currenttimeZoneDiff;
		}		
	});	

}

//Function allows to create a cookie and store selected Timezone and the Timezone difference
//Input : name, value
//Output : Storing data in cache
function saveTimeZone(timezoneString, userId){
	var timeZoneDiff = timezoneString.substr(5,6); 
	var currentTimeZone = timezoneString;

	var data = {
		"currentTimeZoneDiff" : timeZoneDiff,
		"currentTimeZone" : timezoneString,
	};

	apiPath = "/saveTimeZone";
	makeAPI(apiPath, "post", data, function(response){			
		// if(response["status"])
		// 	resetFormFields("#myForm");
		showNotification(response["message"], response["status"]);
		
	});	

}

//Function will load the timezones in the timezones page
//Input : no iput required
//Output : it will change the data once it loaded
function loadTimeZonesPage(){

	apiPath = "/getTimeZone";
	makeAPI(apiPath, "post", null, function(response){	
		if(response.data != undefined){
			$("select option:selected").text(response.data.currentTimeZone);
		}
	});		

}


//Function will add a new Category
//Input : formId
//Output : shows the status of the request
function addCategory(formId){
	//validating the form fields
	if(validateForm(formId)){
		submitMultiPartForm(formId);		
	}

}

//Function will add a new Product based on category
//Input : formId
//Output : shows the status of the request
function addProduct(formId){
	//validating the form fields
	if(validateForm(formId) && checkDateFormat("#StartDate", "#EndDate")){
		submitMultiPartForm(formId);
	}

}

//Function will submit form field with the multipart data
//Input : formId
//Output : submit form data with status
function submitMultiPartForm(formId){
	
	$(formId).submit(function(e)
	{
	 
	    var formObj = $(this);
	    var formURL = formObj.attr("action");
	    var formData = new FormData(this);

	  $.ajax({
	        url: formURL,
	    type: 'POST',
	        data:  formData,
	   
	    mimeType:"multipart/form-data",
	    contentType: false,
	        cache: false,
	        processData:false,
	    success: function(data)
	    {	
	    	//Convert result string to json format
	    	var response = JSON.parse(data);

	        if(response["status"])
	        	resetFormFields(formId);

	        //showing the status of the form after submission
	        showNotification(response["message"], response["status"]);

	    },
	     error: function(jqXHR, textStatus, errorThrown) 
	     {
	     	console.log(textStatus);
	     	console.log(errorThrown);
	     }          
	    });

	     e.preventDefault(); //STOP default action
  		 e.unbind(); //unbind. to stop multiple form submit.
	}); 
	//submit the form data
	$(formId).submit();

}

// //Function will add a new Product based on category
// //Input : no Input fields required
// //Output : redirects to dashboard
// function addProduct(){

// 	var data = {
// 		name : $("#Name").val(),
// 		email : $("#Email").val(),
// 		password : $("#Password").val()
// 	};

// 	if(validateForm("#myForm")){
// 		apiPath = "/addProduct";
// 		makeAPI(apiPath, "post", data, function(response){			
// 			if(response["status"])
// 				resetFormFields("#myForm");
// 			showNotification(response["message"], response["status"]);
			
// 		});	
// 	}

// }

//Function will add loader on the screen
//Input : no Input fields required
//Output : display the loading icon
function showLoader(){
	$('#loading').html('<img src="/images/loadingIcon.gif" witdth="30px" height="30px">').show();
}

//Function will hide loader on the screen
//Input : no Input fields required
//Output : hide the loading icon
function hideLoader(){
	$('#loading').html('<img src="/images/loadingIcon.gif" witdth="30px" height="30px">').hide();	
}
//Function will add a new DeliveryPerson to the ordering system
//Input : no Input fields required
//Output : redirects to dashboard
function addDeliveryPerson(){
	var data = {
		name : $("#Name").val(),
		email : $("#Email").val(),
		password : $("#Password").val(),
		phone : $("#Phone").val()
	};
	if(validate("#myForm")){
		apiPath = "/addDeliveryPerson";
		makeAPI(apiPath, "post", data, function(response){			
			if(response["status"])
				resetFormFields("#myForm");

			showNotification(response["message"], response["status"]);

		});	
	}

}

//Function will add a new Admin  to the ordering system
//Input : no Input fields required
//Output : redirects to dashboard
function addAdmin(){
	var data = {
		name : $("#Name").val(),
		email : $("#Email").val(),
		password : $("#Password").val(),
	};
	if(validate("#myForm")){
		apiPath = "/addAdmin";
		makeAPI(apiPath, "post", data, function(response){			
			if(response["status"])
				resetFormFields("#myForm");

			showNotification(response["message"], response["status"]);

		});	
	}

}

//Function will add a new Customer 
//Input : no Input fields required
//Output : displays the alert message
function addCustomer(){
	var data = {
		name : $("#Name").val(),
		email : $("#Email").val(),
		password : $("#Password").val(),	
		storeName : $("#StoreName").val(),
		address : $("#Address").val(),
		phone : $("#Phone").val(),
	};
	if(validate("#myForm")){
		apiPath = "/addCustomer";
		makeAPI(apiPath, "post", data, function(response){			
			if(response["status"])
				resetFormFields("#myForm");

			showNotification(response["message"], response["status"]);

		});	
	}

}

//This function will Update Product information
//Input : no Input fields required
//Output : displays the alert message
function updateProduct(){
	
	if(validateForm("#myForm") && checkDateFormat("#StartDate", "#EndDate")){
		var data = {
			
			name : $("#Name").val(),
			price : $("#Price").val(),
			description : $("#Description").val(),	
			quantity : $("#Quantity").val(),

			startDate : $("#StartDate").val(),
			endDate : $("#EndDate").val(),
			discountPercent : $("#DiscountPercent").val(),
			salePrice : $("#SalePrice").val(),

			categoryName : $("#CategoryName").val(),
			inStock : $("#InStock").val(),

		};
		
		apiPath = "/editProduct/" + $("#productId").val();
		makeAPI(apiPath, "post", data, function(response){			
			
			if(response["status"]){				
				window.location.replace("/listUpdatedProduct");
			}
			else{
				showNotification(response["message"], response["status"]);
			}			

		});	
		
	}

}

//Function will load list of admins alredy registered
//Input : no Input fields required
//Output : returns list of Admin details
function loadAdminLists(){

	apiPath = "/listAdmin";
	makeAPI(apiPath, "post", null, function(data){
		
		updateAdminListTable(data["response"]);
		if(data["message"] != undefined && data["message"] != "")
			showNotification(data["message"], data["status"]);
	
	});	

}

//Function will load list of products alredy added
//Input : no Input fields required
//Output : returns list of Admin details
function loadProductLists(){

	apiPath = "/listProduct";
	makeAPI(apiPath, "post", null, function(data){
		
		updateProductListTable(data["response"]);
		if(data["message"] != undefined && data["message"] != "")
			showNotification(data["message"], data["status"]);
	
	});	

}

//Function will load list of Categories that are already registered
//Input : no Input fields required
//Output : returns list of category list
function loadCategoryLists(){

	apiPath = "/listCategory";
	makeAPI(apiPath, "post", null, function(data){
		
		// alert(JSON.stringify(data));
		updateCategoryListTable(data["response"]);
		if(data["message"] != undefined && data["message"] != "")
			showNotification(data["message"], data["status"]);
	
	});	
}

//Function will load list of Delivery already registered
//Input : no Input fields required
//Output : returns list of DeliveryPersons details
function loadDeliveryPersonsLists(){

	apiPath = "/listDeliveryPerson";
	makeAPI(apiPath, "post", null, function(data){
		
		updateDeliveryPersonsListTable(data["response"]);
		if(data["message"] != undefined && data["message"] != "")
			showNotification(data["message"], data["status"]);
	
	});	

}

//Function will load list of load customers already registered
//Input : no Input fields required
//Output : returns list of Admin details
function loadcustomerLists(){

	apiPath = "/listCustomer";
	makeAPI(apiPath, "post", null, function(data){
		
		updateCustomerListTable(data["response"]);
		if(data["message"] != undefined && data["message"] != "")
			showNotification(data["message"], data["status"]);
	
	});	

}

//Function will load todays order counts
//Input : no Input fields required
//Output : returns list of Admin details
function loadTodaysOrdersCount(){

	apiPath = "/todaysOrderCount";
	makeAPI(apiPath, "post", null, function(data){
		
		updateOrderCountTable(data["response"]);

	});	

}

//Function will load all orders with its states
//Input : no Input fields required
//Output : returns list of Orders with all state details
function loadAllOrdersList(){

	selectedOrderState = "allOrders";
	
	apiPath = "/allOrders";
	makeAPI(apiPath, "post", null, function(data){
		
		updateAllOrdersTable(data["response"]);
		if(data["message"] != undefined && data["message"] != "")
			showNotification(data["message"], data["status"]);

	});	

}

//Function will load all orders byt its states
//Input : orderState
//Output : returns list of Orders with all state details
function loadOrdersListByState(orderState){

	apiPath = "/getOrderBystatus";
	
	var data = {
		orderState : orderState
	};	
	
	//set the selected order state;
	selectedOrderState = orderState;

	makeAPI(apiPath, "post", data, function(data){
		
		updateAllOrdersByStatus(data["response"]);
		if(data["message"] != undefined && data["message"] != "")
			showNotification(data["message"], data["status"]);

	});	

}


// //Function to will Convert the time to localtime
// //Input : dateString
// //Output : Local Time
function converToUserTimezone(dateString){
  
  //The following line will convert it into GMT time and converts it into normal time
  var dateTime = new Date(dateString).toLocaleString();

  //Getting the timezone diff for time zone calculation
  var timeZoneDiff = userCurrentTimeZone; //readCookie("timeZoneDiff");
  if(timeZoneDiff != undefined){
  	convertedDateString = new Date(dateString);
  	dateTime = moment(new Date(convertedDateString)).zone(timeZoneDiff).format("DD/MM/YYYY HH:mm a");	
  }

  return dateTime;
  
}


//Function will load Todays Orders Count table
//Input : ordersCount
//Output : sets the loaded data into a table
function updateOrderCountTable(ordersCount){
		
	var row = null;
	var orderStates = JSON.parse(ordersCount);
	var states = ["new", "pending", "confirmed", "delivered","cancelled"];
	if(ordersCount != undefined){

		row = "<thead><tr>"
		row += "<th colspan=5  style='text-align: center;'>Today's Orders</th>"
		row += "</tr><tr>"
		row += "<th>New</th>"
		row += "<th>Pending</th>"	
		row += "<th>Confirmed</th>"	
		row += "<th>Delivered</th>"
		row += "<th>Cancelled</th>"
		row += "</tr></thead><tr>";
		
		for(loop = 0; loop < 5; loop++){
			row += "<td  id = " + orderStates[states[loop]] +">" + orderStates[states[loop]] + "</td>"
		}

		row +="</tr>"
		$("#todaysOrders").html(row);
	}

}

//Function will load orders list based on the orders status
//Input : ordersList
//Output : loads the orders in a table based on the states
function updateAllOrdersByStatus(ordersList){

	var rowCount = $('#allOrdersTable tr').length;
	if(rowCount > 3){
		$('#allOrdersTable').dataTable().fnDestroy();
	}
	var stateColors = {"new" : "#FFFFFF","pending" : "#FAF9DD","confirmed" : "#CFFCD4","delivered" : "#C9FAFF","cancelled" : "#FCBDBD"};

	var row = null;
	row = "<thead><tr>"
	row += "<th>Customer Name</th>"
	row += "<th>Placed Date</th>"	
	row += "<th>Total Quantity</th>"
	row += "<th>Total Price</th>"
	row += "<th>Status</th>"
	row += "<th>Options</th>"
	row += "</tr></thead>";

	row += "<tfoot><tr>"
	row += "<th>Customer Name</th>"
	row += "<th>Placed Date</th>"
	row += "<th>Total Quantity</th>"
	row += "<th>Total Price</th>"
	row += "<th>Status</th>"
	row += "<th>Options</th>"
	row += "</tr></tfoot>";
	if(ordersList.length > 0){

		for(loop = 0; loop < ordersList.length; loop++){
			
			row += "<tr id="+ordersList[loop].id+">"
			row += " <td>" + ordersList[loop].customerName + "</td>"
			row += " <td>" + ordersList[loop].placedDate + "</td>"
			
			row += " <td>" + ordersList[loop].totalQuantity + "</td>"
			row += " <td>" + ordersList[loop].totalPrice + "</td>"
			row += " <td style=background-color:"+stateColors[ordersList[loop].OrderStatus.status]+">" + ordersList[loop].OrderStatus.status + "</td>"
			row += chooseOptions(ordersList[loop]);
			row += "</tr>"
		}

		row +="</tr>"
		$("#allOrdersTable").html(row);
		$('#allOrdersTable').dataTable();
	}
	else{

		row += "<tr>"
		row += " <td colspan='5' style='text-align:center;'>no orders found</td>"
		row += "</tr>"
		$("#allOrdersTable").html(row);

	}
	
	loadTodaysOrdersCount();

}

//Function will set options for the current order based on order state in all orders page
//Input : currentOrder
//Output : set options for the specified state
function chooseOptions(currentOrder){

	selectedOrderState = currentOrder.OrderStatus.status;
	switch(currentOrder.OrderStatus.status){
		
		case "new":

					return " <td>" + "<input type=button name = viewOrder onclick = viewOrderData("+currentOrder.id+") id =  "+currentOrder.id+ "  value= VIEW > / <input type=button name = deleteOrder onclick = deleteOrderData("+currentOrder.id+") id =  "+currentOrder.id+ "  value= DELETE > " + "</td>"
					break;
		case "pending":

					return " <td>" + "<input type=button name = viewOrder onclick = viewOrderData("+currentOrder.id+") id =  "+currentOrder.id+ "  value= VIEW > / <input type=button onclick = confirmOrderData("+currentOrder.id+") id =  "+currentOrder.id+ "  value= CONFIRM > / <input type=button onclick = cancelOrderData("+currentOrder.id+") id =  "+currentOrder.id+ "  value= CANCEL > / <input type=button name = deleteOrder onclick = deleteOrderData("+currentOrder.id+") id =  "+currentOrder.id+ "  value= DELETE >" + "</td>"
					break;
		case "confirmed":

					return " <td>" + "<input type=button name = viewOrder onclick = viewOrderData("+currentOrder.id+") id =  "+currentOrder.id+ "  value= VIEW > / <input type=button name = cancelOrder onclick = cancelOrderData("+currentOrder.id+") id =  "+currentOrder.id+ "  value= CANCEL > / <input type=button name = deleteOrder onclick = deleteOrderData("+currentOrder.id+") id =  "+currentOrder.id+ "  value= DELETE >" + "</td>"
					break;
		case "delivered":

					return " <td>" + "<input type=button name = viewOrder onclick = viewOrderData("+currentOrder.id+") id =  "+currentOrder.id+ "  value= VIEW > / <input type=button name = deleteOrder onclick = deleteOrderData("+currentOrder.id+") id =  "+currentOrder.id+ "  value= DELETE > " + "</td>"
					break;
		case "cancelled":

					return " <td>" + "<input type=button name = viewOrder onclick = viewOrderData("+currentOrder.id+") id =  "+currentOrder.id+ "  value= VIEW > / <input type=button name = deleteOrder onclick = deleteOrderData("+currentOrder.id+") id =  "+currentOrder.id+ "  value= DELETE > " + "</td>"
					break;
		default : 

				return " <td>" + "<input type=button name = viewOrder onclick = viewOrderData("+currentOrder.id+") id =  "+currentOrder.id+ "  value= VIEW > / <input type=button name = deleteOrder onclick = deleteOrderData("+currentOrder.id+") id =  "+currentOrder.id+ "  value= DELETE > " + "</td>"
				break;

	}	

}

//Function will load all orders with its states
//Input : ordersList
//Output : update all orders table data
function updateAllOrdersTable(ordersList){

	var stateColors = {"new" : "#FFFFFF","pending" : "#FAF9DD","confirmed" : "#CFFCD4","delivered" : "#C9FAFF","cancelled" : "#FCBDBD"};

	var row = null;
	row = "<thead><tr>"
	row += "<th>Customer Name</th>"
	row += "<th>Placed Date</th>"	
	row += "<th>Total Quantity</th>"
	row += "<th>Total Price</th>"
	row += "<th>Status</th>"
	row += "<th>Options</th>"
	row += "</tr></thead>";

	row += "<tfoot><tr>"
	row += "<th>Customer Name</th>"
	row += "<th>Placed Date</th>"
	row += "<th>Total Quantity</th>"
	row += "<th>Total Price</th>"
	row += "<th>Status</th>"
	row += "<th>Options</th>"
	row += "</tr></tfoot>";
	if(ordersList.length > 0){

		for(loop = 0; loop < ordersList.length; loop++){
			
			row += "<tr id="+ordersList[loop].id+">"
			row += " <td>" + ordersList[loop].customerName + "</td>"
			row += " <td>" + ordersList[loop].placedDate + "</td>"
			
			row += " <td>" + ordersList[loop].totalQuantity + "</td>"
			row += " <td>" + ordersList[loop].totalPrice + "</td>"
			row += " <td style=background-color:"+stateColors[ordersList[loop].OrderStatus.status]+">" + ordersList[loop].OrderStatus.status + "</td>"

			// row += " <td>" + "<a href=/editOrder/" + ordersList[loop].id + " id = editOrder >EDIT</a> / <a href=/deleteOrder/"+ordersList[loop].id+ " id = deleteOrder >DELETE</a>" + "</td>"
			row += " <td>" + "<input type=button name = viewOrder onclick = viewOrderData("+ordersList[loop].id+") id =  "+ordersList[loop].id+ "  value= VIEW > / <input type=button name = deleteOrder onclick = deleteOrderData("+ordersList[loop].id+") id =  "+ordersList[loop].id+ "  value= DELETE >" + "</td>"
			// row += " <td>" + "<a href=/deleteOrder/"+ordersList[loop].id+ " id = deleteOrder >DELETE</a>" + "</td>"
			row += "</tr>"
		}

		row +="</tr>"
		$("#allOrdersTable").html(row);
		$('#allOrdersTable').dataTable();
	}
	else{

		row += "<tr>"
		row += " <td colspan='5' style='text-align:center;'>no orders found</td>"
		row += "</tr>"
		$("#allOrdersTable").html(row);
	}	
	

	loadTodaysOrdersCount();

}

//Function will load list of Customers  alredy registered
//Input : customerList
//Output : sets the loaded data into a table
function updateCustomerListTable(customerList){
	
	var customerRow = null;
	if(customerList.length > 0){
	
		customerRow = "<thead><tr>"
		customerRow += "<th>Name</th>"
		customerRow += "<th>Email</th>"	
		customerRow += "<th>Store Name</th>"	
		customerRow += "<th>Created At</th>"
		customerRow += "<th>Updated At</th>"
		customerRow += "<th>Options</th>"
		customerRow += "</tr></thead>";

		customerRow += "<tfoot><tr>"
		customerRow += "<th>Name</th>"
		customerRow += "<th>Email</th>"		
		customerRow += "<th>Store Name</th>"
		customerRow += "<th>Created At</th>"
		customerRow += "<th>Updated At</th>"
		customerRow += "<th>Options</th>"
		customerRow += "</tr></tfoot>";

		for(loop = 0; loop < customerList.length; loop++){
			customerRow += "<tr id="+customerList[loop].id+">"
			customerRow += " <td>" + customerList[loop].name + "</td>"
			customerRow += " <td>" + customerList[loop].email + "</td>"
			customerRow += " <td>" + customerList[loop].storeName + "</td>"
			customerRow += " <td>" + converToUserTimezone(customerList[loop].createdAt) + "</td>"
			customerRow += " <td>" + converToUserTimezone(customerList[loop].updatedAt) + "</td>"
			customerRow += " <td>" + "<a href=/editCustomer/" + customerList[loop].id + " id = editCustomer >EDIT</a> / <a href=/deleteCustomer/"+customerList[loop].id+ " id = deleteCustomer >DELETE</a>" + "</td>"
			customerRow += "</tr>"
		}
				
		$("#customerTable").html(customerRow);
	
	}
	else{
		// alert("No Categories users found");
	}

	//Add the following at the end of the line
	//setting pagination for this table
	$('#customerTable').dataTable();

}

//Function will load list of Category list alredy registered
//Input : categoryList
//Output : sets the loaded data into a table
function updateCategoryListTable(categoryList){
	var categoryRow = null;
	if(categoryList.length > 0){
	
		categoryRow = "<thead><tr>"
		categoryRow += "<th>Name</th>"
		categoryRow += "<th>Category Image</th>"		
		categoryRow += "<th>Created At</th>"
		categoryRow += "<th>Updated At</th>"
		categoryRow += "<th>Options</th>"
		categoryRow += "</tr></thead>";

		categoryRow += "<tfoot><tr>"
		categoryRow += "<th>Name</th>"
		categoryRow += "<th>Category Image</th>"
		categoryRow += "<th>Created At</th>"
		categoryRow += "<th>Updated At</th>"
		categoryRow += "<th>Options</th>"
		categoryRow += "</tr></tfoot>";

		for(loop = 0; loop < categoryList.length; loop++){
			categoryRow += "<tr id="+categoryList[loop].id+">"
			categoryRow += " <td>" + categoryList[loop].categoryName + "</td>"
			categoryRow += " <td><img src=" + categoryList[loop].imageUrl + " witdth = 100px height = 100px></td>"
			categoryRow += " <td>" + converToUserTimezone(categoryList[loop].createdAt) + "</td>"
			categoryRow += " <td>" + converToUserTimezone(categoryList[loop].updatedAt) + "</td>"
			categoryRow += " <td>" + "<a href=/editCategory/"+categoryList[loop].id+ " id = editCategory >EDIT</a> / <a href=/deleteCategory/"+categoryList[loop].id+ " id = deleteCategory >DELETE</a>" + "</td>"
			categoryRow += "</tr>"
		}
				
		$("#categorytable").html(categoryRow);
	
	}
	else{
		// alert("No Categories users found");
	}

	//Add the following at the end of the line
	//setting pagination for this table
	$('#categorytable').dataTable();

}

//Function will load list of DeliveryPersons alredy registered
//Input : DeliveryPersonUsers
//Output : sets the loaded data into a table
function updateDeliveryPersonsListTable(DeliveryPersonUsers){
	var DeliveryPersonRow = null;
	if(DeliveryPersonUsers.length > 0){

		DeliveryPersonRow = "<thead><tr>"
		DeliveryPersonRow += "<th>Name</th>"
		DeliveryPersonRow += "<th>Email</th>"
		DeliveryPersonRow += "<th>Phone</th>"	
		DeliveryPersonRow += "<th>Created At</th>"
		DeliveryPersonRow += "<th>Updated At</th>"
		DeliveryPersonRow += "<th>Options</th>"
		DeliveryPersonRow += "</tr></thead>";

		DeliveryPersonRow += "<tfoot><tr>"
		DeliveryPersonRow += "<th>Name</th>"
		DeliveryPersonRow += "<th>Email</th>"
		DeliveryPersonRow += "<th>Phone</th>"	
		DeliveryPersonRow += "<th>Created At</th>"
		DeliveryPersonRow += "<th>Updated At</th>"
		DeliveryPersonRow += "<th>Options</th>"
		DeliveryPersonRow += "</tr></tfoot>";

		for(loop = 0; loop < DeliveryPersonUsers.length; loop++){
			DeliveryPersonRow += "<tr id="+DeliveryPersonUsers[loop].id+">"
			DeliveryPersonRow += " <td>" + DeliveryPersonUsers[loop].name + "</td>"
			DeliveryPersonRow += " <td>" + DeliveryPersonUsers[loop].email + "</td>"
			DeliveryPersonRow += " <td>" + DeliveryPersonUsers[loop].phone + "</td>"
			DeliveryPersonRow += " <td>" + converToUserTimezone(DeliveryPersonUsers[loop].createdAt) + "</td>"
			DeliveryPersonRow += " <td>" + converToUserTimezone(DeliveryPersonUsers[loop].updatedAt) + "</td>"
			DeliveryPersonRow += " <td>" + "<a href=/editDeliveryPerson/"+DeliveryPersonUsers[loop].id+ " id = editDeliveryPerson >EDIT</a> / <a href=/deleteDeliveryPerson/"+DeliveryPersonUsers[loop].id+ " id = deleteDeliveryPerson >DELETE</a>" + "</td>"
			DeliveryPersonRow += "</tr>"
		}
		
		$("#deliveryPersonTable").html(DeliveryPersonRow);
	
	}
	else{
		// alert("No DeliveryPersons found");
	}

	//Add the following at the end of the line
	//setting pagination for this table
	$('#deliveryPersonTable').dataTable();

}


//Function will load list of Products alredy registered
//Input : productLists
//Output : sets the loaded data into a table
function updateProductListTable(productLists){
	
	var productRow = null;
	if(productLists.length > 0){
	
		productRow = "<thead><tr>"
		productRow += "<th>Product Name</th>"
		productRow += "<th>Category Name</th>"		
		productRow += "<th>Price</th>"
		productRow += "<th>Discount Percent</th>"
		productRow += "<th>Sale Price</th>"
		productRow += "<th>Quantity</th>"
		productRow += "<th>In Stock</th>"
		productRow += "<th>Start Date</th>"
		productRow += "<th>End Date</th>"
		productRow += "<th>Image</th>"
		productRow += "<th>Options</th>"
		productRow += "</tr></thead>";

		productRow += "<tfoot><tr>"
		productRow += "<th>Product Name</th>"
		productRow += "<th>Category Name</th>"		
		productRow += "<th>Price</th>"
		
		productRow += "<th>Discount Percent</th>"
		productRow += "<th>Sale Price</th>"
		productRow += "<th>Quantity</th>"
		productRow += "<th>In Stock</th>"
		
		productRow += "<th>Start Date</th>"
		productRow += "<th>End Date</th>"
		
		productRow += "<th>Image</th>"
		productRow += "<th>Options</th>"
		productRow += "</tr></tfoot>";

		for(loop = 0; loop < productLists.length; loop++){

			productRow += "<tr id="+productLists[loop].id+">"
			productRow += " <td>" + productLists[loop].productName + "</td>"
			productRow += " <td>" + productLists[loop].categoryName + "</td>"
			productRow += " <td>" + productLists[loop].price + "</td>"

			productRow += " <td>" + productLists[loop].discount +"%" + "</td>"
			productRow += " <td>" + productLists[loop].salePrice + "</td>"
			productRow += " <td>" + productLists[loop].quantity + "</td>"
			var inStock = (productLists[loop].quantity > 0)? "Available" : "UnAvailable";
			productRow += " <td>" + inStock + "</td>"

			productRow += " <td>" + productLists[loop].startDate + "</td>"
			productRow += " <td>" + productLists[loop].endDate + "</td>"

			productRow += " <td><img src=" + productLists[loop].imageUrl + " witdth = 100px height = 100px></td>"						
			productRow += " <td>" + "<a href=/editProduct/"+productLists[loop].id+ " id = editProduct >EDIT</a> / <a href=/deleteProduct/"+productLists[loop].id+ " id = deleteProduct >DELETE</a>" + "</td>"
			productRow += "</tr>"
		}
		$("#productsTable").html(productRow);
	
	}
	else{
		// alert("No Admin users found");
	}

	//Add the following at the end of the line
	//setting pagination for this table
	$('#productsTable').dataTable();

}

//Function will load list of AdminLists alredy registered
//Input : adminUsers
//Output : sets the loaded data into a table
function updateAdminListTable(adminUsers){
	var adminRow = null;
	if(adminUsers.length > 0){
	
		adminRow = "<thead><tr>"
		adminRow += "<th>Name</th>"
		adminRow += "<th>Email</th>"		
		adminRow += "<th>Created At</th>"
		adminRow += "<th>Updated At</th>"
		adminRow += "<th>Options</th>"
		adminRow += "</tr></thead>";

		adminRow += "<tfoot><tr>"
		adminRow += "<th>Name</th>"
		adminRow += "<th>Email</th>"
		adminRow += "<th>Created At</th>"
		adminRow += "<th>Updated At</th>"
		adminRow += "<th>Options</th>"
		adminRow += "</tr></tfoot>";

		for(loop = 0; loop < adminUsers.length; loop++){
			adminRow += "<tr id="+adminUsers[loop].id+">"
			adminRow += " <td>" + adminUsers[loop].name + "</td>"
			adminRow += " <td>" + adminUsers[loop].email + "</td>"
			adminRow += " <td>" + converToUserTimezone(adminUsers[loop].createdAt) + "</td>"
			adminRow += " <td>" + converToUserTimezone(adminUsers[loop].updatedAt) + "</td>"
			adminRow += " <td>" + "<a href=/editAdmin/"+adminUsers[loop].id+ " id = editAdmin >EDIT</a> / <a href=/deleteAdmin/"+adminUsers[loop].id+ " id = deleteAdmin >DELETE</a>" + "</td>"
			adminRow += "</tr>"
		}
				
		$("#admintable").html(adminRow);
	
	}
	else{
		// alert("No Admin users found");
	}

	//Add the following at the end of the line
	//setting pagination for this table
	$('#admintable').dataTable();

}

// //Function to will Convert the time to localtime
// //Input : dateString
// //Output : Local Time
function converToNormalTime(dateString){
  //The following line will convert it into GMT time and converts it into normal time
  var dateTime = new Date(dateString).toLocaleString();
  return dateTime;
  
}

//Function to will validate any form based on the user inputs
//Input : formId
//Output : true or false
function validateForProduct(formId){

	var emptyFields = $(formId + " input,textarea").filter(function(){
		return $(this).val() === "";//$(this).val() == "" || $(this.val().length == 0)? false : true; 
	});
	
	if (emptyFields.length == 0) {		
		return true;
	} else {
		
		if(emptyFields[0].id == "FileName")
			showNotification("Please choose image for category!", false);	
		else
	    	showNotification(emptyFields[0].id + " field should not be empty!", false);
	    return false;				
			    
	}
}


//Function to will validate any form based on the user inputs
//Input : formId
//Output : true or false
function validate(formId){

	// var emptyFields = $(formId + " input").filter(function(){
	// var emptyFields = $(formId + " input[type=text],input[type=password],textarea").filter(function(){
	var emptyFields = $(formId + " input,textarea").filter(function(){
		return $(this).val() === "";//$(this).val() == "" || $(this.val().length == 0)? false : true; 
	});
	
	if (emptyFields.length == 0) {		
		//check the remaining conditions
		return checkValidTypes();
	} else {
		//check for the remaining contitions
		if(checkValidTypes()){
		    showNotification(emptyFields[0].id + " field should not be empty!", false);
		    return false;				
		}
		else{
      		return false;
		}
	    
	}
}

//Function to will validate any form based on the user inputs
//Input : formId
//Output : true or false
function validateForm(formId){

	var emptyFields = $(formId + " input,textarea").filter(function(){
		return $(this).val() === "";//$(this).val() == "" || $(this.val().length == 0)? false : true; 
	});
	
	if (emptyFields.length == 0) {		
		return true;
	} else {
		
		if(emptyFields[0].id == "FileName")
			showNotification("Please choose image for category!", false);	
		else
	    	showNotification(emptyFields[0].id + " field should not be empty!", false);
	    return false;				
			    
	}
}

function checkValidTypes(){
	if(((($("#Name").val().length > 0)) && ($("#Name").val().length < 3)) || ($("#Name").val().length > 20)){
		showNotification("Name should be greaterthan 3 and lessthan 20!", false);
		return false;
	}	

	if(($("#Email").val().length > 0) && (IsEmail($("#Email").val()) == false)){
		showNotification("Invalid email address!", false);
		return false;
	}	

	if(($("#Password").val().length > 0) && (isValidPassword($("#Password").val()) == false)){
		showNotification("Password should be maximum of 8 characters contain 1 upper, 1 lower, 1 special!", false);
		return false;
	}	
	return true;
}

//Function to set the submit actions for enterkey
//Input : formId
//Output : sets the event for enter key
function setEnterKeyForSubmit(formId){
	
	$(formId + " input").keydown(function(e){
		if(e.keyCode == 13)
			$(formId).submit();
	});

}

//Function to test the given email is valid or not
//Input : email
//Output : true or false
function IsEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

//Function to wil show a notification to the user
			// Contain at least 8 characters
			// contain at least 1 number
			// contain at least 1 lowercase character (a-z)
			// contain at least 1 uppercase character (A-Z)
			// contains only 0-9a-zA-Z
//Regex 2
// will match any string of at least 8 characters that contains at least one lowercase and one uppercase ASCII character and also at least one character from the set @#$%^&+= (in any order).
//Input : password
//Output : return true if the above conditions matches true
function isValidPassword(password){
	var regexWithOutSpecial = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
	var regexWithSpecial = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/;
	return regexWithSpecial.test(password);
}

//Function to wil show a notification to the user
//Input : messagem, isSuccess
//Output : This will display a notification with the message and changes the background color based on the isSuccess
function showNotification(message, isSuccess) {
	var css = isSuccess ? "alert-success" : 'alert alert-danger';
	// var html = '<h3 id= "error" class="alert '+ css +'"> '+ message +' <a href="javascript: closeNotification()" class="close">&times;</a></h3>';
	var html = '<h3 id= "error" class="alert '+ css +'"> '+ message;
	$("#state").html(html).show().delay(5000).fadeOut();
}

//Function to alter the state of the login button if logged in
//Input : no input required
//Output : It will change the state from loggedIn to logged out
function loggedIn(){
	$("#log").html("Logout");
	$("#log").attr("href","/logout");	
	createCookie("loggedIn",true);
}

//Function to will reset the menu colors
//Input : no input required
//Output : Menu background colors will be reset
function resetMenu(){
	$("#menu ul li a").each(function(){
	  $(this).removeClass("active");
	});
}

//Function to will reset the menu colors
//Input : no input required
//Output : Menu background colors will be reset
function resetOrdersMenu(){
	$("#ordersMenu ul li a").each(function(){
	  $(this).removeClass("active");
	});
}

//Function sets menuitem to active
//Input : menuId
//Output : sets the menu background to active
function selectedMenu(menuId){
	$(menuId).addClass("active");
}

// function alterMenuState(){
	
// 	$("#menu ul li a").click(function(){
// 			$("#menu ul li a").removeClass("active");
// 			$(this).toggleClass("active");
// 	});

// }

//Function to will reset the curd operations menu colors
//Input : no input required
//Output : Crud Menu background colors will be reset
function resetCrud(){
	$("#crud ul li a").each(function(){
	  $(this).removeClass("active");
	});
}

//Function to will reset the curd operations menu colors
//Input : no input required
//Output : Crud Menu background colors will be reset
function resetFormFields(){
	$("#myForm").find('input:text, input:password, input:file, select, textarea').val('');

}
//Function to hide the menu section
//Input : no input required
//Output : Crud Menu will be hide in frontend
function hideCrud(){
	$("#crud").css("display","none");
}

//Function to display the menu section
//Input : no input required
//Output : Crud Menu will be shown in frontend
function showCrud(){
	$("#crud").css("display","block");
}

//Function to display the orders menu section
//Input : no input required
//Output : Crud Menu will be shown in frontend
function showOrders(){
	$("#ordersMenu").css("display","block");
}

//Function to hide the menu section
//Input : no input required
//Output : Crud Menu will be hide in frontend
function hideOrders(){
	$("#ordersMenu").css("display","none");
}



var adminActions = ["/addAdmin","#","/listAdmin"];
var DeliveryPersonsActions = ["/addDeliveryPerson","#","/listDeliveryPerson"];
var categoryActions = ["/addCategory","#","/listCategory"];
var productsActions = ["/addProduct","#","/listProduct"];
var customerActions = ["/addCustomer","#","/listCustomer"];


//Function to reseting Crud Action based on page
//Input : type
//Output : sets the crud action for the selected page
function resetCRUDAction(type){

	switch(type){
		case "admin":
					setAction(adminActions);
					 break;
		case "DeliveryPersons":
					setAction(DeliveryPersonsActions);
					 break;
		
		case "category":
					setAction(categoryActions);
					 break;
		
		case "products":
					setAction(productsActions);
					 break;
		case "customers":
					setAction(customerActions);
					 break;			 

	}

}

//Function to set the action for the selected page's crud
//Input : actions
//Output : Crud actions will be altered
function setAction(actions){

	$("#add").attr("href",actions[0]);
	$("#edit").attr("href",actions[1]);
	$("#list").attr("href",actions[2]);

}

//Function allows to create a cookie and store it in browser
//Input : name, value
//Output : This function will create cookie
function createCookie(name,value) {
	var days = 10;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

//Function allows to read cookie from the browser
//Input : name
//Output : read the cookie from the browser
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

//Function allows to create a cookie and store it in browser
//Input : name, value
//Output : erase the cookie from the browser
function eraseCookie(name) {
    createCookie(name,"",-1);
}



//Function allows to create a cookie and store selected Timezone and the Timezone difference
//Input : name, value
//Output : Storing data in cache
function updateTimeZone(timezoneString){
	var timeZoneDiff = timezoneString.substr(5,6); 
	var currentTimeZone = timezoneString;
	createCookie("timeZoneDiff", timeZoneDiff);
	createCookie("currentTimeZone", currentTimeZone);
	showNotification("Time zone updated!" ,true);
}

//Function will enables the auto complete feature
//Input : inputId, searchUrl, filterName
//Output : Displays auto complete list for the specific input
function EnableAutoComplete(inputId, searchUrl, filterName){
	
	 $(inputId).autocomplete({

	    source: function(req,res) {          

	        $.ajax({
	            url: searchUrl + req.term,
	            dataType: "jsonp",
	            type: "GET",
	            // data: {
	            //     term: req.term
	            // },
	            success: function(data) {
	                
	                res($.map(data, function(item) {
	                    //alert(JSON.stringify(item.categoryName));
	                    return {
	                        label: item[filterName],//text comes from a collection of mongo
	                        value: item[filterName]
	                    };
	                }));
	            },
	            error: function(xhr) {
	                alert(xhr.status + ' : ' + xhr.statusText);
	            }
	        });
	    },
	    select: function(event, ui) {

	    }
	});
}

//Function will convert the current input field to date picker
//Input : inputId
//Output : converts the input field to date picker
function createDatePicker(inputId){
	$(inputId).datepicker({
		    format: "dd/mm/yyyy"
	});  
}

//Function will allow only the numbers
//Input : inputId
//Output : will restrict characters
function allowOnlyNumbers(inputId){

	 $(inputId).keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

}

//Function will check start date and end date
//Input : inputId
//Output : will restrict characters
function checkDateFormat(startDateId, endDateId){  			

	var fromDate = new Date($(startDateId).val());
	var endDate = new Date($(endDateId).val());

	if(fromDate > endDate){
	  showNotification("End date should not be lessthan Start date!", false);
	  return false;
	}
	return true;

}

$(document).ready(function(){
	
	// loadTimeZone();
	showAdminAlert();
	initSocket();

});



// //Function will delete an admin records
// //Input : id
// //Output : reloads the page after deleted
function deleteOrderData(id){

	var data = {
		customerOrderId : id
	};
	apiPath = "/deleteOrderAPI/";

	makeAPI(apiPath, "post", data, function(response){			
	
		if(response["message"] != undefined && response["message"] != ""){
		
			showNotification(response["message"], response["status"]);

			if(selectedOrderState == "allOrders"){
				loadAllOrdersList();
			}
			else{
				loadOrdersListByState(selectedOrderState);				
			}
		
		}

	});	
	
}

// //Function will cancel and order
// //Input : id
// //Output : reloads the page after cancelled
function cancelOrderData(id){

	var data = {
		customerOrderId : id
	};
	apiPath = "/cancelOrder/";

	makeAPI(apiPath, "post", data, function(response){			
	
		if(response["message"] != undefined && response["message"] != ""){
		
			showNotification(response["message"], response["status"]);

			if(selectedOrderState == "allOrders"){
				loadAllOrdersList();
			}
			else{
				loadOrdersListByState(selectedOrderState);				
			}
		
		}

	});	
	
}

//Function will confirm an order
//Input : id
//Output : reloads the page after confirmed
function confirmOrderData(id){
	
	$('#CustomerOrderId').val(id);
	$('#myModal').modal('show')

}


//Function will confirm an order
//Input : id
//Output : reloads the page after confirmed
function viewOrderData(id){
	
	window.location.replace("/getOrderDetail/"+id);

}


//Function will confirm an order
//Input : id
//Output : reloads the page after confirmed
function confirmOrderData(id){
	
	$('#CustomerOrderId').val(id);
	$('#myModal').modal('show')

}

//Function will confirm an order
//Input : no input field required
//Output : confirms an order and reloads the page
function confirmOrderAPI(){

	var data = {
		customerOrderId : $("#CustomerOrderId").val(),
		deliveryPersonName : $("#Notes").val(),
		comments : $("#Comments").val(),
		notes : $("#Notes").val(),
	};
	
	apiPath = "/confirmOrder/";

	makeAPI(apiPath, "post", data, function(response){			
	
		if(response["message"] != undefined && response["message"] != ""){
			
			$("#myModal").modal('hide');

			showNotification(response["message"], response["status"]);
			if(selectedOrderState == "allOrders"){
				loadAllOrdersList();
			}
			else{
				loadOrdersListByState(selectedOrderState);				
			}		

		}
	});	
}

//Function will show notification in front end
//Input : no input field required
//Output : shows notification
function showAdminAlert(){

	apiPath = "/getOrderBystatus";
	var data = {
		orderState : "pending"
	};	

	makeAPI(apiPath, "post", data, function(data){
		
		updateAllOrdersByStatus(data["response"]);
		if(data["status"] && data["response"].length > 0){
			var ordersCount = data["response"].length;
			$("#notification").html("<div role='alert' class='alert alert-info'><p><span style=float:right id=closeNotification><a href=#>x</a></span></p><p><center><b>Alert Message Title !</b><center></p><p><center>You have <span id=ordersCount></span><b> "+ordersCount+"</b> orders waiting for Confirmation!</center><p> <a href = /allOrdersList>Click to Confrim! </a></p></div>");
			$("#notification").effect( "shake", {times:3}, 1000 );			
			$("#closeNotification").click(function(){
				console.log("Clicked")
				$("#notification").fadeOut(2000);
			});
		}

	});	
}

//Function will initializes socket object to receive notification
//Input : no input field required
//Output : inititalize a socket object
function initSocket(){
	
	socket = io();
	
	socket.on('notification', function(response) {					
		if(response["status"]){
			showAdminAlert();
		}
	});

}
