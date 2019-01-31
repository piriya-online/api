exports.action = function(req, res, data) {
	try{
		if (data.action == 'info'){
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_ClaimInfo \''+req.body.shop+'\', \''+req.body.id+'\', \''+req.body.barcode+'\', \''+req.body.claimdate_from+'\', \''+req.body.claimdate_to+'\', \''+req.body.status+'\', \''+req.body.firstname+'\', \''+req.body.lineid+'\', \''+req.body.tel+'\'';
			data.util.queryMultiple(req, res, data);
		}
		else if (data.action == 'add'){ 
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.from != 'undefined' && req.body.from != '' &&
				typeof req.body.barcode != 'undefined' && req.body.barcode != '' &&
				typeof req.body.product != 'undefined' && req.body.product != '' &&
				typeof req.body.description != 'undefined' && req.body.description != '' &&
				typeof req.body.firstname != 'undefined' && req.body.firstname != '' &&
				typeof req.body.lastname != 'undefined' && req.body.lastname != '' &&
				typeof req.body.address != 'undefined' && req.body.address != '' &&
				typeof req.body.province != 'undefined' && req.body.province != '' &&
				typeof req.body.district != 'undefined' && req.body.district != '' &&
				typeof req.body.subDistrict != 'undefined' && req.body.sub_district != '' &&
				typeof req.body.zipcode != 'undefined' && req.body.zipcode != '' &&
				typeof req.body.tel != 'undefined' && req.body.tel != '' &&
				typeof req.body.lastShop != 'undefined' && req.body.lastShop != ''&&
				typeof req.body.sellNo != 'undefined' && req.body.sellNo != '' &&
				typeof req.body.sellPrice != 'undefined' && req.body.sellPrice != '' &&
				typeof req.body.sellDate != 'undefined' && req.body.sellDate != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_ClaimAdd \''+req.body.from+'\',\''+req.body.shop+'\',\''+req.body.barcode+'\',\''+req.body.product+'\',\''+req.body.description+'\',\''+req.body.firstname+'\',\''+req.body.lastname+'\',\''+req.body.nickname+'\',\''+req.body.address+'\',\''+req.body.address2+'\',\''+req.body.province+'\',\''+req.body.district+'\',\''+req.body.subDistrict+'\',\''+req.body.zipcode+'\',\''+req.body.tel+'\',\''+req.body.email+'\',\''+req.body.images+'\',\''+req.body.lastShop+'\',\''+req.body.firstname+'\',\''+req.body.firstname+'\', \''+req.body.sellNo+'\',\''+req.body.sellPrice+'\',\''+req.body.usernameClaim+'\',\''+req.body.customerLineId+'\',\''+req.body.claimType+'\',\''+req.body.sellDate+'\'';
					data.util.query(req, res, data); 
			} 
		}
		else if (data.action == 'update'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.column != 'undefined' && req.body.column != '' &&
				typeof req.body.id != 'undefined' && req.body.id != '' &&
				typeof req.body.value != 'undefined' && req.body.value != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_ClaimUpdate \''+req.body.shop+'\', \''+req.body.id+'\', \''+req.body.column+'\', \''+req.body.value+'\'';
					data.util.execute(req, res, data);
			}
		}
		else if (data.action == 'customerAddress'){			
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ClaimCustomerAddress \''+req.body.username+'\'';
				data.util.query(req, res, data);
			
		}
		else if (data.action == 'barcodeExist'){			
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ClaimBarcodeExist \''+req.body.barcode+'\'';
				data.util.query(req, res, data);			
		}
		else if (data.action == 'claimSwap'){			
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ClaimSwap \''+req.body.shop+'\',\''+req.body.shopSwap+'\',\''+req.body.barcode+'\', \''+req.body.barcodeSwap+'\'';
				data.util.execute(req, res, data); 
		}
		else if (data.action == 'barcodeClaim'){	
			if (typeof req.body.barcode != 'undefined' && req.body.barcode != '') {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_ClaimInfo \''+req.body.barcode+'\'';
				data.util.query(req, res, data); 
			}
		}
		else if (data.action == 'report_monthly'){			
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_ReportClaimByMonth \''+req.body.year+'\', \''+req.body.month+'\'';
			data.util.queryMultiple(req, res, data); 			
		}
		else if (data.action == 'report_daily'){	
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
			typeof req.body.date != 'undefined' && req.body.date != '') {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ReportClaim \''+req.body.shop+'\', \''+req.body.date+'\'';
				data.util.queryMultiple(req, res, data); 
			}
		}
		else if (data.action == 'expHeaderInsert'){	
			if (typeof req.body.expNo != 'undefined' && req.body.expNo != '' &&
			typeof req.body.date != 'undefined' && req.body.date != '') {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ClaimExpHeaderInsert \''+req.body.expNo+'\', \''+req.body.date+'\', \''+req.body.totalPrice+'\', \''+req.body.expBy+'\'';
				data.util.execute(req, res, data); 
			}
		}
		else if (data.action == 'expDetailInsert'){	
			if (typeof req.body.expNo != 'undefined' && req.body.expNo != '' &&
			typeof req.body.product != 'undefined' && req.body.product != '') {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ClaimExpDetailInsert \''+req.body.expNo+'\', \''+req.body.product+'\', \''+req.body.quantity+'\', \''+req.body.price+'\'';
				data.util.execute(req, res, data); 
			}
		}
		else if (data.action == 'impHeaderInsert'){	
			if (typeof req.body.impNo != 'undefined' && req.body.impNo != '' &&
			typeof req.body.date != 'undefined' && req.body.date != '') {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ClaimExpHeaderInsert \''+req.body.impNo+'\', \''+req.body.date+'\', \''+req.body.totalPrice+'\', \''+req.body.impBy+'\'';
				data.util.execute(req, res, data); 
			}
		}
		else if (data.action == 'impDetailInsert'){	
			if (typeof req.body.impNo != 'undefined' && req.body.impNo != '' &&
			typeof req.body.product != 'undefined' && req.body.product != '') {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ClaimExpHeaderInsert \''+req.body.impNo+'\', \''+req.body.product+'\', \''+req.body.quantity+'\', \''+req.body.price+'\'';
				data.util.execute(req, res, data); 
			}
		}
		else if (data.action == 'impHeaderUpdate'){
			if (typeof req.body.impNo != 'undefined' && req.body.impNo != '' &&
				typeof req.body.column != 'undefined' && req.body.column != '' &&
				typeof req.body.value != 'undefined' && req.body.value != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_ClaimUpdate \''+req.body.impNo+'\', \''+req.body.column+'\', \''+req.body.value+'\'';
					data.util.execute(req, res, data);
			}
		}
		else if (data.action == 'impDetailUpdate'){
			if (typeof req.body.impNo != 'undefined' && req.body.impNo != '' &&
				typeof req.body.column != 'undefined' && req.body.column != '' &&
				typeof req.body.id != 'undefined' && req.body.id != '' &&
				typeof req.body.value != 'undefined' && req.body.value != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_ClaimUpdate \''+req.body.impNo+'\', \''+req.body.id+'\', \''+req.body.column+'\', \''+req.body.value+'\'';
					data.util.execute(req, res, data);
			}
		}
		else if (data.action == 'expHeaderUpdate'){
			if (typeof req.body.expNo != 'undefined' && req.body.impNo != '' &&
				typeof req.body.column != 'undefined' && req.body.column != '' &&
				typeof req.body.value != 'undefined' && req.body.value != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_ClaimUpdate \''+req.body.expNo+'\', \''+req.body.column+'\', \''+req.body.value+'\'';
					data.util.execute(req, res, data);
			}
		}
		else if (data.action == 'expDetailUpdate'){
			if (typeof req.body.expNo != 'undefined' && req.body.expNo != '' &&
				typeof req.body.column != 'undefined' && req.body.column != '' &&
				typeof req.body.id != 'undefined' && req.body.id != '' &&
				typeof req.body.value != 'undefined' && req.body.value != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_ClaimUpdate \''+req.body.expNo+'\', \''+req.body.id+'\', \''+req.body.column+'\', \''+req.body.value+'\'';
					data.util.execute(req, res, data);
			}
		}
		else if (data.action == 'addPos'){ 
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.from != 'undefined' && req.body.from != '' &&
				typeof req.body.barcode != 'undefined' && req.body.barcode != '' &&
				typeof req.body.product != 'undefined' && req.body.product != '' &&
				typeof req.body.description != 'undefined' && req.body.description != '' &&
				typeof req.body.firstname != 'undefined' && req.body.firstname != '' &&
				typeof req.body.lastname != 'undefined' && req.body.lastname != '' &&
				typeof req.body.address != 'undefined' && req.body.address != '' &&
				typeof req.body.province != 'undefined' && req.body.province != '' &&
				typeof req.body.district != 'undefined' && req.body.district != '' &&
				typeof req.body.subDistrict != 'undefined' && req.body.sub_district != '' &&
				typeof req.body.zipcode != 'undefined' && req.body.zipcode != '' &&
				typeof req.body.tel != 'undefined' && req.body.tel != '' &&
				typeof req.body.lastShop != 'undefined' && req.body.lastShop != ''&&
				typeof req.body.sellNo != 'undefined' && req.body.sellNo != '' &&
				typeof req.body.sellPrice != 'undefined' && req.body.sellPrice != '' &&
				typeof req.body.sellDate != 'undefined' && req.body.sellDate != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_ClaimAddPos \''+req.body.from+'\',\''+req.body.shop+'\',\''+req.body.barcode+'\',\''+req.body.product+'\',\''+req.body.description+'\',\''+req.body.firstname+'\',\''+req.body.lastname+'\',\''+req.body.nickname+'\',\''+req.body.address+'\',\''+req.body.address2+'\',\''+req.body.province+'\',\''+req.body.district+'\',\''+req.body.subDistrict+'\',\''+req.body.zipcode+'\',\''+req.body.tel+'\',\''+req.body.email+'\',\''+req.body.images+'\',\''+req.body.lastShop+'\',\''+req.body.firstname+'\',\''+req.body.firstname+'\', \''+req.body.sellNo+'\',\''+req.body.sellPrice+'\',\''+req.body.usernameClaim+'\',\''+req.body.customerLineId+'\',\''+req.body.claimType+'\',\''+req.body.sellDate+'\',\''+req.body.returnType+'\'';
					data.util.query(req, res, data); 
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
