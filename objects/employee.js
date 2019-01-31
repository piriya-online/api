exports.action = function(req, res, data) {
	
	try {
		if (data.action == 'Info'){			
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_ShopEmployeeInfo \''+req.body.shop+'\'';
				data.util.query(req, res, data)
			}			
		}
		else if (data.action == 'TypeInfo'){			
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_ShopEmployeeTypeInfo \''+req.body.shop+'\'';
				data.util.query(req, res, data)
			}			
		}
		else if (data.action == 'MappingInfo'){			
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_ShopEmployeeScreenMappingInfo \''+req.body.shop+'\'';
				data.util.query(req, res, data)
			}			
		}
		else if (data.action == 'ScreenInfo'){			
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_SystemScreenInfo';
				data.util.query(req, res, data)		
		}
		else if (data.action == 'PermissionInfo'){			
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_SystemScreenPermissionInfo';
				data.util.query(req, res, data)
		}
		else if (data.action == 'Add'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.employeeId != 'undefined' && req.body.employeeId != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_ShopEmployeeInsert \''+req.body.shop+'\', \''+req.body.employeeId+'\', \''+req.body.employeeType+'\', \''+req.body.firstname+'\', \''+req.body.lastname+'\', \''+req.body.nickname+'\', \''+req.body.mobile+'\', \''+req.body.code+'\', \''+req.body.username+'\', \''+req.body.password+'\', \''+req.body.status+'\', \''+req.body.logindate+'\', \''+req.body.logincount+'\', \''+req.body.addby+'\', \''+req.body.updateby+'\'';
				data.util.execute(req, res, data)
			}
		}
		else if (data.action == 'Delete'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.employeeId != 'undefined' && req.body.employeeId != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_ShopEmployeeDelete \''+req.body.shop+'\', \''+req.body.employeeId+'\'';
				data.util.execute(req, res, data)
			}
		}
		else if (data.action == 'AddType'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.id != 'undefined' && req.body.id != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_ShopEmployeeTypeInsert \''+req.body.shop+'\', \''+req.body.id+'\', \''+req.body.name+'\', \''+req.body.level+'\', \''+req.body.active+'\', \''+req.body.adddate+'\', \''+req.body.addby+'\', \''+req.body.updatedate+'\', \''+req.body.updateby+'\'';
				data.util.execute(req, res, data)
			}
		}
		else if (data.action == 'DeleteType'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.id != 'undefined' && req.body.id != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_ShopEmployeeTypeDelete \''+req.body.shop+'\', \''+req.body.id+'\'';
				data.util.execute(req, res, data)
			}
		}
		else if (data.action == 'AddScreen'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.system != 'undefined' && req.body.system != '' &&
				typeof req.body.screen != 'undefined' && req.body.screen != '' &&
				typeof req.body.permission != 'undefined' && req.body.permission != '' &&
				typeof req.body.employeetype != 'undefined' && req.body.employeetype != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_ShopEmployeeScreenMappingInsert \''+req.body.shop+'\', \''+req.body.system+'\', \''+req.body.screen+'\', \''+req.body.permission+'\', \''+req.body.employeetype+'\', \''+req.body.adddate+'\', \''+req.body.addby+'\'';
				data.util.execute(req, res, data)
			}
		}
		else if (data.action == 'DeleteScreen'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.system != 'undefined' && req.body.system != '' &&
				typeof req.body.screen != 'undefined' && req.body.screen != '' &&
				typeof req.body.permission != 'undefined' && req.body.permission != '' &&
				typeof req.body.employeetype != 'undefined' && req.body.employeetype != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_Pos_ShopEmployeeScreenMappingDelete \''+req.body.shop+'\', \''+req.body.system+'\', \''+req.body.screen+'\', \''+req.body.permission+'\', \''+req.body.employeetype+'\'';
				data.util.execute(req, res, data)
			}
		}
		else {
			data.json.error = 'API0011';
			data.json.errorMessage = 'Action ' + data.action.toUpperCase() + ' is not implemented';
		}

		data.util.responseJson(req, res, data.json);
		
	}catch(error){
		data.util.responseError(req, res, error);
	}

};
