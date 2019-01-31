exports.action = function(req, res, data) {
	try{
		if (data.action == 'salesSummary'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
			typeof req.body.date_from != 'undefined' && req.body.date_from != '' &&
			typeof req.body.date_to != 'undefined' && req.body.date_to != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_rpt_Sales_Summary \''+req.body.shop+'\', \''+req.body.date_from+'\', \''+req.body.date_to+'\'';
				data.util.query(req, res, data);
			}
		} else if (data.action == 'headSalesSummary'){
			if (typeof req.body.member != 'undefined' && req.body.member != '' &&
			typeof req.body.date_from != 'undefined' && req.body.date_from != '' &&
			typeof req.body.date_to != 'undefined' && req.body.date_to != '' ) {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_rpt_HeadSales_Summary \''+req.body.member+'\', \''+req.body.date_from+'\', \''+req.body.date_to+'\', \''+req.body.isPay+'\'';
				data.util.queryMultiple(req, res, data);
			}
		} else if (data.action == 'name'){
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_ShopName \''+req.body.shop+'\'';
			data.util.query(req, res, data);
		} else if (data.action == 'nameBranch'){
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_ShopNameBranch \''+req.body.shop+'\'';
			data.util.query(req, res, data);
		} else if (data.action == 'accumulated'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_rpt_Shop_Accumulated \''+req.body.shop+'\', \''+req.body.year+'\'';
				data.util.queryMultiple(req, res, data);
			}
		} else if (data.action == 'receivable'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_rpt_Shop_Receivable \''+req.body.shop+'\'';
				data.util.queryMultiple(req, res, data);
			}
		} else if (data.action == 'aging'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ReportAging \''+req.body.shop+'\', \''+req.body.category+'\'';
				data.util.query(req, res, data);
			}
		} else if (data.action == 'run_rate'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ReportRunRate \''+req.body.shop+'\', \''+req.body.category+'\'';
				data.util.query(req, res, data);
			}
		} else if (data.action == 'summaryCustomerShop'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ReportSummaryCustomerShop \''+req.body.shop+'\', \''+req.body.year+'\'';
				data.util.query(req, res, data);
			}
		} else if (data.action == 'shopStock'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ReportShopStock \''+req.body.shop+'\', \''+req.body.brand+'\', \''+req.body.category+'\'';
				data.util.query(req, res, data);
			}
		} else if (data.action == 'shopReceived'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
					typeof req.body.date != 'undefined' && req.body.date != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ReportShopReceived \''+req.body.shop+'\', \''+req.body.date+'\'';
				data.util.queryMultiple(req, res, data);
			}
		} else if (data.action == 'monthlySaleByCategory'){
			if (data.subAction[0] == 'shop'){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ReportMonthlyShopSaleByCategory \''+req.body.shop+'\', \''+req.body.month+'\'';
				data.util.queryMultiple(req, res, data);
			} else {
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ReportMonthlySaleByCategory \''+req.body.shop+'\', \''+req.body.month+'\', \''+req.body.brand+'\'';
				data.util.queryMultiple(req, res, data);
			}
		} else if (data.action == 'centerAccumulated'){
			if (typeof req.body.year != 'undefined' && req.body.year != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_rpt_Center_Accumulated \''+req.body.year+'\'';
				data.util.queryMultiple(req, res, data);
			}
		} else if (data.action == 'DataYearInSell'){
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_DataYearInSell';
			data.util.query(req, res, data);
		} else if (data.action == 'shopid'){
			if (typeof req.body.memberKey != 'undefined' && req.body.memberKey != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ShopIdByMemberKey \''+req.body.memberKey+'\'';
				data.util.query(req, res, data);
			}
		} else if (data.action == 'newsInser'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != ''&&
			typeof req.body.message != 'undefined' && req.body.message != '' &&
				typeof req.body.memberKey != 'undefined' && req.body.memberKey != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_NewsInsert \''+req.body.shop+'\',\''+req.body.message+'\'\''+req.body.memberKey+'\'';
				data.util.query(req, res, data);
			}
		} else if (data.action == 'newsUpdate'){
			if (typeof req.body.id != 'undefined' && req.body.id != ''&&
				typeof req.body.shop != 'undefined' && req.body.shop != ''&&
				typeof req.body.message != 'undefined' && req.body.message != '' &&
				typeof req.body.memberKey != 'undefined' && req.body.memberKey != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_NewsUpdate \''+req.body.id+'\',\''+req.body.shop+'\',\''+req.body.message+'\',\''+req.body.memberKey+'\'';
				data.util.query(req, res, data);
			}
		} else if (data.action == 'newsInfo'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_NewsInfo \''+req.body.shop+'\'';
				data.util.query(req, res, data);
			}
		} else if (data.action == 'detail'){			
			data.json.return = false;
			data.json.returnResult = true;
			data.command = 'EXEC sp_ShopDetail \''+req.body.shop+'\'';
			data.util.query(req, res, data);
			
		} else if (data.action == 'detailUpdate'){
			if (typeof req.body.memberKey != 'undefined' && req.body.memberKey != '' &&
			typeof req.body.shop != 'undefined' && req.body.shop != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ShopDetailUpdate \''+req.body.memberKey+'\',\''+req.body.shop+'\',\''+req.body.detail+'\',\''+req.body.address+'\',\''+req.body.address2+'\',\''+req.body.subDistrict+'\',\''+req.body.district+'\',\''+req.body.province+'\',\''+req.body.zipcode+'\',\''+req.body.mobile+'\',\''+req.body.image+'\',\''+req.body.line+'\',\''+req.body.facebook+'\',\''+req.body.iframeGoogleMaps+'\'';
				data.util.execute(req, res, data);
			}
		} else if (data.action == 'shopAging'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ShopAgingDaily \''+req.body.shop+'\',\''+req.body.month+'\'';
				data.util.query(req, res, data);
			}
		} else if (data.action == 'microShop'){
			if (data.subAction[0] == 'name'){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_MicroShopName \''+req.body.shop+'\'';
				data.util.query(req, res, data);
			} else if (data.subAction[0] == 'shopid'){
				if(typeof req.body.memberKey != 'undefined' && req.body.memberKey != ''){
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_MicroShopIdByMemberKey \''+req.body.memberKey+'\'';
					data.util.query(req, res, data);
				}
			} else if (data.subAction[0] == 'salesSummarry'){
				if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
				typeof req.body.date_from != 'undefined' && req.body.date_from != '' &&
				typeof req.body.date_to != 'undefined' && req.body.date_to != '' ){
					data.json.return = false;
					data.json.returnResult = true;
					data.command = 'EXEC sp_MicroShopReportSaleSummarry \''+req.body.shop+'\',\''+req.body.date_from+'\',\''+req.body.date_to+'\'';
					data.util.query(req, res, data);
				}
			}
		}
		else if (data.action == 'changePriceDaily'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
			typeof req.body.date != 'undefined' && req.body.date != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_rpt_Shop_ChangePriceDaily \''+req.body.shop+'\',\''+req.body.date+'\'';
				data.util.query(req, res, data);
			}
		}
		else if (data.action == 'returnProduct'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
			typeof req.body.dateF != 'undefined' && req.body.dateF != '' &&
			typeof req.body.dateT != 'undefined' && req.body.dateT != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ReturnReport \''+req.body.shop+'\',\''+req.body.dateF+'\',\''+req.body.dateT+'\'';
				data.util.query(req, res, data);
			}
		}
		else if (data.action == 'SellSummary'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
			typeof req.body.date != 'undefined' && req.body.date != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ShopSellSummaryByDate \''+req.body.shop+'\',\''+req.body.date+'\'';
				data.util.query(req, res, data);
			}
		}
		else if (data.action == 'SellDetail'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != '' &&
			typeof req.body.sellNo != 'undefined' && req.body.sellNo != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ShopSellDetailByBill \''+req.body.shop+'\',\''+req.body.sellNo+'\'';
				data.util.query(req, res, data);
			}
		}
		else if (data.action == 'shopSummary'){
			if (typeof req.body.shop != 'undefined' && req.body.shop != ''){
				data.json.return = false;
				data.json.returnResult = true;
				data.command = 'EXEC sp_ShopSummary \''+req.body.shop+'\'';
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
