exports.action = function(req, res, data) {
	try{
		if (data.action == 'topseller'){
			if (typeof req.body.year != 'undefined' && req.body.year != '' &&
			typeof req.body.month != 'undefined' && req.body.month != ''  &&
			typeof req.body.top != 'undefined' && req.body.top != '') {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_DataTopSeller \''+req.body.year+'\', \''+req.body.month+'\', \''+req.body.top+'\'';
				data.util.query(req, res, data);
			}
		}
		else if (data.action == 'productqtrinorder'){	
			if (typeof req.body.impNo != 'undefined' && req.body.orderNo != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_DataProductQtyInOrder \''+req.body.orderNo+'\'';
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
