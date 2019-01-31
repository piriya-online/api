exports.action = function(req, res, data) {	
	try {
		if (data.action == 'register'){
			if (data.subAction[0] == 'new'){
				if (typeof req.body.firstname != 'undefined' && req.body.firstname != '' &&
					typeof req.body.lastname != 'undefined' && req.body.lastname != '' &&
					typeof req.body.mobile != 'undefined' && req.body.mobile != '' &&
					typeof req.body.shop != 'undefined' && req.body.shop != '' &&
					typeof req.body.province != 'undefined' && req.body.province != '' &&
					typeof req.body.password != 'undefined' && req.body.password != '' &&
					typeof req.body.password != 'undefined' && req.body.password != '')
				{
					data.json.return = false;
					data.command = 'EXEC sp_RewardRegister \''+req.body.apiKey+'\', \''+req.body.firstname+'\', \''+req.body.lastname+'\', \''+req.body.mobile+'\', \''+
						req.body.shop+'\', \''+req.body.province+'\', \''+data.util.encrypt(req.body.password, req.body.macAddress.toLowerCase())+'\', \''+req.body.macAddress+'\'';
					data.util.query(req, res, data);
				}
			}
			else if (data.subAction[0] == 'exist'){
				if (typeof req.body.macAddress != 'undefined' && req.body.macAddress != '')
				{
					data.json.return = false;
					data.command = 'EXEC sp_RewardRegisterExist \''+req.body.apiKey+'\', \''+req.body.macAddress+'\'';
					data.util.query(req, res, data);
				}
			}
		}
		else if (data.action == 'login'){
			if (typeof req.body.macAddress != 'undefined' && req.body.macAddress != '' && 
				typeof req.body.password != 'undefined' && req.body.password != '')
			{
				data.json.return = false;
				data.command = 'EXEC sp_RewardLogin \''+req.body.apiKey+'\', \''+req.body.macAddress+'\', \''+data.util.encrypt(req.body.password, req.body.macAddress.toLowerCase())+'\'';
				data.util.query(req, res, data);
			}
		}
	}
	catch(error) {
		data.util.responseError(req, res, error);
	}
};


//## Internal Method ##//
exports.process = function(req, res, data) {
	if (data.action == 'register'){
		if (data.subAction[0] == 'new'){
			exports.register(req, res, data);
		}
		else if (data.subAction[0] == 'exist'){
			exports.registerExist(req, res, data);
		}
	}
	else if (data.action == 'login'){
		exports.login(req, res, data);
	}
	/*else if (data.action == 'exist'){
		if (data.subAction[0] == 'memberKeyAndBrowser'){
			exports.memberKeyAndBrowserExist(req, res, data);
		} 
	}
	else if (data.action == 'info'){
		exports.memberInfo(req, res, data);
	}
	else if (data.action == 'update'){
		if (data.subAction[0] == 'role'){
			exports.updateRole(req, res, data);
		}
	}*/
};

exports.register = function(req, res, data) {
	data.json.return = true;
	if( data.result[0].result == 'already register' ) {
		data.json.error = 'RWD0001';
		data.json.errorMessage = 'Device already register';
	}
	else if( data.result[0].result == 'province not exists' ) {
		data.json.error = 'RWD0002';
		data.json.errorMessage = 'Province name does not exist';
	}
	else {
		var jwt = require('jsonwebtoken');
		data.token.macAddress = data.result[0].macAddress;
		data.json.token = jwt.sign(data.token, config.secretKey);
		data.json.success = true;
	}
	data.util.responseJson(req, res, data.json);
};


exports.login = function(req, res, data) {
	if( data.result[0].result == 1 ) {
		data.json.exist = true;
	}
	else {
		data.json.exist = false;
	}
	data.json.success = true;
	data.json.return = true;
	data.util.responseJson(req, res, data.json);
};


exports.registerExist = function(req, res, data) {
	if( data.result[0].result == 1 ) {
		data.json.exist = true;
		data.json.shop = data.result[0].shop;
		data.json.firstname = data.result[0].firstname;
		data.json.lastname = data.result[0].lastname;
		data.json.isLogin = data.result[0].isLogin == 1;
	}
	else {
		data.json.exist = false;
	}
	data.json.success = true;
	data.json.return = true;
	data.util.responseJson(req, res, data.json);
};