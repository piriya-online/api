exports.action = function(req, res, data) {

	var lang = typeof req.body.language != 'undefined' && req.body.language != '' ? req.body.language : 'Th'; // Default Th
	
	try {
		console.log(data.action)
		if (data.action == 'list'){
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_ProvinceInfo \''+lang+'\'';
			data.util.query(req, res, data)
			
		}
		else if (data.action == 'district'){
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_DistrictInfo \''+lang+'\',\''+req.body.province+'\'';
			data.util.query(req, res, data)
		}
		else if (data.action == 'districtPos'){
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_Pos_DistrictInfo \''+lang+'\'';
			data.util.query(req, res, data)
		}
		else if (data.action == 'thailandInfo'){
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_ThailandInfo';
			data.util.queryMultiple(req, res, data)
		}
		else if (data.action == 'IdByName'){
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_ProvinceIDByName \''+lang+'\',\''+req.body.province+'\',\''+req.body.district+'\'';
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


