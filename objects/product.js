exports.action = function(req, res, data) {

	try {
		if (data.action == 'info'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.type != 'undefined' && req.body.type != '' &&
				typeof req.body.value != 'undefined' && req.body.value != '') {
				var type = '|item|byCategoryName|byCategoryUrl4Web|byBrandName|byBrandUrl4Web|byProductName|'; // ชื่อ type ที่สามารถเรียกดูข้อมูลได้
				if ( type.indexOf('|'+req.body.type+'|') == -1 ) { // ถ้าชื่อ Entity ไม่ถูกต้อง
					data.json.return = true;
					data.json.error = 'PRD0001';
					data.json.errorMessage = 'Unknown type ' + req.body.type;
					data.util.responseJson(req, res, data.json);
				}
				else {
					data.json.return = false;
					if (req.body.type == 'byCategoryName') { 
						data.json.returnResult = true;
						data.command = 'EXEC sp_ShopProductByCategoryName \''+req.body.shop+'\', \''+req.body.value+'\', NULL, ' + 
							( (typeof req.body.active != 'undefined' && req.body.active != '') ? '\''+req.body.active+'\'' : 'NULL' ) + 
							', '+( (typeof req.body.visible != 'undefined' && req.body.visible != '') ? '\''+req.body.visible+'\'' : 'NULL' );
					}
					else if (req.body.type == 'byCategoryUrl4Web') {
						data.json.returnResult = true;
						data.command = 'EXEC sp_ShopProductByCategoryUrl \''+req.body.shop+'\', \''+req.body.value+'\'';
					}
					else if (req.body.type == 'item') {
						data.command = 'EXEC sp_ShopProductItem \''+req.body.shop+'\', \''+req.body.value+'\'';
					}
					else if (req.body.type == 'byBrandName') {
						data.json.returnResult = true;
						data.command = 'EXEC sp_ShopProductByBrandName \''+req.body.shop+'\', \''+req.body.value+'\', NULL, ' + 
							( (typeof req.body.active != 'undefined' && req.body.active != '') ? '\''+req.body.active+'\'' : 'NULL' ) + 
							', '+( (typeof req.body.visible != 'undefined' && req.body.visible != '') ? '\''+req.body.visible+'\'' : 'NULL' );
					}
					else if (req.body.type == 'byBrandUrl4Web') {
						data.json.returnResult = true;
						data.command = 'EXEC sp_ShopProductByBrandUrl \''+req.body.shop+'\', \''+req.body.value+'\'';
					}
					else if (req.body.type == 'byProductName') {
						data.json.returnResult = true;
						data.command = 'EXEC sp_ShopProductByName \''+req.body.shop+'\', \''+req.body.value+'\'';
					}
					data.util.query(req, res, data); 
				}
			}
		}

		else if (data.action == 'add'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.name != 'undefined' && req.body.name != '') {
				data.json.return = false;
				data.util.getShop(req, res, data);
			}
		}
		else if (data.action == 'update'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.id != 'undefined' && req.body.id != '' &&
				typeof req.body.entity != 'undefined' && req.body.entity != '' &&
				typeof req.body.value != 'undefined' && req.body.value != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_ShopProductUpdate \''+req.body.shop+'\', \''+req.body.id+'\', \''+req.body.entity+'\', \''+req.body.value+'\'';
					data.util.execute(req, res, data); 
			}
		}
		else if (data.action == 'delete'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.id != 'undefined' && req.body.id != '') {
				data.json.return = false;
				data.util.getShop(req, res, data);
			}
		}
		else if (data.action == 'category_and_brand'){
			if (typeof req.body.token.memberKey != 'undefined' && req.body.token.memberKey != '') {
				data.json.return = false;
				data.command = 'EXEC sp_ProductCategoryAndBrandInfo \''+req.body.token.memberKey+'\'';
				data.util.query(req, res, data);
			}
		}
		else if (data.action == 'all'){
			if (typeof req.body.token.memberKey != 'undefined' && req.body.token.memberKey != '') {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ProductInfoList \''+req.body.token.memberKey+'\'';
				data.util.query(req, res, data);
			}
		}
		else if (data.action == 'mkdir'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '') {
				data.json.return = false;
				data.command = 'EXEC sp_ShopProduct4Mkdir \''+req.body.shop+'\'';
				data.util.query(req, res, data); 
			}
		}
		else if (data.action == 'pos'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_ShopProductInfo \''+req.body.shop+'\'';
				data.util.query(req, res, data)
			}
		}
		else if (data.action == 'barcodePos'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_ShopBarcodeInfo \''+req.body.shop+'\'';
				data.util.query(req, res, data)
			}
		}
		else if (data.action == 'barcodeClaimPos'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_ShopBarcodeClaimInfo \''+req.body.shop+'\'';
				data.util.query(req, res, data)
			}
		}
		else if (data.action == 'updatePos'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.id != 'undefined' && req.body.id != '' &&
				typeof req.body.entity != 'undefined' && req.body.entity != '' &&
				typeof req.body.value != 'undefined' && req.body.value != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_Pos_ShopProductUpdate \''+req.body.shop+'\', \''+req.body.id+'\', \''+req.body.entity+'\', \''+req.body.value+'\'';
					data.util.execute(req, res, data); 
			}
		}
		else if (data.action == 'insertPos'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' ) {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_Pos_ShopProductInsert \''+req.body.shop+'\'';
					data.util.execute(req, res, data); 
			}
		}
		else if (data.action == 'updateBarcodePos'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.id != 'undefined' && req.body.id != '' &&
				typeof req.body.entity != 'undefined' && req.body.entity != '' &&
				typeof req.body.value != 'undefined' && req.body.value != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_Pos_ShopBarcodeUpdate \''+req.body.shop+'\', \''+req.body.id+'\', \''+req.body.entity+'\', \''+req.body.value+'\'';
					data.util.query(req, res, data); 
			}
		}
		else if (data.action == 'updateBarcodeClaimPos'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.id != 'undefined' && req.body.id != '' &&
				typeof req.body.entity != 'undefined' && req.body.entity != '' &&
				typeof req.body.value != 'undefined' && req.body.value != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_Pos_ShopBarcodeClaimUpdate \''+req.body.shop+'\', \''+req.body.id+'\', \''+req.body.entity+'\', \''+req.body.value+'\'';
					data.util.execute(req, res, data); 
			}
		}
		else if (data.action == 'receivedUpdate'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.order != 'undefined' && req.body.order != '' &&
				typeof req.body.by != 'undefined' && req.body.by != '' ) {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_Pos_ShopReceivedProduct \''+req.body.shop+'\', \''+req.body.order+'\', \''+req.body.by+'\'';
					data.util.execute(req, res, data); 
			}
		}
		else if (data.action == 'infoNsPos'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_ns_PurchaseOrderInfo \''+req.body.shop+'\'';
				data.util.query(req, res, data)
			}
		}
		else if (data.action == 'insertNsPos'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_PONoSerialInsert \''+req.body.shop+'\'';
				data.util.execute(req, res, data); 
			}
		}
		else if (data.action == 'updateNsPos'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.orderno != 'undefined' && req.body.orderno != '' &&
				typeof req.body.id != 'undefined' && req.body.id != '' &&
				typeof req.body.entity != 'undefined' && req.body.entity != '' &&
				typeof req.body.value != 'undefined' && req.body.value != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_Pos_ns_PurchaseOrderUpdate \''+req.body.shop+'\', \''+req.body.orderno+'\',\''+req.body.id+'\', \''+req.body.entity+'\', \''+req.body.value+'\'';
					data.util.execute(req, res, data); 
			}
		}
		else if (data.action == 'infoCount'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_InventoryCount \''+req.body.shop+'\'';
				data.util.query(req, res, data)
			}
		}
		else if (data.action == 'addCount'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.product != 'undefined' && req.body.product != '' &&
				typeof req.body.quantity != 'undefined' && req.body.quantity != '' ) {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_Pos_InventoryCountInsert \''+req.body.shop+'\', \''+req.body.product+'\',\''+req.body.quantity+'\'';
					data.util.execute(req, res, data); 
			}
		}
		else if (data.action == 'deleteCount'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_InventoryCountDelete \''+req.body.shop+'\'';
				data.util.execute(req, res, data)
			}
		}
		else if (data.action == 'image'){
			if (data.subAction[0] == 'barcode'){
				if (typeof req.body.barcode != 'undefined' && req.body.barcode != '' ) {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_ProductImageByBarcode \''+req.body.barcode+'\'';
					data.util.query(req, res, data)
				}
			}
		}
		else if (data.action == 'productPos'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_ShopProduct \''+req.body.shop+'\'';
				data.util.query(req, res, data)
			}
		}
		else if (data.action == 'productCheck'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_CheckUpdate \''+req.body.shop+'\', \''+req.body.value+'\'';
				data.util.execute(req, res, data)
			}
		}
		else if (data.action == 'summaryStock'){
			if (typeof req.body.date != 'undefined' && req.body.date != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_SummaryStock \''+req.body.date+'\', \''+req.body.brand+'\'';
				data.util.query(req, res, data)
			}
		}
		else if (data.action == 'imageIsNull'){			
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_ProductImageIsNullInfo \''+req.body.shop+'\'';
			data.util.query(req, res, data)		
		}
		else if (data.action == 'updateImage'){	
			var fs = require('fs');
			var files = [];
			var imageList = [];
			try
			{
				files = fs.readdirSync('/data/mount/resources/img/product/'+req.body.sku+'/');
			}
			catch(error) {
				console.log(error);
			}
			var type = '|jpg|jpeg|png|gif|'; // ชื่อ type รูปภาพ
			var image = [];
			for (f = 0; f < files.length; f++) {
				var sp = files[f].toLowerCase().split('.');
				if ( type.indexOf('|'+sp[sp.length-1]+'|') != -1 ) {
					if ( data.util.isNumeric(parseInt(sp[0])) ) {
						image.push( files[f] );
						imageList.push(files[f]);
					}
					else if ( files[f].toLowerCase().substr(0,1) == 'd' ) {
						imageList.push(files[f]);
					}
				}
			}	
			if (imageList.length > 0) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'UPDATE Product SET image = \''+imageList.toString()+'\' WHERE shop = 88888888 AND sku = \''+req.body.sku+'\'';
				data.util.query(req, res, data);
			}
		}
		else if (data.action == 'youtubeIsNull'){			
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_ProductYoutubeIsNullInfo \''+req.body.shop+'\'';
			data.util.query(req, res, data)		
		}
		else if (data.action == 'updateYoutube'){
			if (typeof req.body.id != 'undefined' && req.body.id != '' ) {			
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ProductYoutubeIsUpdate \''+req.body.id+'\',\''+req.body.youtube+'\'';
				data.util.execute(req, res, data)	
			}	
		}
		else if (data.action == 'eventPrice'){		
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_EventProductPrice \''+req.body.shop+'\',\''+req.body.barcode+'\',\''+req.body.name+'\'';
			data.util.query(req, res, data)		
		}
		else if (data.action == 'eventOrder'){		
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_EventProductOrder \''+req.body.shop+'\'';
			data.util.query(req, res, data)		
		}
		else { 
			data.json.error = 'API0011';
			data.json.errorMessage = 'Action ' + data.action.toUpperCase() + ' is not implemented';
		}

		data.util.responseJson(req, res, data.json);

	}
	catch(error) {
		data.util.responseError(req, res, error);
	}
};


//## Internal Method ##//
exports.process = function(req, res, data) {

	if (data.action == 'mkdir') {
		exports.mkdir(req, res, data);
	}
	else if (data.action == 'info') {
		if (req.body.type == 'item') {
			exports.getItemImage(req, res, data);
		}
		
	}
	else if (data.action == 'category_and_brand'){
		exports.categoryAndBrand(req, res, data);
	}
	else {
		data.json.error = 'API0002';
		data.json.errorMessage = 'Unknow Action';
		data.util.responseJson(req, res, data.json);
	}
};

exports.mkdir = function(req, res, data) {
	var shell = require('shelljs');
	shell.exec('mkdir "/var/www/images/product/'+data.result[0].shop+'"', {async:false});
	for(i=0; i<data.result.length; i++) {
		shell.exec('mkdir "/var/www/images/product/'+data.result[i].sku+'"', {async:true});
	}
	data.json.return = true;
	data.json.success = true;
	data.util.responseJson(req, res, data.json);
};

exports.getItemImage = function(req, res, data) {

	var imageList = [];
	if ( data.result[0].image != null )
	{
		var sp = data.result[0].image.split(',');
		imageList.push(sp[0]);
		data.result[0].cover = sp[0];
	}

	var fs = require('fs');
	delete data.result[0].image;

	var files = [];
	try
	{
		files = fs.readdirSync('/data/mount/resources/img/product/'+data.result[0].sku+'/');
	}
	catch(error) {
		console.log(error);
	}
	var type = '|jpg|jpeg|png|gif|'; // ชื่อ type รูปภาพ
	var image = [];
	var imageDetail = [];
	for (f = 0; f < files.length; f++) {
		var sp = files[f].toLowerCase().split('.');
		if ( type.indexOf('|'+sp[sp.length-1]+'|') != -1 ) {
			if ( data.util.isNumeric(parseInt(sp[0])) ) {
				image.push( files[f] );
				imageList.push(files[f]);
			}
			else if ( files[f].toLowerCase().substr(0,1) == 'd' ) {
				imageDetail.push( files[f] );
				imageList.push(files[f]);
			}
		}
	}
	if (image.length > 0) {
		data.result[0].image = image;
	}
	if (imageDetail.length > 0) {
		imageDetail.sort();
		data.result[0].imageDetail = imageDetail;
	}

	if ( data.result[0].detail != null )
	{
		var sp = data.result[0].detail.split("\n");
		delete data.result[0].detail;
		data.result[0].detail = [];
		for(i=0; i<sp.length; i++) {
			var msg = sp[i].trim();
			if ( msg != '' ){
				data.result[0].detail.push( (msg.substr(0,2) == '- ') ? msg.replace('- ', '') : msg );
			}
		}
	}

	if ( data.result[0].inBox != null )
	{
		var sp = data.result[0].inBox.split("\n");
		delete data.result[0].inBox;
		data.result[0].inBox = [];
		for(i=0; i<sp.length; i++) {
			var msg = sp[i].trim();
			if ( msg != '' ){
				data.result[0].inBox.push( (msg.substr(0,2) == '- ') ? msg.replace('- ', '') : msg );
			}
		}
	}

	if ( data.result[0].howToUse != null )
	{
		var sp = data.result[0].howToUse.split("\n");
		delete data.result[0].howToUse;
		data.result[0].howToUse = [];
		for(i=0; i<sp.length; i++) {
			var msg = sp[i].trim();
			if ( msg != '' ){
				data.result[0].howToUse.push( (msg.substr(0,2) == '- ') ? msg.replace('- ', '') : msg );
			}
		}
	}

	if ( data.result[0].specialProperties != null )
	{
		var sp = data.result[0].specialProperties.split("\n");
		delete data.result[0].specialProperties;
		data.result[0].specialProperties = [];
		for(i=0; i<sp.length; i++) {
			var msg = sp[i].trim();
			if ( msg != '' ){
				data.result[0].specialProperties.push( (msg.substr(0,2) == '- ') ? msg.replace('- ', '') : msg );
			}
		}
	}

	data.json.return = true;
	data.json.result = data.result[0];

	data.json.success = true;
	data.util.responseJson(req, res, data.json);

	if (imageList.length > 0) {
		data.json.return = false;
		data.json.returnResult = true;
		data.command = 'UPDATE Product SET image = \''+imageList.toString()+'\' WHERE shop = \''+data.result[0].shop+'\' AND sku = \''+data.result[0].sku+'\'';
		data.util.query(req, res, data);
	}

};

exports.categoryAndBrand = function(req, res, data) {
	if (typeof data.result[0] != 'undefined') {
		var json = [];
		var cnt = data.result.length;
		var category = [];
		var brand = {};
		for(i=0; i<cnt; i++) {
			if (category.indexOf(data.result[i].category) == -1) {
				var brandArr = [];
				json.push({ id: data.result[i].category, name: data.result[i].categoryName, url: data.result[i].categoryUrl });
				//json.push({ id: data.result[i].category, name: data.result[i].categoryName, url: data.result[i].categoryUrl, piority: data.result[i].categoryPriority });
				category.push(data.result[i].category);
				brand[data.result[i].category] = [];
			}
			brand[data.result[i].category].push( { id: data.result[i].brand, name: data.result[i].brandName } );
			//brand[data.result[i].category].push( { id: data.result[i].brand, name: data.result[i].brandName, piority: data.result[i].brandPriority } );
			//if (typeof category[data.result[i].category != 'undefined')
		}
		var newJson = [];
		for(i=0; i<json.length; i++) {
			newJson.push({ id: json[i].id, name: json[i].name, url: json[i].url, brand: brand[json[i].id]  });
			//newJson.push({ id: json[i].id, name: json[i].name, url: json[i].url, piority: json[i].piority, brand: brand[json[i].id]  });
		}
		data.json.result = newJson;
		delete json;
		delete cnt;
		delete category;
		delete brand;
		delete newJson;
	}

	data.json.return = true;
	data.json.success = true;
	data.util.responseJson(req, res, data.json);
};