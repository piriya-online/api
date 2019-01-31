exports.action = function(req, res, data) {
	try{
		if (data.action == 'saleInfo'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_Pos_SellInfo \''+req.body.shop+'\'';
					data.util.query(req, res, data);
			}
		}
		else if (data.action == 'saleDetailInfo'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_Pos_SellDetailInfo \''+req.body.shop+'\'';
					data.util.query(req, res, data);
			}
		}
		else if (data.action == 'saleAdd'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.saleno != 'undefined' && req.body.saleno != '' &&
				typeof req.body.totalPrice != 'undefined' && req.body.totalPrice != '' &&
				typeof req.body.saledate != 'undefined' && req.body.saledate != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_Pos_SellHeaderInsert \''+req.body.shop+'\',\''+req.body.saleno+'\',\''+req.body.profit+'\',\''+req.body.totalPrice+'\',\''+req.body.payType+'\',\''+req.body.cash+'\',\''+req.body.credit+'\',\''+req.body.customer+'\',\''+req.body.sex+'\',\''+req.body.age+'\',\''+req.body.comment+'\',\''+req.body.saledate+'\',\''+req.body.saleby+'\'';
					data.util.execute(req, res, data);
			}
		}
		else if (data.action == 'sale'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.saleno != 'undefined' && req.body.saleno != '' &&
				typeof req.body.totalPrice != 'undefined' && req.body.totalPrice != '' &&
				typeof req.body.saledate != 'undefined' && req.body.saledate != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_Pos_SellHeader \''+req.body.shop+'\',\''+req.body.saleno+'\',\''+req.body.profit+'\',\''+req.body.totalPrice+'\',\''+req.body.payType+'\',\''+req.body.cash+'\',\''+req.body.credit+'\',\''+req.body.customer+'\',\''+req.body.sex+'\',\''+req.body.age+'\',\''+req.body.comment+'\',\''+req.body.saledate+'\',\''+req.body.saleby+'\',\''+req.body.discountcash+'\',\''+req.body.discountpercent+'\'';
					data.util.execute(req, res, data);
			}
		}
		else if (data.action == 'saleDetailAdd'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.saleno != 'undefined' && req.body.saleno != '' &&
				typeof req.body.product != 'undefined' && req.body.product != '' &&
				typeof req.body.price != 'undefined' && req.body.price != '' &&
				typeof req.body.cost != 'undefined' && req.body.cost != '' &&
				typeof req.body.quantity != 'undefined' && req.body.quantity != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_Pos_SellDetailInsert \''+req.body.shop+'\',\''+req.body.saleno+'\',\''+req.body.product+'\',\''+req.body.price+'\',\''+req.body.cost+'\',\''+req.body.quantity+'\',\''+req.body.comment+'\'';
					data.util.execute(req, res, data);
			}
		}
		else if (data.action == 'changePriceInfo'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '') {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_Pos_ChangePriceInfo \''+req.body.shop+'\'';
					data.util.query(req, res, data);
			}
		}
		else if (data.action == 'ChangePriceAdd'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.saleno != 'undefined' && req.body.saleno != '' &&
				typeof req.body.product != 'undefined' && req.body.product != '' ) {
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_Pos_ChangePriceInsert \''+req.body.shop+'\',\''+req.body.saleno+'\',\''+req.body.product+'\',\''+req.body.price+'\',\''+req.body.change+'\',\''+req.body.by+'\',\''+req.body.date+'\'';
					data.util.execute(req, res, data);
			}
		}
		else if (data.action == 'monthly'){
			if (data.subAction[0] == 'category'){
				if (typeof req.body.category != 'undefined' && req.body.category != '' &&
					typeof req.body.month != 'undefined' && req.body.month != '' ) {
						data.json.return = false;
						data.json.returnResult = true;
						data.command = 'EXEC sp_DataMonthlySaleByCategory \''+req.body.category+'\', \''+req.body.month+'\', \''+req.body.brand+'\'';
						data.util.query(req, res, data);
				}
			}
		}
		else if (data.action == 'monthlySaleOfYear'){
			if (typeof req.body.year != 'undefined' && req.body.year != ''){
				data.json.return = false;
				data.json.returnResult = false;
				data.command = 'EXEC sp_ReportMonthlySaleByYear \''+req.body.year+'\', \''+req.body.brand+'\', \''+req.body.notbrand+'\'';
				data.util.queryMultiple(req, res, data);
				//console.log(data.command);
			}
		}
		else if (data.action == 'monthlySaleDetail'){
			if (typeof req.body.year != 'undefined' && req.body.year != '' &&
				typeof req.body.month != 'undefined' && req.body.month != '' &&
				typeof req.body.type != 'undefined' && req.body.type != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ReportMonthlySaleDetail \''+req.body.year+'\', \''+req.body.month+'\', \''+req.body.type+'\', \''+req.body.brand+'\'';
				data.util.query(req, res, data);
			}
		}
		else if (data.action == 'monthlySaleHistory'){
			if (typeof req.body.member != 'undefined' && req.body.member != '' &&
				typeof req.body.type != 'undefined' && req.body.type != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ReportMonthlySaleHistory \''+req.body.member+'\', \''+req.body.type+'\', \''+req.body.brand+'\'';
				data.util.query(req, res, data);
			}
		}
		else if (data.action == 'dataMonthInSell'){
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_DataMonthInSell';
			data.util.query(req, res, data);
		}
		else if (data.action == 'dailySaleOfMonth'){
			if (typeof req.body.year != 'undefined' && req.body.year != '' &&
				typeof req.body.month != 'undefined' && req.body.month != ''){
				data.json.return = false;
				data.json.returnResult = false;
				data.command = 'EXEC sp_ReportDailySaleByMonth \''+req.body.year+'\',\''+req.body.month+'\', \''+req.body.brand+'\'';
				data.util.queryMultiple(req, res, data);
			}
		}
		else if (data.action == 'dailySaleDetail'){
			if (typeof req.body.year != 'undefined' && req.body.year != '' &&
				typeof req.body.month != 'undefined' && req.body.month != '' &&
				typeof req.body.day != 'undefined' && req.body.day != '' &&
				typeof req.body.type != 'undefined' && req.body.type != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ReportDailySaleDetail \''+req.body.year+'\', \''+req.body.month+'\', \''+req.body.day+'\', \''+req.body.type+'\', \''+req.body.brand+'\'';
				data.util.query(req, res, data);
			}
		}
		else if (data.action == 'monthlySaleByProduct'){
			if (typeof req.body.year != 'undefined' && req.body.year != '' &&
				typeof req.body.month != 'undefined' && req.body.month != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ReportMonthlySaleByProduct '+req.body.year+', '+req.body.month;
				data.util.queryMultiple(req, res, data);
			}
		}
		else if (data.action == 'monthlySaleByProductHistory'){
			if (typeof req.body.product != 'undefined' && req.body.product != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ReportMonthlySaleByProductHistory '+req.body.product;
				data.util.query(req, res, data);
			}
		} else if (data.action == 'shop'){
			if (data.subAction[0] == 'monthly'){
				if (data.subAction[1] == 'category'){
					if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
					typeof req.body.category != 'undefined' && req.body.category != '' &&
						typeof req.body.month != 'undefined' && req.body.month != '' ) {
							data.json.return = false;
							data.json.returnResult = true;
							data.command = 'EXEC sp_DataMonthlyShopSaleByCategory \''+req.body.shop+'\',\''+req.body.category+'\', '+req.body.month;
							data.util.query(req, res, data);
					}
				}
			}
		}
		else if (data.action == 'targets'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_TargetDay \''+req.body.shop+'\'';
				data.util.query(req, res, data);
			}
		}
		else if (data.action == 'totalPriceByMonth'){
			if (typeof req.body.year != 'undefined' && req.body.year != '' &&
				typeof req.body.month != 'undefined' && req.body.month != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_TotalPriceByMonth \''+req.body.year+'\',\''+req.body.month+'\'';
				data.util.query(req, res, data);
			}
		}
		else if (data.action == 'monthlySaleOfYear_table'){
			if (typeof req.body.year != 'undefined' && req.body.year != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ReportMonthlySale \''+req.body.year+'\',\''+req.body.brand+'\', \''+req.body.notbrand+'\'';
				data.util.query(req, res, data);
			}
		}
		else if (data.action == 'monthlyProfitOfYear_table'){
			if (typeof req.body.year != 'undefined' && req.body.year != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ReportMonthlyProfit \''+req.body.year+'\',\''+req.body.brand+'\', \''+req.body.notbrand+'\'';
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


//## Internal Method ##//
exports.process = function(req, res, data) {
	if (data.action == 'monthlySaleOfYear') {
		var result = {};
		result.sales = {};
		result.profit = {};
		result.qty = {};
		result.bill = {};
		result.price = {};
		result.price1 = {};
		result.price2 = {};
		result.price3 = {};
		result.price4 = {};
		result.price5 = {};
		result.brand = {};
		for(i=1; i<=12; i++){
			result.sales[''+i] = {};
			result.sales[''+i]['member'] = 0;
			result.sales[''+i]['chain'] = 0;
			result.sales[''+i]['shop'] = 0;
			result.sales[''+i]['premium'] = 0;
			result.sales[''+i]['event'] = 0;
			result.sales[''+i]['consign'] = 0;
			result.sales[''+i]['eventShop'] = 0;
			result.profit[''+i] = {};
			result.profit[''+i]['member'] = 0;
			result.profit[''+i]['chain'] = 0;
			result.profit[''+i]['shop'] = 0;
			result.profit[''+i]['premium'] = 0;
			result.profit[''+i]['event'] = 0;
			result.profit[''+i]['consign'] = 0;
			result.profit[''+i]['eventShop'] = 0;
			result.qty[''+i] = {};
			result.qty[''+i]['member'] = 0;
			result.qty[''+i]['chain'] = 0;
			result.qty[''+i]['shop'] = 0;
			result.qty[''+i]['premium'] = 0;
			result.qty[''+i]['event'] = 0;
			result.qty[''+i]['consign'] = 0;
			result.qty[''+i]['eventShop'] = 0;
			result.bill[''+i] = {};
			result.bill[''+i]['member'] = 0;
			result.bill[''+i]['chain'] = 0;
			result.bill[''+i]['shop'] = 0;
			result.bill[''+i]['premium'] = 0;
			result.bill[''+i]['event'] = 0;
			result.bill[''+i]['consign'] = 0;
			result.bill[''+i]['eventShop'] = 0;
			result.price1[''+i] = {};		result.price1[''+i]['price'] = 0;		result.price1[''+i]['qty'] = 0;		result.price1[''+i]['bill'] = 0;
			result.price2[''+i] = {};		result.price2[''+i]['price'] = 0;		result.price2[''+i]['qty'] = 0;		result.price2[''+i]['bill'] = 0;
			result.price3[''+i] = {};		result.price3[''+i]['price'] = 0;		result.price3[''+i]['qty'] = 0;		result.price3[''+i]['bill'] = 0;
			result.price4[''+i] = {};		result.price4[''+i]['price'] = 0;		result.price4[''+i]['qty'] = 0;		result.price4[''+i]['bill'] = 0;
			result.price5[''+i] = {};		result.price5[''+i]['price'] = 0;		result.price5[''+i]['qty'] = 0;		result.price5[''+i]['bill'] = 0;
		}

		for(i=0; i<data.result[0].length; i++){
			var recordset = data.result[0][i];
			result.sales[''+recordset.monthNo][recordset.memberType] = recordset.price;
			result.profit[''+recordset.monthNo][recordset.memberType] = recordset.price-recordset.cost;
			result.qty[''+recordset.monthNo][recordset.memberType] = recordset.qty;
			result.bill[''+recordset.monthNo][recordset.memberType] = recordset.bill;
		}
		for(i=0; i<data.result[1].length; i++){
			var recordset = data.result[1][i];
			result['price'+((recordset.sellPrice == '0') ? '1' : recordset.sellPrice)][''+recordset.monthNo].price = recordset.price;
			result['price'+((recordset.sellPrice == '0') ? '1' : recordset.sellPrice)][''+recordset.monthNo].qty = recordset.qty;
			result['price'+((recordset.sellPrice == '0') ? '1' : recordset.sellPrice)][''+recordset.monthNo].bill = recordset.bill;
		}
		for(i=1; i<=5; i++){
			result.price[''+i] = {};
			result.price[''+i] = result['price'+i];
			delete result['price'+i];
		}

		delete data.json.returnResult;
		data.json.result = result;
		data.json.return = true;
		data.json.success = true;
		data.util.responseJson(req, res, data.json);
	}
	else if (data.action == 'dailySaleOfMonth') {
		var result = {};
		result.sales = {};
		result.qty = {};
		result.bill = {};
		var d = new Date(parseInt(req.body.year), parseInt(req.body.month), 0);
		for(i=1; i<=d.getDate(); i++){
			result.sales[''+i] = {};
			result.sales[''+i]['member'] = 0;
			result.sales[''+i]['chain'] = 0;
			result.sales[''+i]['shop'] = 0;
			result.sales[''+i]['premium'] = 0;
			result.sales[''+i]['event'] = 0;
			result.sales[''+i]['consign'] = 0;
			result.sales[''+i]['eventShop'] = 0;
			result.qty[''+i] = {};
			result.qty[''+i]['member'] = 0;
			result.qty[''+i]['chain'] = 0;
			result.qty[''+i]['shop'] = 0;
			result.qty[''+i]['premium'] = 0;
			result.qty[''+i]['event'] = 0;
			result.qty[''+i]['consign'] = 0;
			result.qty[''+i]['eventShop'] = 0;
			result.bill[''+i] = {};
			result.bill[''+i]['member'] = 0;
			result.bill[''+i]['chain'] = 0;
			result.bill[''+i]['shop'] = 0;
			result.bill[''+i]['premium'] = 0;
			result.bill[''+i]['event'] = 0;
			result.bill[''+i]['consign'] = 0;
			result.bill[''+i]['eventShop'] = 0;
		}
		for(i=0; i<data.result[0].length; i++){
			var recordset = data.result[0][i];
			result.sales[''+recordset.dayNo][recordset.memberType] = recordset.price;
			result.qty[''+recordset.dayNo][recordset.memberType] = recordset.qty;
			result.bill[''+recordset.dayNo][recordset.memberType] = recordset.bill;
		}
		delete data.json.returnResult;
		data.json.result = result;
		data.json.return = true;
		data.json.success = true;
		data.util.responseJson(req, res, data.json);
	}
	else {
		data.json.error = 'API0002';
		data.json.errorMessage = 'Unknow Action';
		data.util.responseJson(req, res, data.json);
	}
};
