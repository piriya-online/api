exports.action = function(req, res, data) {
	data.tableName = 'Order';
	
	try {
		if (data.action == 'info'){

			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.key != 'undefined' && req.body.key != '' &&
				typeof req.body.orderNo != 'undefined' && req.body.orderNo != '') {

				var type = '|M|A|'; // ชื่อ type ที่สามารถดูข้อมูลได้
				if (typeof req.body.type == 'undefined' || req.body.type == '') req.body.type = 'M';
				if ( type.indexOf('|'+req.body.type+'|') == -1 ) { // ถ้าชื่อ type ไม่ถูกต้อง
					data.json.error = 'ODR0001';
					data.json.errorMessage = 'Unknown type ' + req.body.type;
					data.util.responseJson(req, res, data.json);
				}
				else {
					data.json.return = false;
					data.util.getShop(req, res, data);
				}

			}
		}
		else if (data.action == 'history') {
			if (data.subAction[0] == 'profile'){
				if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
					typeof req.body.memberKey != 'undefined' && req.body.memberKey != '') {
						data.json.return = false;
						data.util.getShop(req, res, data);
				}
			}
			else if (data.subAction[0] == 'province'){
				data.json.return = false;
				data.json.returnResult = true; 
				//data.command = 'EXEC sp_ReportOrderHistoryByProvince \''+req.body.token.memberKey+'\'';
				data.command = 'EXEC sp_ReportOrderHistoryByProvince \''+req.body.memberKey+'\',\''+req.body.memberTypeSelect+'\'';
				data.util.query(req, res, data);
			}
			else if (data.subAction[0] == 'customer'){
				data.json.return = false;
				data.json.returnResult = true;
				//data.command = 'EXEC sp_ReportOrderHistoryByCustomer \''+req.body.token.memberKey+'\'';
				data.command = 'EXEC sp_ReportOrderHistoryByCustomer \''+req.body.memberKey+'\'';
				data.util.query(req, res, data);
			}
		}
		else if (data.action == 'packing') {
			if (data.subAction[0] == 'checker'){
				if (typeof req.body.orderNo != 'undefined' && req.body.orderNo != '') {
					data.json.return = false;
					data.command = 'EXEC sp_PackingChecker \''+req.body.orderNo+'\'';
					data.util.queryMultiple(req, res, data);
				}
			}
		}
		else if (data.action == 'barcode') {
			if (data.subAction[0] == 'checker'){
				if (typeof req.body.orderNo != 'undefined' && req.body.orderNo != '') {
					data.json.return = false;
					data.command = 'EXEC sp_BarcodeChecker \''+req.body.orderNo+'\'';
					data.util.queryMultiple(req, res, data);
				}
			}
			else if (data.subAction[0] == 'checked'){
				if (typeof req.body.barcode != 'undefined' && req.body.barcode != '') {
					data.json.return = false;
					data.command = 'EXEC sp_BarcodeChecked \''+req.body.barcode+'\'';
					data.util.query(req, res, data);
				}
			}
		}
		else if (data.action == 'cancel'){
			if (typeof req.body.memberKey != 'undefined' && req.body.memberKey != '' &&
				typeof req.body.orderNo != 'undefined' && req.body.orderNo != '') {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_CancelOrder \''+req.body.memberKey+'\', \''+req.body.orderNo+'\', \''+req.body.remark+'\'';
				data.util.query(req, res, data); 
			}
		}
		else if (data.action == 'canceledInfo'){
			if (typeof req.body.memberKey != 'undefined' && req.body.memberKey != '' &&
				typeof req.body.year != 'undefined' && req.body.year != '' &&
				typeof req.body.month != 'undefined' && req.body.month != '') {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_CanceledOrderInfo \''+req.body.memberKey+'\', \''+(parseInt(req.body.year)%2000)+'\', \''+req.body.month+'\'';
				data.util.query(req, res, data); 
			}
		}
		else if (data.action == 'address') {
			if (typeof req.body.orderNo != 'undefined' && req.body.orderNo != '') {
				data.json.return = false;
				data.command = 'EXEC sp_OrderAddress \''+req.body.orderNo+'\'';
				data.util.query(req, res, data);
			}
		}
		else if (data.action == 'list') {
			if (data.subAction[0] == 'assign'){
				if (typeof req.body.orderNo != 'undefined' && req.body.orderNo != '' &&
				typeof req.body.employee != 'undefined' && req.body.employee != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_OrderListAssign \''+req.body.orderNo+'\',\''+req.body.employee+'\'';
					data.util.query(req, res, data);
				}
			} else if (data.subAction[0] == 'updateQty'){
				if (typeof req.body.orderNo != 'undefined' && req.body.orderNo != '' &&
				typeof req.body.product != 'undefined' && req.body.product != '' &&
				typeof req.body.qty != 'undefined' && req.body.qty != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_OrderListUpdateQty \''+req.body.orderNo+'\', \''+req.body.product+'\', \''+req.body.qty+'\'';
					data.util.execute(req, res, data);
				}
				
			}else if (data.subAction[0] == 'confirm'){
				if (typeof req.body.orderNo != 'undefined' && req.body.orderNo != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_OrderListConfirm \''+req.body.orderNo+'\'';
					data.util.execute(req, res, data);
				}
				
			}else if (data.subAction[0] == 'report'){
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_OrderListReport \''+req.body.status+'\', \''+req.body.date+'\'';
					data.util.queryMultiple(req, res, data);		
			}else {
				if (typeof req.body.orderNo != 'undefined' && req.body.orderNo != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_OrderList \''+req.body.orderNo+'\'';
					data.util.query(req, res, data);
				}
			}
			
		}
		else if (data.action == 'checkedUpdate'){
			if (typeof req.body.orderNo != 'undefined' && req.body.orderNo != '') {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_OrderCheckUpdate \''+req.body.orderNo+'\'';
				data.util.execute(req, res, data)
			}
		}
		else if (data.action == 'checkedInsert'){
			if (typeof req.body.orderNo != 'undefined' && req.body.orderNo != '') {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_OrderCheckInsert \''+req.body.orderNo+'\', \''+req.body.checkBy+'\', \''+req.body.transport+'\', \''+req.body.box+'\', \''+req.body.cash+'\'';
				data.util.execute(req, res, data)
			}
		}
		else if (data.action == 'orderChecker'){
			if (typeof req.body.orderNo != 'undefined' && req.body.orderNo != '') {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_OrderChecker \''+req.body.orderNo+'\'';
				data.util.query(req, res, data)
			}
		}
		else if (data.action == 'orderHeader'){
			if (typeof req.body.orderNo != 'undefined' && req.body.orderNo != '') {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_OrderHeaderUpdate \''+req.body.orderNo+'\', \''+req.body.comment+'\', \''+req.body.sale+'\', \''+req.body.shipping+'\', \''+req.body.payment+'\'';
				data.util.query(req, res, data)
			}
		}
		else if (data.action == 'orderEventInfo'){
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_OrderEvent';
			data.util.queryMultiple(req, res, data)
		}
		else if (data.action == 'orderEventToStock'){
			if (typeof req.body.memberKey != 'undefined' && req.body.memberKey != '' &&
			typeof req.body.orderNo != 'undefined' && req.body.orderNo != '' &&
			typeof req.body.comment != 'undefined' && req.body.comment != '') {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_OrderEventReturnToStock\''+req.body.memberKey+'\', \''+req.body.orderNo+'\', \''+req.body.comment+'\'';
				data.util.execute(req, res, data)
			}
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
	if (data.action == 'packing') {
		if (data.subAction[0] == 'checker'){
			exports.packingChecker(req, res, data);
		}
	}
	else if (data.action == 'barcode') {
		if (data.subAction[0] == 'checker'){
			exports.barcodeChecker(req, res, data);
		}
		else if (data.subAction[0] == 'checked'){
			data.json.return = true;
			data.json.success = true;
			data.util.responseJson(req, res, data.json);
		}
	}
	else if (data.action == 'address') {
		data.json.return = true;
		data.json.success = true;
		data.json.result = data.result[0];
		data.util.responseJson(req, res, data.json);
	}
}


exports.packingChecker = function(req, res, data) {
	data.json.return = true;
	
	if (data.result[1] != undefined) {
		data.json.success = true;
		data.json.header = data.result[0];
		data.json.product = data.result[1];
		/*var json = {};
		for(i=0; i<data.result[2].length; i++) {
			json[data.result[2][i].product] = {};
			json[data.result[2][i].product].realQty = data.result[2][i].qty;
			json[data.result[2][i].product].realPrice = data.result[2][i].price;
		}
		for(i=0; i<data.result[1].length; i++) {
			if (json[data.result[1][i].product] == undefined) {
				json[data.result[1][i].product] = {};
				json[data.result[1][i].product].realQty = 0;
				json[data.result[1][i].product].realPrice = 0;
			}
			else {
				json[data.result[1][i].product].name = data.result[1][i].name;
				json[data.result[1][i].product].orderQty = data.result[1][i].qty;
				json[data.result[1][i].product].orderPrice = data.result[1][i].price;
				json[data.result[1][i].product].sellPrice = data.result[1][i].sellPrice;
			}
		}

		var returnData = [];
		var keys = Object.keys(json);
		for(i=0; i<keys.length; i++) {
			var product = {};
			product.id = keys[i];
			product.name = json[keys[i]].name;
			product.orderQty = json[keys[i]].orderQty;
			product.realQty = json[keys[i]].realQty;
			product.orderPrice = json[keys[i]].orderPrice;
			product.realPrice = json[keys[i]].realPrice;
			product.sellPrice = json[keys[i]].sellPrice;
			returnData.push( product );
		}
		//console.log(returnData);
		data.json.product = returnData;
		//data.json.result = data.result;*/
	}

	data.util.responseJson(req, res, data.json);
};


exports.barcodeChecker = function(req, res, data) {
	data.json.return = true;
	
	if (data.result[0] != undefined) {
		data.json.success = true;
		data.json.summary = data.result[0];
		data.json.barcode = data.result[1];
	}

	data.util.responseJson(req, res, data.json);
};