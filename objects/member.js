exports.action = function(req, res, data) {
    try {
        if (data.action == 'register') {
            if (typeof req.body.type != 'undefined' && req.body.type != '' &&
                typeof req.body.value != 'undefined' && req.body.value != '') {
                var type = '|Web|Desktop|Android|iOS|Facebook|Google|Microsoft|'; // ชื่อ type ที่สามารถเพิ่มข้อมูลได้
                if (type.indexOf('|' + req.body.type + '|') == -1) { // ถ้าชื่อ type ไม่ถูกต้อง
                    data.json.error = 'MBR0001';
                    data.json.errorMessage = 'Unknown type ' + req.body.type;
                    data.util.responseJson(req, res, data.json);
                } else {
                    data.json.return = false;
                    data.jsonPost = JSON.parse(req.body.value);
                    if (req.body.type == 'Web') {
                        exports.registerWeb(req, res, data);
                    } else {
                        data.json.return = true;
                        data.json.error = 'MBR0002';
                        data.json.errorMessage = 'Waiting for develop';
                        data.util.responseJson(req, res, data.json);
                    }
                }
            }
        } else if (data.action == 'login') {
            if (typeof req.body.username != 'undefined' && req.body.username != '' &&
                typeof req.body.password != 'undefined' && req.body.password != '') {
                data.json.return = false;
                var password = data.util.encrypt(req.body.password, req.body.username.toLowerCase());
                data.command = 'EXEC sp_MemberLogin \'' + req.body.username + '\', \'' + password + '\'';
                data.util.query(req, res, data);
            }
        } else if (data.action == 'update') {
            if (data.subAction[0] == 'role') {
                console.log('EXEC sp_MemberUpdateRole \'' + req.body.token.memberKey + '\', \'' + req.body.role + '\'');
                if (typeof req.body.role != 'undefined' && req.body.role != '') {
                    data.json.return = false;
                    data.command = 'EXEC sp_MemberUpdateRole \'' + req.body.token.memberKey + '\', \'' + req.body.role + '\'';
                    data.util.query(req, res, data);
                }
            } else if (data.subAction[0] == 'info') {
                if (typeof req.body.token.memberKey != 'undefined' && req.body.token.memberKey != '' &&
                    typeof req.body.column != 'undefined' && req.body.column != '' &&
                    typeof req.body.value != 'undefined' && req.body.value != '') {
                    data.json.return = false;
                    data.json.returnResult = true;
                    data.command = 'EXEC sp_MemberUpdateInfo \'' + req.body.token.memberKey + '\', \'' + req.body.column + '\', \'' + req.body.value + '\'';
                    data.util.query(req, res, data);
                }
            } else if (data.subAction[0] == 'password') {
                if (typeof req.body.token.memberKey != 'undefined' && req.body.token.memberKey != '' &&
                    typeof req.body.token.username != 'undefined' && req.body.token.username != '' &&
                    typeof req.body.currentPassword != 'undefined' && req.body.currentPassword != '' &&
                    typeof req.body.newPassword != 'undefined' && req.body.newPassword != '') {
                    var currentPassword = data.util.encrypt(req.body.currentPassword, req.body.token.username.toLowerCase());
                    var newPassword = data.util.encrypt(req.body.newPassword, req.body.token.username.toLowerCase());
                    data.json.return = false;
                    data.json.returnResult = true;
                    data.command = 'EXEC sp_MemberUpdatePassword \'' + req.body.token.memberKey + '\', \'' + currentPassword + '\', \'' + newPassword + '\'';
                    data.util.query(req, res, data);
                }
            }
            else if (data.subAction[0] == 'password_update') {
                if (typeof req.body.memberKey != 'undefined' && req.body.memberKey != '' &&
                    typeof req.body.password != 'undefined' && req.body.password != '') {
                    data.json.return = false;
                    data.json.returnResult = true;
                    data.command = 'EXEC sp_MemberUpdatePassword \'' + req.body.memberKey + '\', \'' + req.body.password + '\'';
                    data.util.execute(req, res, data);
                }
            }
        } else if (data.action == 'summary') {
            if (data.subAction[0] == 'alert') {
                if (typeof req.body.token.memberKey != 'undefined' && req.body.token.memberKey != '' &&
                    typeof req.body.screen != 'undefined' && req.body.screen != '') {
                    data.json.return = false;
                    data.json.returnResult = true;
                    data.command = 'EXEC sp_MemberSummaryAlert \'' + req.body.token.memberKey + '\', \'' + req.body.screen + '\'';
                    data.util.query(req, res, data);
                }
            }
        } else if (data.action == 'order') {
            if (data.subAction[0] == 'history') {
                if (typeof req.body.token.memberKey != 'undefined' && req.body.token.memberKey != '') {
                    data.json.return = false;
                    data.json.returnResult = true;
                    data.command = 'EXEC sp_MemberOrderHistory \'' + req.body.token.memberKey + '\'';
                    data.util.query(req, res, data);
                }
            }
        }
        /*else if (data.action == 'exist'){
        	if (data.subAction[0] == 'memberKeyAndBrowser'){
        		if (typeof req.body.memberKey != 'undefined' && req.body.memberKey != '' &&
        			typeof req.body.ip != 'undefined' && req.body.ip != '' &&
        			typeof req.body.browser != 'undefined' && req.body.browser != '' &&
        			typeof req.body.version != 'undefined' && req.body.version != '' &&
        			typeof req.body.platform != 'undefined' && req.body.platform != '' &&
        			typeof req.body.os != 'undefined' && req.body.os != '' &&
        			typeof req.body.deviceType != 'undefined' && req.body.deviceType != '') {
        				data.json.return = false;
        				data.command = 'EXEC sp_MemberKeyAndBrowserExist \''+req.body.memberKey+'\', \''+req.body.ip+'\', \''+req.body.browser+'\', \''+req.body.version+'\', \''+req.body.platform+'\', \''+req.body.os+'\', \''+req.body.deviceType+'\'';
        				data.util.query(req, res, data);
        		}
        	}
        }*/
        else if (data.action == 'info') {
            if (typeof req.body.token.memberKey != 'undefined' && req.body.token.memberKey != '') {
                data.json.return = false;
                data.command = 'EXEC sp_MemberInfo \'' + req.body.token.memberKey + '\', \'' + data.referer + '\'';
                data.util.queryMultiple(req, res, data);
            }
        } else if (data.action == 'address') {
            if (data.subAction[0] == 'add') {
                if (typeof req.body.token.memberKey != 'undefined' && req.body.token.memberKey != '' &&
                    typeof req.body.firstname != 'undefined' && req.body.firstname != '' &&
                    typeof req.body.lastname != 'undefined' && req.body.lastname != '' &&
                    typeof req.body.mobile != 'undefined' && req.body.mobile != '' &&
                    typeof req.body.address != 'undefined' && req.body.address != '' &&
                    typeof req.body.subDistrict != 'undefined' && req.body.subDistrict != '' &&
                    typeof req.body.district != 'undefined' && req.body.district != '' &&
                    typeof req.body.province != 'undefined' && req.body.province != '' &&
                    typeof req.body.zipcode != 'undefined' && req.body.zipcode != '') {
                    data.json.return = false;
                    data.json.returnResult = true;
                    data.command = 'EXEC sp_MemberAddressUpdate \'' + req.body.token.memberKey + '\' ,\'' + req.body.firstname + '\' ,\'' + req.body.lastname + '\' ,\'' + req.body.contactName + '\' ,\'' + req.body.mobile + '\' ,\'' + req.body.shopName + '\' ,\'' + req.body.address + '\' ,\'' + req.body.address2 + '\' ,\'' + req.body.subDistrict + '\' ,\'' + req.body.district + '\' ,\'' + req.body.province + '\' ,\'' + req.body.zipcode + '\'';
                    data.util.execute(req, res, data);
                }
            } else if (data.subAction[0] == 'info') {
                if (typeof req.body.token.memberKey != 'undefined' && req.body.token.memberKey != '') {
                    data.json.return = false;
                    data.json.returnResult = true;
                    data.command = 'EXEC sp_MemberAddressInfo \'' + req.body.token.memberKey + '\'';
                    data.util.query(req, res, data);
                }
            }

        } else if (data.action == 'search') {
            if (typeof req.body.search != 'undefined' && req.body.search != '') {
                data.json.return = false;
								data.json.returnResult = true;
                data.command = 'EXEC sp_MemberSearch \'' + req.body.search + '\'';
                data.util.query(req, res, data);
            }
        } else if (data.action == 'memberToDealer') {
            if (typeof req.body.member != 'undefined' && req.body.member && typeof req.body.sellPrice != 'undefined' && req.body.sellPrice != '' && typeof req.body.memberType != 'undefined' && req.body.memberType != '') {
                data.json.return = false;
								data.json.returnResult = true;
                data.command = 'EXEC sp_MemberToDealer \'' + req.body.member + '\', \'' + req.body.sellPrice + '\', \'' + req.body.memberType + '\'';
                data.util.execute(req, res, data);
            }
        } 
		else if (data.action == 'decode') {
            if (typeof req.body.id != 'undefined' && req.body.id != '') {
                data.json.return = false;
				data.json.returnResult = true;
                data.command = 'EXEC sp_MemberDecode \'' + req.body.id + '\'';
                data.util.query(req, res, data);
            }
		}
		else {
            data.json.error = 'API0011';
            data.json.errorMessage = 'Action ' + data.action.toUpperCase() + ' is not implemented';
        }

        data.util.responseJson(req, res, data.json);

    } catch (error) {
        data.util.responseError(req, res, error);
    }
};


//## Internal Method ##//
exports.process = function(req, res, data) {
    if (data.action == 'register') {
        exports.register(req, res, data);
    } else if (data.action == 'login') {
        exports.login(req, res, data);
    } else if (data.action == 'exist') {
        if (data.subAction[0] == 'memberKeyAndBrowser') {
            exports.memberKeyAndBrowserExist(req, res, data);
        }
    } else if (data.action == 'info') {
        exports.memberInfo(req, res, data);
    } else if (data.action == 'update') {
        if (data.subAction[0] == 'role') {
            exports.updateRole(req, res, data);
        }
    }
};

exports.registerWeb = function(req, res, data) {
    if (typeof data.jsonPost.username == 'undefined' || data.jsonPost.username == '') {
        data.json.return = true;
        data.json.error = 'MBR0030';
        data.json.errorMessage = 'Please input entity Username';
        data.util.responseJson(req, res, data.json);
    } else if (typeof data.jsonPost.password == 'undefined' || data.jsonPost.password == '') {
        data.json.return = true;
        data.json.error = 'MBR0040';
        data.json.errorMessage = 'Please input entity Password';
        data.util.responseJson(req, res, data.json);
    } else if (typeof data.jsonPost.mobile == 'undefined' || data.jsonPost.mobile == '') {
        data.json.return = true;
        data.json.error = 'MBR0050';
        data.json.errorMessage = 'Please input entity Mobile Phone Number';
        data.util.responseJson(req, res, data.json);
    } else if (typeof data.jsonPost.email == 'undefined' || data.jsonPost.email == '') {
        data.json.return = true;
        data.json.error = 'MBR0060';
        data.json.errorMessage = 'Please input entity Email';
        data.util.responseJson(req, res, data.json);
    } else {
        data.json.return = false;
        data.command = 'EXEC sp_MemberRegister \'' + data.jsonPost.username + '\', \'' + data.util.encrypt(data.jsonPost.password, data.jsonPost.username.toLowerCase()) + '\', \'' + data.jsonPost.mobile + '\', \'' + data.util.encrypt(data.jsonPost.password, data.jsonPost.mobile.toLowerCase()) + '\', \'' + data.jsonPost.email + '\', \'' + data.util.encrypt(data.jsonPost.password, data.jsonPost.email.toLowerCase()) + '\'';
        data.util.query(req, res, data);
    }
};

exports.register = function(req, res, data) {
    data.json.return = true;
    if (data.result[0].result == 'username already exists') {
        data.json.error = 'MBR0031';
        data.json.errorMessage = 'Username already exists';
    } else if (data.result[0].result == 'mobile already exists') {
        data.json.error = 'MBR0051';
        data.json.errorMessage = 'Mobile phone number already exists';
    } else if (data.result[0].result == 'email already exists') {
        data.json.error = 'MBR0061';
        data.json.errorMessage = 'Email already exists';
    } else {
        var jwt = require('jsonwebtoken');
        data.token.memberId = data.result[0].memberId;
        data.json.token = jwt.sign(data.token, config.secretKey);
        data.json.success = true;
    }
    data.util.responseJson(req, res, data.json);
};

exports.login = function(req, res, data) {
    data.json.return = true;
    if (data.result[0].result == 'not exists') {
        data.json.error = 'MBR0032';
        data.json.errorMessage = 'Invalid Username or Password';
    } else {
        var jwt = require('jsonwebtoken');
        data.token.username = data.result[0].username;
        data.token.memberKey = data.result[0].result;
        data.token.memberId = data.result[0].memberId;
        data.token.keyInsert = data.result[0].keyInsert;
        data.token.keyUpdate = data.result[0].keyUpdate;
        data.token.keyDelete = data.result[0].keyDelete;

        data.json.token = jwt.sign(data.token, config.secretKey);
        data.json.success = true;
        if (typeof req.body.info != 'undefined' && req.body.info != '') {
            try {
                var token = jwt.verify(req.body.info, '' + data.token.secretKey);
                data.command = 'EXEC sp_MemberLoginInfoUpdate \'' + data.token.memberKey + '\', \'' + token.ip + '\', \'' + token.browser + '\', \'' + token.version + '\', \'' + token.platform + '\', \'' + token.os + '\', \'' + token.deviceType + '\', \'' + ((typeof req.body.failedCount != 'undefined' && req.body.failedCount != '') ? req.body.failedCount : '0') + '\'';
                data.util.query(req, res, data);
            } catch (error) {
                console.log(error);
            }
        }

    }
    data.util.responseJson(req, res, data.json);
};

exports.memberInfo = function(req, res, data) {
    data.json.return = true;
    if (data.result[0].result == 'member does not exist') {
        data.json.error = 'MBR0071';
        data.json.errorMessage = 'Member does not exist';
    } else {
        data.json.success = true;
        data.json.memberInfo = data.result[0][0];
        data.json.memberType = data.result[2];

        var screen = {};
        for (i = 0; i < data.result[1].length; i++) {
            if (data.result[1][i].parent == null || data.result[1][i].parent == '') {
                screen[data.result[1][i].screen] = {};
                screen[data.result[1][i].screen].link = data.result[1][i].link;
                screen[data.result[1][i].screen].icon = data.result[1][i].icon;
                screen[data.result[1][i].screen].hasChild = false;
                screen[data.result[1][i].screen].child = {};
            } else {
                screen[data.result[1][i].parent].hasChild = true;
                screen[data.result[1][i].parent].child[data.result[1][i].screen] = {};
                screen[data.result[1][i].parent].child[data.result[1][i].screen] = data.result[1][i].link.toString();
            }
        }

        data.json.screen = screen;
    }
    data.util.responseJson(req, res, data.json);
};

exports.updateRole = function(req, res, data) {
    data.json.return = true;
    if (data.result[0].result == 'member does not exist') {
        data.json.error = 'MBR0071';
        data.json.errorMessage = 'Member does not exist';
    } else if (data.result[0].result == 'memberType not exist') {
        data.json.error = 'MBR0072';
        data.json.errorMessage = 'Member Type does not exist';
    } else {
        data.json.success = true;
    }
    data.util.responseJson(req, res, data.json);
};

//## Utilities Method ##//
String.prototype.capitalizeCase = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
