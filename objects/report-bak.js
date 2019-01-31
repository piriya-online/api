var sql = require('mssql');
var config = require('../config.js');
var shopName = '';
exports.action = function(req, res, report, branch, brand) {

	try {

		if (report == 'aging' || report == 'run_rate') {

			var connection = new sql.Connection(config.mssql, function (err) {
				var request = new sql.Request(connection);
				//var branch = 1;
				//var report = 'aging';

				request.query('EXEC sp_ShopName \''+branch+'\'', function (err, recordset, returnValue) {
					if (!err){shopName = recordset[0].name}
					else{res.send(err.message)}
				});
				var PDFDocument = require('pdfkit');
				var moment = require('moment');
				var doc = new PDFDocument({margin: 10, size: 'A4'});

				var d = new Date();
				var m = moment(d);
				m.lang('th');
				m.utcOffset(0);
				//m.add(3600*7, 'seconds'); // GMT +7

				doc.moveTo(0, 0)
					.font('./fonts/ANGSAU.TTF', 16)
					.text(m.format('DD MMMM')+' '+(parseInt(m.format('YYYY'))+543)+' '+m.format('HH:mm'), { align: 'right' })

				//### STOCK AGING REPORT ###//
				if (report == 'aging') {
					request.query('EXEC sp_ReportAging \''+branch+'\', \''+''+'\'', function (err, recordset, returnValue) {
						if (!err){

							doc.font('./fonts/THSarabunBold.ttf', 18)
								.text('Stock Aging Report : '+shopName, 10, 10)


							doc.lineWidth(0.75)
								.moveTo(10, 30)
								.lineTo(585, 30)
								.stroke()

							var posX = [10, 315, 345, 375, 410, 445, 480, 515, 550, 585];
							var groupName = 'xxx';
							var y = 20;
							var startY = y;
							var index = 1;
							var sum90 = sum60 = sum30 = sum15 = sum0 = sum99 = 0;
							for (i=0; i<recordset.length; i++, index++) {
								y += 14;
								if ( y > 800 ) {

									doc.addPage();
									y = 10;
									startY = y;

									if (i+1 < recordset.length) {
										if ( groupName == recordset[i+1]['groupName'] ) {
											drawHeadLine(doc, groupName, posX, y, 35);
											y += 18;
											startY = y;
										}
									}


								}
								if ( groupName != recordset[i]['groupName'] ) {
									y += 5;

									groupName = recordset[i]['groupName'];
									drawHeadLine(doc, groupName, posX, y, 35);
									y += 18;
									startY = y;

								}

								doc.y = y; doc.x = posX[0]+2;
								doc.font('./fonts/THSarabun.ttf', 12)
									.text(index+'.', { width: 20, align: 'right' })
								doc.y = y; doc.x = posX[0]+25;
								doc.text(recordset[i]['sku'], { width: 40, align: 'left' })
								doc.y = y; doc.x = posX[0]+70;
								doc.text(recordset[i]['productName'], { width: 300, align: 'left' })
								doc.y = y; doc.x = posX[3];
								doc.text((recordset[i]['cost'] > 0) ? numberWithCommas(recordset[i]['cost'].toFixed(0)) : '-', { width: 35, align: 'right' })
								//doc.text(recordset[i]['cost'].toFixed(0), { width: 35, align: 'right' })
								//doc.y = y; doc.x = posX[2];
								//doc.text((recordset[i]['costPlan'] > 0) ? numberWithCommas(recordset[i]['costPlan'].toFixed(0)) : '-', { width: 35, align: 'right' })
								//doc.text(recordset[i]['costPlan'].toFixed(0), { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[4];
								doc.text((recordset[i]['90'] > 0) ? numberWithCommas(recordset[i]['90'].toFixed(0)) : '-', { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[5];
								doc.text((recordset[i]['60'] > 0) ? numberWithCommas(recordset[i]['60'].toFixed(0)) : '-', { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[6];
								doc.text((recordset[i]['30'] > 0) ? numberWithCommas(recordset[i]['30'].toFixed(0)) : '-', { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[7];
								doc.text((recordset[i]['15'] > 0) ? numberWithCommas(recordset[i]['15'].toFixed(0)) : '-', { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[8];
								doc.text((recordset[i]['0'] > 0) ? numberWithCommas(recordset[i]['0'].toFixed(0)) : '-', { width: 35, align: 'right' })
								//doc.y = y; doc.x = posX[8];
								//doc.text((recordset[i]['qtyPlan'] > 0) ? numberWithCommas(recordset[i]['qtyPlan'].toFixed(0)) : '-', { width: 35, align: 'right' })

								doc.lineWidth(0.25)
									.moveTo(posX[0], y+15)
									.lineTo(posX[9], y+15)
									.dash(1, {space: 1})
									.stroke()

								sum90 += recordset[i]['cost']*recordset[i]['90'];
								sum60 += recordset[i]['cost']*recordset[i]['60'];
								sum30 += recordset[i]['cost']*recordset[i]['30'];
								sum15 += recordset[i]['cost']*recordset[i]['15'];
								sum0 += recordset[i]['cost']*recordset[i]['0'];
								//sum99 += (recordset[i]['qtyPlan'] != 0 && recordset[i]['costPlan'] != 0) ? recordset[i]['costPlan']*recordset[i]['qtyPlan'] : 0;

								if ( recordset[i+1] == null || groupName != recordset[i+1]['groupName'] ) {
									if (sum90 != 0 || sum60 != 0 || sum30 != 0 || sum15 != 0 || sum0 != 0 || sum99 != 0) {
										y += 16;
										doc.font('./fonts/THSarabunBold.ttf', 10)
										doc.y = y; doc.x = posX[3];
										doc.text('มูลค่า', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[4];
										doc.text((sum90 > 0) ? numberWithCommas(sum90.toFixed(0)) : '-', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[5];
										doc.text((sum60 > 0) ? numberWithCommas(sum60.toFixed(0)) : '-', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[6];
										doc.text((sum30 > 0) ? numberWithCommas(sum30.toFixed(0)) : '-', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[7];
										doc.text((sum15 > 0) ? numberWithCommas(sum15.toFixed(0)) : '-', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[8];
										doc.text((sum0 > 0) ? numberWithCommas(sum0.toFixed(0)) : '-', { width: 35, align: 'right' })
										//doc.y = y; doc.x = posX[8];
										//doc.text((sum99 > 0) ? numberWithCommas(sum99.toFixed(0)) : '-', { width: 35, align: 'right' })

										doc.lineWidth(0.5)
											.moveTo(posX[3], y+13)
											.lineTo(posX[9], y+13)
											.dash(1, {space: 0})
											.stroke()

										sum90 = sum60 = sum30 = sum15 = sum0  = 0;
										y += 3;
									}
								}

							}

							doc.pipe(res);
							doc.end();

						}else{
						   res.send(err.message);
						}
					});
				}

				//### RUN RATE REPORT ###//
				else if (report == 'run_rate')
				{
					request.query('EXEC sp_ReportRunRate \''+branch+'\', \''+''+'\'', function (err, recordset, returnValue) {
						if (!err){
							var posX = [10, 315, 345, 375, 405, 435, 465, 495, 525, 555, 585];

							doc.font('./fonts/THSarabunBold.ttf', 18)
								.text('Stock Run Rate Report : '+shopName, 10, 10)

							doc.lineWidth(0.75)
								.moveTo(posX[0], 30)
								.lineTo(posX[9], 30)
								.stroke()

							var groupName = 'xxx';
							var y = 20;
							var startY = y;
							var index = 1;
							var sum = 0;
							for (i=0; i<recordset.length; i++, index++) {
								y += 14;
								if ( y > 800 ) {

									doc.addPage();
									y = 10;
									startY = y;

									if (i+1 < recordset.length) {
										if ( groupName == recordset[i+1]['groupName'] ) {
											drawHeadLineRunRate(doc, groupName, posX, y, 30);
											y += 18;
											startY = y;
										}
									}


								}
								if ( groupName != recordset[i]['groupName'] ) {
									y += 5;

									groupName = recordset[i]['groupName'];
									drawHeadLineRunRate(doc, groupName, posX, y, 30);
									y += 18;
									startY = y;

								}

								doc.y = y; doc.x = posX[0]+2;
								doc.font('./fonts/THSarabun.ttf', 12)
									.text(index+'.', { width: 20, align: 'right' })
								doc.y = y; doc.x = posX[0]+25;
								doc.text(recordset[i]['sku'], { width: 40, align: 'left' })
								doc.y = y; doc.x = posX[0]+70;
								doc.text(recordset[i]['name'], { width: 300, align: 'left' })
								doc.y = y; doc.x = posX[1];
								doc.text((recordset[i]['cost'] > 0) ? numberWithCommas(recordset[i]['cost'].toFixed(2)) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[2];
								doc.text((recordset[i]['stock'] > 0) ? numberWithCommas(recordset[i]['stock']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[3];
								doc.text((recordset[i]['d0'] > 0) ? numberWithCommas(recordset[i]['d0']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[4];
								doc.text((recordset[i]['d1'] > 0) ? numberWithCommas(recordset[i]['d1']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[5];
								doc.text((recordset[i]['d2'] > 0) ? numberWithCommas(recordset[i]['d2']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[6];
								doc.text((recordset[i]['d3'] > 0) ? numberWithCommas(recordset[i]['d3']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[7];
								doc.text((recordset[i]['d4'] > 0) ? numberWithCommas(recordset[i]['d4']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[8];
								doc.text((recordset[i]['d5'] > 0) ? numberWithCommas(recordset[i]['d5']) : '-', { width: 30, align: 'right' })

								doc.lineWidth(0.25)
									.moveTo(posX[0], y+15)
									.lineTo(posX[9], y+15)
									.dash(1, {space: 1})
									.stroke()

								sum += recordset[i]['stock'] > 0 ? recordset[i]['stock']*recordset[i]['cost'] : 0;

								if ( recordset[i+1] == null || groupName != recordset[i+1]['groupName'] ) {
									if (sum != 0) {
										y += 16;
										doc.font('./fonts/THSarabunBold.ttf', 12)
										doc.y = y; doc.x = posX[1] - 20;
										doc.text('มูลค่า', { width: 30, align: 'left' })
										doc.y = y; doc.x = posX[1];
										doc.text((sum > 0) ? numberWithCommas(sum.toFixed(0)) : '-', { width: 60, align: 'right' })

										doc.lineWidth(0.5)
											.moveTo(posX[1] - 25, y+15)
											.lineTo(posX[9], y+15)
											.dash(1, {space: 0})
											.stroke()

										sum = 0;
										y += 3;
									}
								}

							}

							doc.pipe(res);
							doc.end();

						}else{
						   res.send(err.message);
						}
					});
				}

			 });

		} else if (report == 'aging-brand' || report == 'run_rate-brand') {
			var connection = new sql.Connection(config.mssql, function (err) {
				var request = new sql.Request(connection);
				//var branch = 1;
				//var report = 'aging';
				if(brand == null || typeof brand == undefined){
					brand = '';
				}
				var PDFDocument = require('pdfkit');
				var moment = require('moment');
				var doc = new PDFDocument({margin: 10, size: 'A4'});

				var d = new Date();
				var m = moment(d);
				m.lang('th');
				m.utcOffset(+7);
				//m.add(3600*7, 'seconds'); // GMT +7

				doc.moveTo(0, 0)
					.font('./fonts/ANGSAU.TTF', 16)
					.text(m.format('DD MMMM')+' '+(parseInt(m.format('YYYY'))+543)+' '+m.format('HH:mm'), { align: 'right' })

				//### STOCK AGING REPORT ###//
				if (report == 'aging-brand') {
					request.query('EXEC sp_ReportAgingByBrand \''+branch+'\',\''+brand+'\'', function (err, recordset, returnValue) {
						if (!err){

							doc.font('./fonts/CALIBRIB.TTF', 18)
								.text('Stock Aging Report : Branch '+branch, 10, 10)

							//console.log(recordset[0]['groupName']);
							doc.lineWidth(0.75)
								.moveTo(10, 30)
								.lineTo(585, 30)
								.stroke()

							var posX = [10, 285, 315, 345, 375, 410, 445, 480, 515, 550, 585];
							var groupName = 'xxx';
							var y = 20;
							var startY = y;
							var index = 1;
							var sum90 = sum60 = sum30 = sum15 = sum0 = sum99 = sumBooking = 0;
							for (i=0; i<recordset.length; i++, index++) {
								y += 14;
								if ( y > 800 ) {

									doc.addPage();
									y = 10;
									startY = y;

									if (i+1 < recordset.length) {
										if ( groupName == recordset[i+1]['groupName'] ) {
											drawHeadLineBrand(doc, groupName, posX, y, 35);
											y += 18;
											startY = y;
										}
									}


								}
								if ( groupName != recordset[i]['groupName'] ) {
									y += 5;

									groupName = recordset[i]['groupName'];
									drawHeadLineBrand(doc, groupName, posX, y, 35);
									y += 18;
									startY = y;

								}

								doc.y = y; doc.x = posX[0]+2;
								doc.font('./fonts/THSarabun.ttf', 12)
									.text(index+'.', { width: 20, align: 'right' })
								doc.y = y; doc.x = posX[0]+25;
								doc.text(recordset[i]['sku'], { width: 40, align: 'left' })
								doc.y = y; doc.x = posX[0]+70;
								doc.text(recordset[i]['productName'], { width: 300, align: 'left' })
								doc.y = y; doc.x = posX[1];
								doc.text((recordset[i]['cost'] > 0) ? numberWithCommas(recordset[i]['cost'].toFixed(0)) : '-', { width: 35, align: 'right' })
								//doc.text(recordset[i]['cost'].toFixed(0), { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[2];
								doc.text((recordset[i]['costPlan'] > 0) ? numberWithCommas(recordset[i]['costPlan'].toFixed(0)) : '-', { width: 35, align: 'right' })
								//doc.text(recordset[i]['costPlan'].toFixed(0), { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[3];
								doc.text((recordset[i]['90'] > 0) ? numberWithCommas(recordset[i]['90'].toFixed(0)) : '-', { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[4];
								doc.text((recordset[i]['60'] > 0) ? numberWithCommas(recordset[i]['60'].toFixed(0)) : '-', { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[5];
								doc.text((recordset[i]['30'] > 0) ? numberWithCommas(recordset[i]['30'].toFixed(0)) : '-', { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[6];
								doc.text((recordset[i]['15'] > 0) ? numberWithCommas(recordset[i]['15'].toFixed(0)) : '-', { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[7];
								doc.text((recordset[i]['0'] > 0) ? numberWithCommas(recordset[i]['0'].toFixed(0)) : '-', { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[8];
								doc.text((recordset[i]['qtyPlan'] > 0) ? numberWithCommas(recordset[i]['qtyPlan'].toFixed(0)) : '-', { width: 35, align: 'right' })
								doc.y = y; doc.x = posX[9];
								doc.text((recordset[i]['booking'] > 0) ? numberWithCommas(recordset[i]['booking'].toFixed(0)) : '-', { width: 35, align: 'right' })

								doc.lineWidth(0.25)
									.moveTo(posX[0], y+15)
									.lineTo(posX[10], y+15)
									.dash(1, {space: 1})
									.stroke()

								sum90 += recordset[i]['cost']*recordset[i]['90'];
								sum60 += recordset[i]['cost']*recordset[i]['60'];
								sum30 += recordset[i]['cost']*recordset[i]['30'];
								sum15 += recordset[i]['cost']*recordset[i]['15'];
								sum0 += recordset[i]['cost']*recordset[i]['0'];
								sum99 += (recordset[i]['qtyPlan'] != 0 && recordset[i]['costPlan'] != 0) ? recordset[i]['costPlan']*recordset[i]['qtyPlan'] : 0;
								sumBooking += recordset[i]['cost']*recordset[i]['booking'];

								if ( recordset[i+1] == null || groupName != recordset[i+1]['groupName'] ) {
									if (sum90 != 0 || sum60 != 0 || sum30 != 0 || sum15 != 0 || sum0 != 0 || sum99 != 0 || sumBooking != 0) {
										y += 16;
										doc.font('./fonts/THSarabunBold.ttf', 10)
										doc.y = y; doc.x = posX[1];
										doc.text('มูลค่า', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[3];
										doc.text((sum90 > 0) ? numberWithCommas(sum90.toFixed(0)) : '-', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[4];
										doc.text((sum60 > 0) ? numberWithCommas(sum60.toFixed(0)) : '-', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[5];
										doc.text((sum30 > 0) ? numberWithCommas(sum30.toFixed(0)) : '-', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[6];
										doc.text((sum15 > 0) ? numberWithCommas(sum15.toFixed(0)) : '-', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[7];
										doc.text((sum0 > 0) ? numberWithCommas(sum0.toFixed(0)) : '-', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[8];
										doc.text((sum99 > 0) ? numberWithCommas(sum99.toFixed(0)) : '-', { width: 35, align: 'right' })
										doc.y = y; doc.x = posX[9];
										doc.text((sumBooking > 0) ? numberWithCommas(sumBooking.toFixed(0)) : '-', { width: 35, align: 'right' })

										doc.lineWidth(0.5)
											.moveTo(posX[1], y+13)
											.lineTo(posX[10], y+13)
											.dash(1, {space: 0})
											.stroke()

										sum90 = sum60 = sum30 = sum15 = sum0 = sum99 = sumBooking = 0;
										y += 3;
									}
								}

							}

							doc.pipe(res);
							doc.end();

						}else{
							 res.send(err.message);
						}
					});
				}

				//### RUN RATE REPORT ###//
				else if (report == 'run_rate-brand')
				{
					request.query('EXEC sp_ReportRunRateByBrand \''+branch+'\',\''+brand+'\'', function (err, recordset, returnValue) {
						if (!err){
							var posX = [10, 285, 315, 345, 375, 405, 435, 465, 495, 525, 555, 585];

							doc.font('./fonts/CALIBRIB.TTF', 18)
								.text('Stock Run Rate Report : Branch '+branch, 10, 10)

							doc.lineWidth(0.75)
								.moveTo(posX[0], 30)
								.lineTo(posX[11], 30)
								.stroke()

							var groupName = 'xxx';
							var y = 20;
							var startY = y;
							var index = 1;
							var sum = 0;
							for (i=0; i<recordset.length; i++, index++) {
								y += 14;
								if ( y > 800 ) {

									doc.addPage();
									y = 10;
									startY = y;

									if (i+1 < recordset.length) {
										if ( groupName == recordset[i+1]['groupName'] ) {
											drawHeadLineRunRateBrand(doc, groupName, posX, y, 30);
											y += 18;
											startY = y;
										}
									}


								}
								if ( groupName != recordset[i]['groupName'] ) {
									y += 5;

									groupName = recordset[i]['groupName'];
									drawHeadLineRunRateBrand(doc, groupName, posX, y, 30);
									y += 18;
									startY = y;

								}

								doc.y = y; doc.x = posX[0]+2;
								doc.font('./fonts/THSarabun.ttf', 12)
									.text(index+'.', { width: 20, align: 'right' })
								doc.y = y; doc.x = posX[0]+25;
								doc.text(recordset[i]['sku'], { width: 40, align: 'left' })
								doc.y = y; doc.x = posX[0]+70;
								doc.text(recordset[i]['name'] + ((recordset[i]['percentClaim'] != 0) ? ' ('+recordset[i]['percentClaim']+'%)' : ''), { width: 300, align: 'left' })
								doc.y = y; doc.x = posX[1];
								doc.text((recordset[i]['cost'] > 0) ? numberWithCommas(recordset[i]['cost'].toFixed(2)) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[2];
								doc.text((recordset[i]['stock'] > 0) ? numberWithCommas(recordset[i]['stock']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[3];
								doc.text((recordset[i]['d0'] > 0) ? numberWithCommas(recordset[i]['d0']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[4];
								doc.text((recordset[i]['d1'] > 0) ? numberWithCommas(recordset[i]['d1']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[5];
								doc.text((recordset[i]['d2'] > 0) ? numberWithCommas(recordset[i]['d2']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[6];
								doc.text((recordset[i]['d3'] > 0) ? numberWithCommas(recordset[i]['d3']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[7];
								doc.text((recordset[i]['d4'] > 0) ? numberWithCommas(recordset[i]['d4']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[8];
								doc.text((recordset[i]['d5'] > 0) ? numberWithCommas(recordset[i]['d5']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[9];
								doc.text((recordset[i]['qtyPlan'] > 0) ? numberWithCommas(recordset[i]['qtyPlan']) : '-', { width: 30, align: 'right' })
								doc.y = y; doc.x = posX[10];
								doc.text((recordset[i]['booking'] > 0) ? numberWithCommas(recordset[i]['booking']) : '-', { width: 30, align: 'right' })

								doc.lineWidth(0.25)
									.moveTo(posX[0], y+15)
									.lineTo(posX[11], y+15)
									.dash(1, {space: 1})
									.stroke()

								sum += recordset[i]['stock'] > 0 ? recordset[i]['stock']*recordset[i]['cost'] : 0;

								if ( recordset[i+1] == null || groupName != recordset[i+1]['groupName'] ) {
									if (sum != 0) {
										y += 16;
										doc.font('./fonts/THSarabunBold.ttf', 12)
										doc.y = y; doc.x = posX[1] - 20;
										doc.text('มูลค่า', { width: 30, align: 'left' })
										doc.y = y; doc.x = posX[1];
										doc.text((sum > 0) ? numberWithCommas(sum.toFixed(0)) : '-', { width: 60, align: 'right' })

										doc.lineWidth(0.5)
											.moveTo(posX[1] - 25, y+15)
											.lineTo(posX[11], y+15)
											.dash(1, {space: 0})
											.stroke()

										sum = 0;
										y += 3;
									}
								}

							}

							doc.pipe(res);
							doc.end();

						}else{
							 res.send(err.message);
						}
					});
				}

			 });
		}

	}
	catch(err) {
		data.err = err;
		res.json(data);
	}

};

exports.generate = function(req, res, report, vat, orderNo) {

	try {

		if (report == 'neoinvoice') {

			var connection = new sql.Connection(config.mssql, function (err) {
				var request = new sql.Request(connection);
				request.multiple = true;

				var PDFDocument = require('pdfkit');
				var moment = require('moment');
				var doc = new PDFDocument({margin: 10, size: 'A4'});

				//### ORDER FOR REPORT ###//
				request.query('EXEC sp_DataOrderDetailInvoice \''+orderNo+'\',\''+vat+'\'', function (err, recordset, returnValue) {
					if (!err){		
						if(vat == 0){ //non-vat
							doc.image('./public/images/report/'+report+((recordset[1].length > 42) ? '0' : '')+'.png', 0, 0, {width:600});
							rq = require('request'); 
															
							rq({
								url: 'https://24fin-api.azurewebsites.net/barcode/'+orderNo,
								encoding: null
							}, function(err, response, body) { 
								if (err) throw err;

								doc.image(body, 436, 107, {width:140});

								rq({
									url: 'https://24fin-api.azurewebsites.net/barcode/'+recordset[0][0]['member'],
									encoding: null
								}, function(err, response, body) {
									if (err) throw err;

									doc.image(body, 25, 47, {width:110});


									var d = new Date(recordset[0][0]['addDate']);
									var m = moment(d);
									m.lang('th');
									m.utcOffset(0);
									//m.add(3600*7, 'seconds'); // GMT +7

									doc.y = 57;
									doc.x = 433;
									doc.font('./fonts/THSarabunBold.ttf', 16)
										.text('วันที่ ' + m.format('DD MMMM')+' '+(parseInt(m.format('YYYY'))+543)+' '+m.format('HH:mm'))

									doc.y = 88.7; doc.x = 513;		doc.font('./fonts/CALIBRIB.TTF', 12).text(orderNo);
									doc.y = 29; doc.x = 67;				doc.font('./fonts/CALIBRI.TTF', 12).text(recordset[0][0]['member']);


									doc.y = 24; doc.x = 150;			doc.font('./fonts/THSarabunBold.ttf', 16).text(recordset[0][0]['name']+((recordset[0][0]['contactName'] != '') ? ' ('+recordset[0][0]['contactName']+')' : ''))

									doc.y = 44; doc.x = 150;			doc.font('./fonts/THSarabunBold.ttf', 18).text(recordset[0][0]['shopName']);

									doc.y = 70; doc.x = 67;				doc.font('./fonts/THSarabun.ttf', 14).text(recordset[0][0]['address']+' '+recordset[0][0]['address2']);
									var isBkk = recordset[0][0]['province'] == 'กรุงเทพมหานคร';
									doc.y = 90; doc.x = 67;				doc.text(((isBkk) ? 'แขวง' : 'ตำบล')+recordset[0][0]['subDistrict']+' '+((isBkk) ? 'เขต' : 'อำเภอ')+recordset[0][0]['district']+' '+((isBkk) ? '' : 'จังหวัด')+recordset[0][0]['province']+' รหัสไปรษณีย์ '+recordset[0][0]['zipcode']);
									doc.y = 110.5; doc.x = 67;		doc.text(recordset[0][0]['mobile'].substr(0,3)+'-'+recordset[0][0]['mobile'].substr(3,4)+'-'+recordset[0][0]['mobile'].substr(7,3));

									var y = 158;
									var page = 1;
									if(recordset[1].length == 47){
										var maxY = 700;
									}else{
										var maxY = 785;
									}															
									doc.font('./fonts/ANGSAU.TTF', 14);
									
									for (i=0; i<recordset[1].length; i++) {
										if ( page == 1){
											if ( y > maxY ) {
												doc.addPage();
												if(recordset[1].length > 116){ 
													doc.image('./public/images/report/'+report+'1.png', 0, 0, {width:600});
												}else{
													doc.image('./public/images/report/'+report+'2.png', 0, 0, {width:600});
												}
												
												y = 35;
												page++;
											}
										}
										else {
											if ( y > maxY ) {
												doc.addPage();
												doc.image('./public/images/report/'+report+(((recordset[1].length - i) > 63) ? '1' : '2')+'.png', 0, 0, {width:600});
												//doc.y = 10;	doc.x = 10;	doc.text('./public/images/report/'+report+(((recordset[1].length - i) > 63) ? '1' : '2')+'.png');
												y = 35;
												page++;
											}
										}		
										y += 12;
										doc.y = y;	doc.x = 25;		doc.text(recordset[1][i]['sku']);
										doc.y = y;	doc.x = 89;		doc.text(recordset[1][i]['name']);
										doc.y = y;	doc.x = 420;	doc.text(numberWithCommas(recordset[1][i]['price']), { width:35, align: 'right' });
										doc.y = y;	doc.x = 475;	doc.text(numberWithCommas(recordset[1][i]['qty']), { width:26, align: 'right' });
										doc.y = y;	doc.x = 525;	doc.text(numberWithCommas(recordset[1][i]['totalPrice']), { width:43, align: 'right' });
									}
									
									doc.font('./fonts/THSarabun.ttf', 14); 
										doc.y = 733.5;	doc.x = 90;	doc.text(numberWithCommas(recordset[0][0]['textPrice']), { width:250,align: 'center' });
									doc.font('./fonts/CALIBRIB.TTF', 10);
										doc.y = 735; doc.x = 523;	doc.text(numberWithCommas(recordset[0][0]['totalPrice'].toFixed(2)), { width:50, align: 'right' });
									doc.font('./fonts/CALIBRIB.TTF', 10);
										doc.y = 773; doc.x = 523;	doc.text((recordset[0][0]['vat'] == 0) ? '-' : numberWithCommas(recordset[0][0]['vat'].toFixed(2)), { width:50, align: 'right' });
									doc.font('./fonts/CALIBRIB.TTF', 10);
										doc.y = 810; doc.x = 523;	doc.text(numberWithCommas(recordset[0][0]['totalPriceAV'].toFixed(2)), { width:50, align: 'right' });

									doc.pipe(res);
									doc.end();
									return;
								});
							});
						}else{ //vat 
							doc.image('./public/images/report/'+report+((recordset[1].length > 42) ? '0' : '')+'_vat.png', 0, 0, {width:600});
							rq = require('request'); 
															
							rq({
								url: 'https://24fin-api.azurewebsites.net/barcode/'+orderNo,
								encoding: null
							}, function(err, response, body) { 
								if (err) throw err;

								doc.image(body, 436, 116, {width:140});
								doc.y = 5; doc.x = 16;		doc.font('./fonts/THSarabunBold.ttf', 32).text('บริษัท นีโอลูชั่น เทคโนโลยี คอร์ปอเรชั่น จำกัด');
								doc.y = 40; doc.x = 16;		doc.font('./fonts/THSarabunBold.ttf', 16).text('44 ซอยเอกชัย 63 ถนนเอกชัย แขวงบางบอน เขตบางบอน กรุงเทพมหานคร 10150');
								doc.y = 60; doc.x = 16;		doc.font('./fonts/THSarabunBold.ttf', 16).text('Tel: 028-9828-75, Fax: 028-9828-58');
								doc.y = 80; doc.x = 16;		doc.font('./fonts/THSarabunBold.ttf', 16).text('เลขประจำตัวผู้เสียภาษี 0105548046089');

								rq({
									url: 'https://24fin-api.azurewebsites.net/barcode/'+recordset[0][0]['member'],
									encoding: null
								}, function(err, response, body) {
									if (err) throw err;

									doc.image(body, 25, 47 + 82.5, {width:110});


									var d = new Date(recordset[0][0]['addDate']);
									var m = moment(d);
									m.lang('th');
									m.utcOffset(0);
									//m.add(3600*7, 'seconds'); // GMT +7

									doc.y = 75; 
									doc.x = 434;
									doc.font('./fonts/THSarabunBold.ttf', 16)
										.text('วันที่ ' + m.format('DD MMMM')+' '+(parseInt(m.format('YYYY'))+543)+' '+m.format('HH:mm'))
									
									var yPlus = 82.5;
									
									doc.y = 102.5; doc.x = 513;		doc.font('./fonts/CALIBRIB.TTF', 12).text(orderNo);
									doc.y = 29 + yPlus; doc.x = 67;				doc.font('./fonts/CALIBRI.TTF', 12).text(recordset[0][0]['member']);


									doc.y = 24 + yPlus; doc.x = 150;			doc.font('./fonts/THSarabunBold.ttf', 16).text(recordset[0][0]['name']+((recordset[0][0]['contactName'] != '') ? ' ('+recordset[0][0]['contactName']+')' : ''))

									doc.y = 44 + yPlus; doc.x = 150;			doc.font('./fonts/THSarabunBold.ttf', 18).text(recordset[0][0]['shopName']);

									doc.y = 70 + yPlus; doc.x = 67;				doc.font('./fonts/THSarabun.ttf', 14).text(recordset[0][0]['address']+' '+recordset[0][0]['address2']);
									var isBkk = recordset[0][0]['province'] == 'กรุงเทพมหานคร';
									doc.y = 90 + yPlus; doc.x = 67;				doc.text(((isBkk) ? 'แขวง' : 'ตำบล')+recordset[0][0]['subDistrict']+' '+((isBkk) ? 'เขต' : 'อำเภอ')+recordset[0][0]['district']+' '+((isBkk) ? '' : 'จังหวัด')+recordset[0][0]['province']+' รหัสไปรษณีย์ '+recordset[0][0]['zipcode']);
									doc.y = 110.5 + yPlus; doc.x = 67;		doc.text(recordset[0][0]['mobile'].substr(0,3)+'-'+recordset[0][0]['mobile'].substr(3,4)+'-'+recordset[0][0]['mobile'].substr(7,3));
									doc.y = 110.5 + yPlus; doc.x = 250;		doc.text(((recordset[0][0]['taxNo']) == '-') ? '' : 'เลขประจำตัวผู้เสียภาษี 0105548046089');

									var y = 158 + yPlus;
									var page = 1;

									if(recordset[1].length == 47){
										var maxY = 700 - yPlus;
									}else{
										var maxY = 785 - yPlus;
									}															
									doc.font('./fonts/ANGSAU.TTF', 14);
									
									for (i=0; i<recordset[1].length; i++) {
										if ( page == 1){
											if ( y > maxY ) {
												doc.addPage();
												if(recordset[1].length > 116){ 
													doc.image('./public/images/report/'+report+'1_vat.png', 0, 0, {width:600});
												}else{
													doc.image('./public/images/report/'+report+'2_vat.png', 0, 0, {width:600});
												}
												
												y = 35;
												page++;
											}
										}
										else {
											if ( y > maxY ) {
												doc.addPage();
												doc.image('./public/images/report/'+report+(((recordset[1].length - i) > 63) ? '1' : '2')+'_vat.png', 0, 0, {width:600});
												y = 35;
												page++;
											}
										}		
										y += 12;
										doc.y = y;	doc.x = 25;		doc.text(recordset[1][i]['sku']);
										doc.y = y;	doc.x = 89;		doc.text(recordset[1][i]['name']);
										doc.y = y;	doc.x = 420;	doc.text(numberWithCommas(recordset[1][i]['price']), { width:35, align: 'right' });
										doc.y = y;	doc.x = 475;	doc.text(numberWithCommas(recordset[1][i]['qty']), { width:26, align: 'right' });
										doc.y = y;	doc.x = 525;	doc.text(numberWithCommas(recordset[1][i]['totalPrice']), { width:43, align: 'right' });
									}
									
									doc.font('./fonts/THSarabun.ttf', 14); 
										doc.y = 733.5;	doc.x = 90;	doc.text(numberWithCommas(recordset[0][0]['textPrice']), { width:250,align: 'center' });
									doc.font('./fonts/CALIBRIB.TTF', 10);
										doc.y = 735; doc.x = 523;	doc.text(numberWithCommas(recordset[0][0]['totalPrice'].toFixed(2)), { width:50, align: 'right' });
									doc.font('./fonts/CALIBRIB.TTF', 10);
										doc.y = 773; doc.x = 523;	doc.text((recordset[0][0]['vat'] == 0) ? '-' : numberWithCommas(recordset[0][0]['vat'].toFixed(2)), { width:50, align: 'right' });
									doc.font('./fonts/CALIBRIB.TTF', 10);
										doc.y = 810; doc.x = 523;	doc.text(numberWithCommas(recordset[0][0]['totalPriceAV'].toFixed(2)), { width:50, align: 'right' });

									doc.pipe(res);
									doc.end();
									return;
								});
							});
						}								
					}else{
					   res.send(err.message);
					}
				});				
			});
		}
	}
	catch(err) {
		data.err = err;
		res.json(data);
	}

};

exports.shop = function(req, res, firstname, lastname) {
	firstname = decodeURI(firstname);
	lastname = decodeURI(lastname);
	try {

		var request = require('request');

		request.post({headers: { 'referer': 'https://api.remaxthailand.co.th' }, url: 'http://127.0.0.1:9991/register/shop/info',
			form: {
				apiKey: 'AA69632B-D906-4304-84C6-A039F5985D31',
				firstname: firstname,
				lastname: lastname,
				mobile: ''
			}
		},
		function (error, response, body) {
			if (!error) {
				var json = JSON.parse(body);
				json = json.result[0];


				var PDFDocument = require('pdfkit');
				var moment = require('moment');
				var doc = new PDFDocument({margin: 10, size: 'A4'});

				var x = 10;
				var y = 10;

				doc.font('./fonts/THSarabun.ttf', 32);
				//doc.y = y; doc.x = x; doc.text('ชื่อผู้สมัคร', {width: 130, align: 'right'} );
				doc.font('./fonts/THSarabunBold.ttf', 32);
				doc.y = y; doc.x = x+140; doc.text( 'คุณ' + json.firstname + '  ' + json.lastname + ' (' + json.nickname + ')' );
				y += 32;

				doc.font('./fonts/THSarabun.ttf', 18);
				doc.y = y; doc.x = x; doc.text('เบอร์โทรศัพท์', {width: 130, align: 'right'});
				doc.font('./fonts/THSarabunBold.ttf', 18);
				doc.y = y; doc.x = x+140; doc.text( json.mobile.substr(0,3)+'-'+json.mobile.substr(3,4)+'-'+json.mobile.substr(7) );
				y += 18;

				doc.font('./fonts/THSarabun.ttf', 18);
				doc.y = y; doc.x = x; doc.text('เวลาที่สะดวกในการติดต่อ', {width: 130, align: 'right'});
				doc.font('./fonts/THSarabunBold.ttf', 18);
				doc.y = y; doc.x = x+140; doc.text( json.time );
				y += 18;

				/*doc.font('./fonts/THSarabun.ttf', 18);
				doc.y = y; doc.x = x; doc.text('สนใจเป็นตัวแทนในจังหวัด', {width: 130, align: 'right'});
				doc.font('./fonts/THSarabunBold.ttf', 18);
				doc.y = y; doc.x = x+140; doc.text( json.Province );
				y += 18;*/

				doc.font('./fonts/THSarabun.ttf', 18);
				doc.y = y; doc.x = x; doc.text('ที่อยู่', {width: 130, align: 'right'});
				doc.font('./fonts/THSarabunBold.ttf', 18);
				doc.y = y; doc.x = x+140; doc.text( json.address );
				y += 38;

				/*doc.font('./fonts/THSarabunBold.ttf', 16);
				doc.y = y; doc.x = x; doc.text('แนะนำประวัติ หรือกิจการ หรือรูปแบบการจำหน่าย');
				doc.font('./fonts/THSarabun.ttf', 14);
				doc.text( '     ' + json.Profile );
				doc.moveDown();

				doc.font('./fonts/THSarabunBold.ttf', 16);
				doc.text('สาเหตุที่สนใจเป็นตัวแทนจำหน่าย');
				doc.font('./fonts/THSarabun.ttf', 14);
				doc.text( '     ' + json.Reason );
				doc.moveDown();

				doc.font('./fonts/THSarabunBold.ttf', 16);
				doc.text('ความคาดหวังเมื่อเป็นตัวแทนจำหน่าย');
				doc.font('./fonts/THSarabun.ttf', 14);
				doc.text( '     ' + json.Expect );
				doc.moveDown();

				doc.font('./fonts/THSarabunBold.ttf', 16);
				doc.text('ความคิดเห็น เกี่ยวกับการแข่งขันเพื่อความอยู่รอดในธุรกิจ');
				doc.font('./fonts/THSarabun.ttf', 14);
				doc.text( '     ' + json.Comment );*/
				doc.moveDown();

				doc.pipe(res); doc.end();
			} else{
				data.err = error;
				res.json(data);
			}
		});

	}
	catch(err) {
		data.err = err;
		res.json(data);
	}
}

function drawHeadLine(doc, groupName, posX, y, width){

	doc.y = y; doc.x = posX[0];
	doc.font('./fonts/THSarabunBold.ttf', 18)
		.text(groupName, { width: 300, align: 'left' });

	doc.y = y+3; doc.x = posX[3];
	doc.font('./fonts/THSarabunBold.ttf', 12)
		.text('ทุน', { width: width, align: 'right' })
	//doc.y = y+3; doc.x = posX[2];
	//doc.text('ทุนใหม่', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[4];
	doc.text('90', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[5];
	doc.text('60', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[6];
	doc.text('30', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[7];
	doc.text('15', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[8];
	doc.text('ปัจจุบัน', { width: width, align: 'right' })
	//doc.y = y+3; doc.x = posX[8];
	//doc.text('Plan', { width: width, align: 'right' })

	doc.lineWidth(0.75)
		.moveTo(posX[0], y+18)
		.lineTo(posX[9], y+18)
		.dash(1, {space: 0})
		.stroke()
}

function drawHeadLineRunRate(doc, groupName, posX, y, width){

	doc.y = y+4; doc.x = posX[0];
	doc.font('./fonts/CALIBRIB.TTF', 12)
		.text(groupName, { width: 300, align: 'left' });

	doc.y = y+3; doc.x = posX[1];
	doc.font('./fonts/THSarabunBold.ttf', 12)
		.text('ทุน', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[2];
	doc.text('Stock', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[3];
	doc.text('วันนี้', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[4];
	doc.text('-1', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[5];
	doc.text('-2', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[6];
	doc.text('-3', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[7];
	doc.text('-4', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[8];
	doc.text('-5', { width: width, align: 'right' })

	doc.lineWidth(0.75)
		.moveTo(posX[0], y+18)
		.lineTo(posX[9], y+18)
		.dash(1, {space: 0})
		.stroke()
}

function drawHeadLineBrand(doc, groupName, posX, y, width){

	doc.y = y; doc.x = posX[0];
	doc.font('./fonts/THSarabunBold.ttf', 18)
		.text(groupName, { width: 300, align: 'left' });

	doc.y = y+3; doc.x = posX[1];
	doc.font('./fonts/THSarabunBold.ttf', 12)
		.text('ทุน', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[2];
	doc.text('ทุนใหม่', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[3];
	doc.text('90', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[4];
	doc.text('60', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[5];
	doc.text('30', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[6];
	doc.text('15', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[7];
	doc.text('ปัจจุบัน', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[8];
	doc.text('Plan', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[9];
	doc.text('จอง', { width: width, align: 'right' })

	doc.lineWidth(0.75)
		.moveTo(posX[0], y+18)
		.lineTo(posX[10], y+18)
		.dash(1, {space: 0})
		.stroke()
}

function drawHeadLineRunRateBrand(doc, groupName, posX, y, width){

	doc.y = y+4; doc.x = posX[0];
	doc.font('./fonts/CALIBRIB.TTF', 12)
		.text(groupName, { width: 300, align: 'left' });

	doc.y = y+3; doc.x = posX[1];
	doc.font('./fonts/THSarabunBold.ttf', 12)
		.text('ทุน', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[2];
	doc.text('Stock', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[3];
	doc.text('วันนี้', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[4];
	doc.text('-1', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[5];
	doc.text('-2', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[6];
	doc.text('-3', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[7];
	doc.text('-4', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[8];
	doc.text('-5', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[9];
	doc.text('Plan', { width: width, align: 'right' })
	doc.y = y+3; doc.x = posX[10];
	doc.text('จอง', { width: width, align: 'right' })

	doc.lineWidth(0.75)
		.moveTo(posX[0], y+18)
		.lineTo(posX[11], y+18)
		.dash(1, {space: 0})
		.stroke()
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
