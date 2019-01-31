exports.action = function(req, res, data) {
	try{
		if (data.action == 'info'){
			if (typeof req.body.memberKey != 'undefined' && req.body.memberKey != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_NewsInfo \''+req.body.memberKey+'\'';
				data.util.query(req, res, data);
			}		
		}
		else if (data.action == 'add'){ 
			if (typeof req.body.message != 'undefined' && req.body.message != '' &&
				typeof req.body.memberKey != 'undefined' && req.body.memberKey != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_NewsAdd \''+req.body.memberType+'\',\''+req.body.member+'\',\''+req.body.message+'\',\''+req.body.memberKey+'\'';
					data.util.execute(req, res, data); 
			} 
		}
		else if (data.action == 'update'){ 	
			if (typeof req.body.id != 'undefined' && req.body.id != '' &&
				typeof req.body.memberKey != 'undefined' && req.body.memberKey != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_NewsAdd \''+req.body.id+'\',\''+req.body.message+'\',\''+req.body.active+'\',\''+req.body.visible+'\',\''+req.body.memberKey+'\'';
					data.util.execute(req, res, data); 
			}
		}
		else if (data.action == 'updateVisible'){ 	
			if (typeof req.body.id != 'undefined' && req.body.id != '' &&
				typeof req.body.memberKey != 'undefined' && req.body.memberKey != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_NewsUpdateVisible \''+req.body.id+'\',\''+req.body.visible+'\',\''+req.body.memberKey+'\'';
					data.util.execute(req, res, data); 
			}
		}
		else if (data.action == 'updateMessage'){ 	
			if (typeof req.body.id != 'undefined' && req.body.id != '' &&
				typeof req.body.memberKey != 'undefined' && req.body.memberKey != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_NewsUpdateMessage \''+req.body.id+'\',\''+req.body.message+'\',\''+req.body.memberKey+'\'';
					data.util.execute(req, res, data); 
			}
		}
		else if (data.action == 'count'){ 	
			if (typeof req.body.memberKey != 'undefined' && req.body.memberKey != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_NewsCount \''+req.body.memberKey+'\'';
					data.util.query(req, res, data); 
			}
		}
		else if (data.action == 'read'){ 	
			if (typeof req.body.memberKey != 'undefined' && req.body.memberKey != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_NewsRead \''+req.body.memberKey+'\'';
					data.util.execute(req, res, data); 
			}
		}
		else if (data.action == 'searchByMemberId'){ 	
			if (typeof req.body.memberId != 'undefined' && req.body.memberId != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_NewsByMemberId \''+req.body.memberId+'\'';
					data.util.query(req, res, data); 
			}
		}
		else if (data.action == 'searchByMemberMessage'){ 	
			if (typeof req.body.message != 'undefined' && req.body.message != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_NewsByMessage \''+req.body.message+'\'';
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

