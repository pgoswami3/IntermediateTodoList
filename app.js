var itemTemplate = $('#templates .item');  
var list = $('#list'); 

// on load request
var loadRequest = $.ajax({
	type: 'GET',
	url : "https://listalous.herokuapp.com/lists/pgoswami3/",
	success : loadList
})

var loadList = (loadRequest.done(function(dataFromServer){
	var itemsData = dataFromServer.items;
	var item = $(event.target).parent();

	itemsData.forEach( function(element, index) {
		addItemToPage(element);
	});
}));

// adding things to page
var addItemToPage = function (itemData) {
	var item = itemTemplate.clone();
	item.attr('data-id', itemData.id);
	item.find('.description').text(itemData.description);
	if(itemData.completed){
		item.addClass('completed');
		$(item[0]).find('.complete-button').hide();
	}
	list.append(item);
}

// adding items
$('#add-form').on('submit', function(event) {
	event.preventDefault();
	var itemDescription = event.target.itemDescription.value;
	var createRequest = $.ajax({
		url: 'https://listalous.herokuapp.com/lists/pgoswami3/items/',
		type: 'POST',
		data: {description: itemDescription, completed: false},
	})
	.done(function() {
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});

	createRequest.done(function (thingsFromServer) {
		addItemToPage(thingsFromServer);
		$('#add-form').children('#create').val('');
	})
	
});

// update and/or insert
$('#list').on('click', '.complete-button', function(event) {
	event.preventDefault();
	var item = $(event.target).parent();
	console.log(item);
	var isItemCompleted = item.hasClass('completed');
	var itemId = item.attr('data-id');

	var updateRequest = $.ajax({
		url: 'https://listalous.herokuapp.com/lists/pgoswami3/items/' + itemId, 
		type: 'PUT',
		data: {completed: !isItemCompleted},
	})
	.done(function() {
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});

	updateRequest.done(function (itemData) {
		if (itemData.completed){
			item.addClass('completed');
			if (item.find('span.complete-button')){
				$(item).find('.complete-button').remove();
			}	
		}else {
			item.removeClass('completed');
		}
	})
	
});

// 'checked' item list
$('#list').on('click','.delete-button', function(event){
	event.preventDefault();
	var item = $(event.target).parent();
	var itemId = item.attr('data-id');
	// visit DELETE /lists/:list_name/items/:item_id to delete the specified item.
	console.log(itemId);
	var deleteRequest = $.ajax({
		url: 'https://listalous.herokuapp.com/lists/pgoswami3/items/'+itemId,
		type: 'DELETE',
	})
	.done(function() {
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});

	deleteRequest.done(function(itemsData){
		location.reload();
	});
});



