exports.action = function(req, res, data) {
	try{
		if (data.action == 'info'){
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_TransportOrderWaiting \''+req.body.orderNo+'\'';
			data.util.query(req, res, data);
		}
		else if (data.action == 'add'){ 
			if (typeof req.body.memberKey != 'undefined' && req.body.memberKey != '' &&
				typeof req.body.orderNo != 'undefined' && req.body.orderNo != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_TransportOrderAdd \''+req.body.memberKey+'\',\''+req.body.orderNo+'\'';
					data.util.execute(req, res, data); 
			} 
		}
		else if (data.action == 'assign'){ 
			
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_TransportOrderAssign \''+req.body.memberKey+'\',\''+req.body.orderNo+'\'';
			data.util.query(req, res, data); 
			 
		}
		else if (data.action == 'confirmSend'){ 
			if (typeof req.body.memberKey != 'undefined' && req.body.memberKey != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_TransportOrderConfirmSend \''+req.body.memberKey+'\',\''+req.body.orderNo+'\'';
					data.util.execute(req, res, data); 
			} 
		}
		else if (data.action == 'cancelAssign'){ 
			if (typeof req.body.memberKey != 'undefined' && req.body.memberKey != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_TransportOrderCancelAssign \''+req.body.memberKey+'\',\''+req.body.orderNo+'\'';
					data.util.execute(req, res, data); 
			} 
		}
		else if (data.action == 'transportSent'){ 			
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_TransportOrderSent \''+req.body.date+'\',\''+req.body.orderNo+'\'';
			data.util.query(req, res, data); 			
		}
		else if (data.action == 'transporter'){ 			
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_Transporter';
			data.util.query(req, res, data); 			
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

