var sql = require('mssql');
var config = require('../config.js');
var shopName = '';
exports.action = function (req, res, report, branch, brand) {

	try {

		if (report == 'aging' || report == 'run_rate') {

			var connection = new sql.Connection(config.mssql, function (err) {
				var request = new sql.Request(connection);
				//var branch = 1;
				//var report = 'aging';

				request.query('EXEC sp_ShopName \'' + branch + '\'', function (err, recordset, returnValue) {
					if (!err) { shopName = recordset[0].name }
					else { res.send(err.message) }
				});
				var PDFDocument = require('pdfkit');
				var moment = require('moment');
				var doc = new PDFDocument({ margin: 10, size: 'A4' });

				var d = new Date();
				var m = moment(d);
				m.lang('th');
				m.utcOffset(0);
				//m.add(3600*7, 'seconds'); // GMT +7

				doc.moveTo(0, 0)
					.font('./fonts/ANGSAU.TTF', 16)
					.text(m.format('DD MMMM') + ' ' + (parseInt(m.format('YYYY')) + 543) + ' ' + m.format('HH:mm'), { align: 'right' })

				//### STOCK AGING REPORT ###//
				if (report == 'aging') {
					request.query('EXEC sp_ReportAging \'' + branch + '\', \'' + '' + '\'', function (err, recordset, returnValue) {
						if (!err) {

							doc.font('./fonts/THSarabunBold.ttf', 18)
								.text('Stock Aging Report : ' + shopName, 10, 10)


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
							for (i = 0; i < recordset.length; i++ , index++) {
								y += 14;
								if (y > 800) {

									doc.addPage();
									y = 10;
									startY = y;

									if (i + 1 < recordset.length) {
										if (groupName == recordset[i + 1]['groupName']) {
											drawHeadLine(doc, groupName, posX, y, 35);
											y += 18;
											startY = y;
										}
									}


								}
								if (groupName != recordset[i]['groupName']) {
									y += 5;

									groupName = recordset[i]['groupName'];
									drawHeadLine(doc, groupName, posX, y, 35);
									y += 18;
									startY = y;

								}

								doc.y = y; doc.x = posX[0] + 2;
								doc.font('./fonts/THSarabun.ttf', 12)
									.text(index + '.', { width: 20, align: 'right' })
								doc.y = y; doc.x = posX[0] + 25;
								doc.text(recordset[i]['sku'], { width: 40, align: 'left' })
								doc.y = y; doc.x = posX[0] + 70;
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
									.moveTo(posX[0], y + 15)
									.lineTo(posX[9], y + 15)
									.dash(1, { space: 1 })
									.stroke()

								sum90 += recordset[i]['cost'] * recordset[i]['90'];
								sum60 += recordset[i]['cost'] * recordset[i]['60'];
								sum30 += recordset[i]['cost'] * recordset[i]['30'];
								sum15 += recordset[i]['cost'] * recordset[i]['15'];
								sum0 += recordset[i]['cost'] * recordset[i]['0'];
								//sum99 += (recordset[i]['qtyPlan'] != 0 && recordset[i]['costPlan'] != 0) ? recordset[i]['costPlan']*recordset[i]['qtyPlan'] : 0;

								if (recordset[i + 1] == null || groupName != recordset[i + 1]['groupName']) {
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
											.moveTo(posX[3], y + 13)
											.lineTo(posX[9], y + 13)
											.dash(1, { space: 0 })
											.stroke()

										sum90 = sum60 = sum30 = sum15 = sum0 = 0;
										y += 3;
									}
								}

							}

							doc.pipe(res);
							doc.end();

						} else {
							res.send(err.message);
						}
					});
				}

				//### RUN RATE REPORT ###//
				else if (report == 'run_rate') {
					request.query('EXEC sp_ReportRunRate \'' + branch + '\', \'' + '' + '\'', function (err, recordset, returnValue) {
						if (!err) {
							var posX = [10, 315, 345, 375, 405, 435, 465, 495, 525, 555, 585];

							doc.font('./fonts/THSarabunBold.ttf', 18)
								.text('Stock Run Rate Report : ' + shopName, 10, 10)

							doc.lineWidth(0.75)
								.moveTo(posX[0], 30)
								.lineTo(posX[9], 30)
								.stroke()

							var groupName = 'xxx';
							var y = 20;
							var startY = y;
							var index = 1;
							var sum = 0;
							for (i = 0; i < recordset.length; i++ , index++) {
								y += 14;
								if (y > 800) {

									doc.addPage();
									y = 10;
									startY = y;

									if (i + 1 < recordset.length) {
										if (groupName == recordset[i + 1]['groupName']) {
											drawHeadLineRunRate(doc, groupName, posX, y, 30);
											y += 18;
											startY = y;
										}
									}


								}
								if (groupName != recordset[i]['groupName']) {
									y += 5;

									groupName = recordset[i]['groupName'];
									drawHeadLineRunRate(doc, groupName, posX, y, 30);
									y += 18;
									startY = y;

								}

								doc.y = y; doc.x = posX[0] + 2;
								doc.font('./fonts/THSarabun.ttf', 12)
									.text(index + '.', { width: 20, align: 'right' })
								doc.y = y; doc.x = posX[0] + 25;
								doc.text(recordset[i]['sku'], { width: 40, align: 'left' })
								doc.y = y; doc.x = posX[0] + 70;
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
									.moveTo(posX[0], y + 15)
									.lineTo(posX[9], y + 15)
									.dash(1, { space: 1 })
									.stroke()

								sum += recordset[i]['stock'] > 0 ? recordset[i]['stock'] * recordset[i]['cost'] : 0;

								if (recordset[i + 1] == null || groupName != recordset[i + 1]['groupName']) {
									if (sum != 0) {
										y += 16;
										doc.font('./fonts/THSarabunBold.ttf', 12)
										doc.y = y; doc.x = posX[1] - 20;
										doc.text('มูลค่า', { width: 30, align: 'left' })
										doc.y = y; doc.x = posX[1];
										doc.text((sum > 0) ? numberWithCommas(sum.toFixed(0)) : '-', { width: 60, align: 'right' })

										doc.lineWidth(0.5)
											.moveTo(posX[1] - 25, y + 15)
											.lineTo(posX[9], y + 15)
											.dash(1, { space: 0 })
											.stroke()

										sum = 0;
										y += 3;
									}
								}

							}

							doc.pipe(res);
							doc.end();

						} else {
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
				if (brand == null || typeof brand == undefined) {
					brand = '';
				}
				var PDFDocument = require('pdfkit');
				var moment = require('moment');
				var doc = new PDFDocument({ margin: 10, size: 'A4' });

				var d = new Date();
				var m = moment(d);
				m.lang('th');
				m.utcOffset(+7);
				//m.add(3600*7, 'seconds'); // GMT +7

				doc.moveTo(0, 0)
					.font('./fonts/ANGSAU.TTF', 16)
					.text(m.format('DD MMMM') + ' ' + (parseInt(m.format('YYYY')) + 543) + ' ' + m.format('HH:mm'), { align: 'right' })

				//### STOCK AGING REPORT ###//
				if (report == 'aging-brand') {
					request.query('EXEC sp_ReportAgingByBrand \'' + branch + '\',\'' + brand + '\'', function (err, recordset, returnValue) {
						if (!err) {

							doc.font('./fonts/CALIBRIB.TTF', 18)
								.text('Stock Aging Report : Branch ' + branch, 10, 10)

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
							for (i = 0; i < recordset.length; i++ , index++) {
								y += 14;
								if (y > 800) {

									doc.addPage();
									y = 10;
									startY = y;

									if (i + 1 < recordset.length) {
										if (groupName == recordset[i + 1]['groupName']) {
											drawHeadLineBrand(doc, groupName, posX, y, 35);
											y += 18;
											startY = y;
										}
									}


								}
								if (groupName != recordset[i]['groupName']) {
									y += 5;

									groupName = recordset[i]['groupName'];
									drawHeadLineBrand(doc, groupName, posX, y, 35);
									y += 18;
									startY = y;

								}

								doc.y = y; doc.x = posX[0] + 2;
								doc.font('./fonts/THSarabun.ttf', 12)
									.text(index + '.', { width: 20, align: 'right' })
								doc.y = y; doc.x = posX[0] + 25;
								doc.text(recordset[i]['sku'], { width: 40, align: 'left' })
								doc.y = y; doc.x = posX[0] + 70;
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
									.moveTo(posX[0], y + 15)
									.lineTo(posX[10], y + 15)
									.dash(1, { space: 1 })
									.stroke()

								sum90 += recordset[i]['cost'] * recordset[i]['90'];
								sum60 += recordset[i]['cost'] * recordset[i]['60'];
								sum30 += recordset[i]['cost'] * recordset[i]['30'];
								sum15 += recordset[i]['cost'] * recordset[i]['15'];
								sum0 += recordset[i]['cost'] * recordset[i]['0'];
								sum99 += (recordset[i]['qtyPlan'] != 0 && recordset[i]['costPlan'] != 0) ? recordset[i]['costPlan'] * recordset[i]['qtyPlan'] : 0;
								sumBooking += recordset[i]['cost'] * recordset[i]['booking'];

								if (recordset[i + 1] == null || groupName != recordset[i + 1]['groupName']) {
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
											.moveTo(posX[1], y + 13)
											.lineTo(posX[10], y + 13)
											.dash(1, { space: 0 })
											.stroke()

										sum90 = sum60 = sum30 = sum15 = sum0 = sum99 = sumBooking = 0;
										y += 3;
									}
								}

							}

							doc.pipe(res);
							doc.end();

						} else {
							res.send(err.message);
						}
					});
				}

				//### RUN RATE REPORT ###//
				else if (report == 'run_rate-brand') {
					request.query('EXEC sp_ReportRunRateByBrand \'' + branch + '\',\'' + brand + '\'', function (err, recordset, returnValue) {
						if (!err) {
							var posX = [10, 285, 315, 345, 375, 405, 435, 465, 495, 525, 555, 585];

							doc.font('./fonts/CALIBRIB.TTF', 18)
								.text('Stock Run Rate Report : Branch ' + branch, 10, 10)

							doc.lineWidth(0.75)
								.moveTo(posX[0], 30)
								.lineTo(posX[11], 30)
								.stroke()

							var groupName = 'xxx';
							var y = 20;
							var startY = y;
							var index = 1;
							var sum = 0;
							for (i = 0; i < recordset.length; i++ , index++) {
								y += 14;
								if (y > 800) {

									doc.addPage();
									y = 10;
									startY = y;

									if (i + 1 < recordset.length) {
										if (groupName == recordset[i + 1]['groupName']) {
											drawHeadLineRunRateBrand(doc, groupName, posX, y, 30);
											y += 18;
											startY = y;
										}
									}


								}
								if (groupName != recordset[i]['groupName']) {
									y += 5;

									groupName = recordset[i]['groupName'];
									drawHeadLineRunRateBrand(doc, groupName, posX, y, 30);
									y += 18;
									startY = y;

								}

								doc.y = y; doc.x = posX[0] + 2;
								doc.font('./fonts/THSarabun.ttf', 12)
									.text(index + '.', { width: 20, align: 'right' })
								doc.y = y; doc.x = posX[0] + 25;
								doc.text(recordset[i]['sku'], { width: 40, align: 'left' })
								doc.y = y; doc.x = posX[0] + 70;
								doc.text(recordset[i]['name'].substring(0, 45), { width: 300, align: 'left' })
								doc.y = y; doc.x = posX[0] + 115;
								doc.text(((recordset[i]['percentClaim'] != 0) ? recordset[i]['percentClaim'] : ''), { width: 300, align: 'center' })
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
									.moveTo(posX[0], y + 15)
									.lineTo(posX[11], y + 15)
									.dash(1, { space: 1 })
									.stroke()

								sum += recordset[i]['stock'] > 0 ? recordset[i]['stock'] * recordset[i]['cost'] : 0;

								if (recordset[i + 1] == null || groupName != recordset[i + 1]['groupName']) {
									if (sum != 0) {
										y += 16;
										doc.font('./fonts/THSarabunBold.ttf', 12)
										doc.y = y; doc.x = posX[1] - 20;
										doc.text('มูลค่า', { width: 30, align: 'left' })
										doc.y = y; doc.x = posX[1];
										doc.text((sum > 0) ? numberWithCommas(sum.toFixed(0)) : '-', { width: 60, align: 'right' })

										doc.lineWidth(0.5)
											.moveTo(posX[1] - 25, y + 15)
											.lineTo(posX[11], y + 15)
											.dash(1, { space: 0 })
											.stroke()

										sum = 0;
										y += 3;
									}
								}

							}

							doc.pipe(res);
							doc.end();

						} else {
							res.send(err.message);
						}
					});
				}

			});
		}
		else if (report == 'fingerscan') {

			var connection = new sql.Connection(config.mssql, function (err) {
				var request = new sql.Request(connection);
				request.multiple = true;
				request.query('EXEC Remax..sp_EmployeeData \'' + branch + '\',\'' + brand + '\'', function (err, recordset, returnValue) {
					if (!err) {
						var xl = require('excel4node');
						var wb = new xl.Workbook();
						//var ws = wb.addWorksheet(recordset[0]['header']);
						var ws = wb.addWorksheet('ข้อมูลจากเครื่อง');
						var headerStyle = wb.createStyle({
							font: { bold: true },
							alignment: { horizontal: 'center', vertical: 'center' }
						});
						var headerRightStyle = wb.createStyle({
							alignment: { horizontal: 'right', vertical: 'center', shrinkToFit: true }
						});
						var dataStyle = wb.createStyle({
							alignment: { horizontal: 'center', shrinkToFit: true }
						});
						var redStyle = wb.createStyle({
							font: { bold: true, color: 'FF0000' },
							alignment: { horizontal: 'center', shrinkToFit: true }
						});
						var greenStyle = wb.createStyle({
							font: { bold: true, color: '009900' },
							alignment: { horizontal: 'center', shrinkToFit: true }
						});
						var orangeStyle = wb.createStyle({
							font: { bold: true, color: 'FF9900' },
							alignment: { horizontal: 'center', shrinkToFit: true }
						});
						var pinkStyle = wb.createStyle({
							font: { bold: true, color: 'FF33CC' },
							alignment: { horizontal: 'center', shrinkToFit: true }
						});
						var headerTopStyle = wb.createStyle({
							font: { bold: true },
							alignment: { horizontal: 'center' },
							border: { left: { style: 'thin' }, right: { style: 'thin' }, top: { style: 'thin' }, bottom: { style: 'thin' } }
						});
						var calendarDayStyle = wb.createStyle({
							alignment: { horizontal: 'center' },
							border: { left: { style: 'thin' }, right: { style: 'thin' }, top: { style: 'thin' } }
						});
						var calendarTextStyle = wb.createStyle({
							font: { bold: true, color: 'FF0000' },
							alignment: { horizontal: 'center' },
							border: { left: { style: 'thin' }, right: { style: 'thin' }, bottom: { style: 'thin' } }
						});

						var row = 1;
						var column = 1;

						ws.cell(row, 1, row++, 7, true).string('ข้อมูลเวลาเข้า-ออกงานของพนักงาน วันที่ ' + recordset[0][0]['header']).style(headerStyle);
						row++;
						ws.cell(row, column, row + 1, column++, true).string("ชื่อพนักงาน").style(headerStyle);
						ws.cell(row, column, row + 1, column++, true).string("วันที่").style(headerStyle);
						ws.cell(row, column++, row, column++, true).string("เวลา").style(headerStyle);
						ws.cell(row, column++, row, column++, true).string("เวลาทำงาน").style(headerStyle);
						ws.cell(row, column, row + 1, column++, true).string("หมายเหตุ").style(headerStyle);
						row++;
						column = 3;
						ws.cell(row, column++).string("เข้า").style(headerStyle);
						ws.cell(row, column++).string("ออก").style(headerStyle);
						ws.cell(row, column++).string("นาที").style(headerStyle);
						ws.cell(row, column++).string("ชั่วโมง").style(headerStyle);
						row++;

						var holiday = {};
						for (i = 0; i < recordset[2].length; i++) {
							holiday[recordset[2][i]['dayNo']] = {
								name: recordset[2][i]['name'],
								isHoliday: recordset[2][i]['isHoliday']
							}
						}

						var activeName = '';
						var eRow = 1;
						var eCol = 1;
						var eTotal = {
							minutes: 0,
							late: 0,
							absence: 0,
							scan: 0,
							noTimeOut: 0
						}
						var textPos = {};
						var ws2;
						for (i = 0; i < recordset[1].length; i++) {
							if (activeName != recordset[1][i]['name']) {
								if (activeName != '') {
									eRow = 3;
									eCol = 3;
									ws2.cell(eRow++, eCol).string('' + eTotal.scan).style(eTotal.scan <= 0 ? redStyle : greenStyle);
									ws2.cell(eRow++, eCol).string('' + (eTotal.absence > 0 ? eTotal.absence : '-')).style(eTotal.absence > 0 ? redStyle : greenStyle);
									ws2.cell(eRow++, eCol).string('' + (eTotal.late > 0 ? eTotal.late : '-')).style(eTotal.late > 0 ? pinkStyle : greenStyle);
									ws2.cell(eRow++, eCol).string('' + (eTotal.noTimeOut > 0 ? eTotal.noTimeOut : '-')).style(eTotal.noTimeOut > 0 ? orangeStyle : greenStyle);
									var h = Math.floor(eTotal.minutes / 60) - 1;
									var m = eTotal.minutes % 60;
									ws2.cell(eRow, eCol++).string((h > 1 ? h + ' ชั่วโมง ' : '') + (m > 0 ? m + ' นาที' : ''));
								}
								activeName = recordset[1][i]['name'];
								eTotal.scan = 0;
								eTotal.absence = 0;
								eTotal.late = 0;
								eTotal.minutes = 0;
								eTotal.noTimeOut = 0;

								ws2 = wb.addWorksheet(activeName);
								eRow = 1;
								eCol = 1;
								ws2.cell(eRow++, eCol).string(recordset[1][i]['name']).style(wb.createStyle({ font: { bold: true } }));
								eRow++;
								ws2.cell(eRow, eCol, eRow++, eCol + 1, true).string("ทำงาน (วัน)").style(headerRightStyle);
								ws2.cell(eRow, eCol, eRow++, eCol + 1, true).string("ขาด (วัน)").style(headerRightStyle);
								ws2.cell(eRow, eCol, eRow++, eCol + 1, true).string("สาย (วัน)").style(headerRightStyle);
								ws2.cell(eRow, eCol, eRow++, eCol + 1, true).string("ไม่ลงเวลาออก (วัน)").style(headerRightStyle);
								ws2.cell(eRow, eCol, eRow++, eCol + 1, true).string("เวลาทำงาน").style(headerRightStyle);
								eRow++;
								eCol = 1;
								ws2.cell(eRow, eCol++).string("จ.").style(headerTopStyle);
								ws2.cell(eRow, eCol++).string("อ.").style(headerTopStyle);
								ws2.cell(eRow, eCol++).string("พ.").style(headerTopStyle);
								ws2.cell(eRow, eCol++).string("พฤ.").style(headerTopStyle);
								ws2.cell(eRow, eCol++).string("ศ.").style(headerTopStyle);
								ws2.cell(eRow, eCol++).string("ส.").style(headerTopStyle);
								ws2.cell(eRow, eCol++).string("อา.").style(headerTopStyle);
								eRow++;
								eCol = recordset[0][0]['startDayInMonth'] == 1 ? 7 : recordset[0][0]['startDayInMonth'] - 1;
								var dRow = eRow;
								var dCol = eCol;
								for (d = 1; d <= recordset[0][0]['totalDayInMonth']; d++) {
									if (textPos[d] == undefined) {
										textPos[d] = {
											row: dRow + 1,
											col: dCol
										}
									}

									if (holiday[d] == undefined || holiday[d].isHoliday) {
										ws2.cell(dRow, dCol).number(d).style(calendarDayStyle);
									}
									else {
										if (!holiday[d].isHoliday)
											ws2.cell(dRow, dCol).string(d + ' ' + holiday[d].name).style(wb.createStyle({
												font: { color: '0066FF' },
												alignment: { horizontal: 'center', shrinkToFit: true },
												border: { left: { style: 'thin' }, right: { style: 'thin' }, top: { style: 'thin' } },
											}));
									}


									if (dCol < 6) {
										eTotal.absence++;
										ws2.cell(dRow + 1, dCol).string('ขาด').style(calendarTextStyle);
									}
									else {
										ws2.cell(dRow + 1, dCol).string('-').style(calendarTextStyle);
									}

									if (holiday[d] != undefined && holiday[d].isHoliday) {
										if (dCol < 6) eTotal.absence--;
										ws2.cell(dRow + 1, dCol).string(holiday[d].name).style(wb.createStyle({
											font: { color: '0066FF' },
											alignment: { shrinkToFit: true },
										}));
									}
									dCol++;

									if (dCol == 8) {
										dCol = 1;
										dRow += 2;
									}
								}
							}


							eTotal.scan++;
							column = 1;
							ws.cell(row, column++).string(recordset[1][i]['name']).style(dataStyle);
							ws.cell(row, column++).number(recordset[1][i]['dayNo']).style(dataStyle);
							var timeIn = parseInt(('' + recordset[1][i]['timeIn']).replace(':', ''));
							var status = '';
							var text = '';
							if (timeIn > 940) {
								status = 'สาย';
								text = 'สาย ' + recordset[1][i]['timeIn'];
								eTotal.late++;
							}
							ws.cell(row, column++).string(recordset[1][i]['timeIn']).style(timeIn > 940 ? redStyle : (timeIn < 930 ? greenStyle : orangeStyle));
							ws.cell(row, column++).string(recordset[1][i]['timeCount'] == 1 ? '-' : recordset[1][i]['timeOut']).style(dataStyle);
							if (recordset[1][i]['timeCount'] > 1) {
								eTotal.minutes += recordset[1][i]['totalMinutes'];
								var h = Math.floor(recordset[1][i]['totalMinutes'] / 60) - 1;
								var m = recordset[1][i]['totalMinutes'] % 60;
								ws.cell(row, column++).number(recordset[1][i]['totalMinutes']).style(h < 8 ? redStyle : dataStyle);
								ws.cell(row, column++).string((h > 1 ? h + ' ชั่วโมง ' : '')
									+ (m > 0 ? m + ' นาที' : '')).style(h < 8 ? redStyle : dataStyle);
								status += h < 8 ? ((status == '' ? '' : ' และ') + 'ทำงานไม่ครบ 8 ชั่วโมง') : '';
							}
							else {
								ws.cell(row, column++).string('-').style(dataStyle);
								ws.cell(row, column++).string('-').style(dataStyle);
								status += (status == '' ? '' : ' และ') + 'ไม่ลงเวลาออก';
								eTotal.noTimeOut++;
								if (text == '') text = 'ไม่ลงเวลาออก';
							}


							if (status != '') {
								ws.cell(row, column++).string(status).style(wb.createStyle({
									font: { color: 'FF9900' },
									alignment: { shrinkToFit: true }
								}));
							}
							if (text != '') {
								ws2.cell(textPos[recordset[1][i]['dayNo']].row, textPos[recordset[1][i]['dayNo']].col).string(text).style(text.indexOf('สาย') >= 0 ? pinkStyle : orangeStyle);
							}
							else {
								ws2.cell(textPos[recordset[1][i]['dayNo']].row, textPos[recordset[1][i]['dayNo']].col).string("ปกติ").style(greenStyle);
							}
							if (eCol == 8) {
								eCol = 1;
								eRow++;
							}

							row++;
							if (textPos[recordset[1][i]['dayNo']].col < 6) eTotal.absence--;

						}

						//---
						if (recordset[1].length > 0) {
							eRow = 3;
							eCol = 3;
							ws2.cell(eRow++, eCol).string('' + eTotal.scan).style(eTotal.scan <= 0 ? redStyle : greenStyle);
							ws2.cell(eRow++, eCol).string('' + (eTotal.absence > 0 ? eTotal.absence : '-')).style(eTotal.absence > 0 ? redStyle : greenStyle);
							ws2.cell(eRow++, eCol).string('' + (eTotal.late > 0 ? eTotal.late : '-')).style(eTotal.late > 0 ? pinkStyle : greenStyle);
							ws2.cell(eRow++, eCol).string('' + (eTotal.noTimeOut > 0 ? eTotal.noTimeOut : '-')).style(eTotal.noTimeOut > 0 ? orangeStyle : greenStyle);
							var h = Math.floor(eTotal.minutes / 60) - 1;
							var m = eTotal.minutes % 60;
							ws2.cell(eRow, eCol++).string((h > 1 ? h + ' ชั่วโมง ' : '') + (m > 0 ? m + ' นาที' : ''));
						}
						//---

						ws.row(4).freeze();
						ws.column(1).setWidth(13);
						ws.column(2).setWidth(5);
						ws.column(3).setWidth(7);
						ws.column(4).setWidth(7);
						ws.column(5).setWidth(7);
						ws.column(6).setWidth(18);
						ws.column(7).setWidth(27);

						res.setHeader('Content-disposition', 'attachment; filename="' + recordset[0][0]['header'] + '.xlsx"');
						res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
						wb.write(brand + '-' + branch + '.xlsx', res);
					}
					else {
						res.json(err);
					}
				});
			});
		}

		else if (report == 'transport') {
			var connection = new sql.Connection(config.mssql, function (err) {
				var request = new sql.Request(connection);
				request.multiple = true;

				var PDFDocument = require('pdfkit');
				var moment = require('moment');
				var doc = new PDFDocument({ margin: 10, size: 'A4' });

				//### ORDER FOR REPORT ###//
				request.query('EXEC sp_TransportOrderAssign \'' + branch + '\',\'' + '' + '\'', function (err, recordset, returnValue) {
					if (!err) {

						doc.image('./public/images/report/transport.png', 0, 0, { width: 600 });

						var d = new Date();
						var m = moment(d);
						m.lang('th');
						m.utcOffset(+7);
						//m.add(3600*7, 'seconds'); // GMT +7
						doc.y = 49;
						doc.x = 140;
						doc.font('./fonts/THSarabun.ttf', 16)
							.text(recordset[0][0]['memberName'])

						doc.y = 51;
						doc.x = 78;
						doc.font('./fonts/THSarabun.ttf', 16)
							.text('......................................................................')

						doc.y = 73;
						doc.x = 55;
						doc.font('./fonts/THSarabun.ttf', 16)
							.text('...............................................................................')

						doc.y = 73;
						doc.x = 433;
						doc.font('./fonts/THSarabun.ttf', 16)
							.text(m.format('DD MMMM') + ' ' + (parseInt(m.format('YYYY')) + 543) + ' ' + m.format('HH:mm'))

						var y = 115;
						var page = 1;
						var maxY = 780;
						doc.font('./fonts/ANGSAU.TTF', 14);

						var allBox = 0;
						for (i = 0; i < recordset[0].length; i++) {
							if (y > maxY) {
								doc.addPage();
								if (recordset[0].length > 116) {
									doc.image('./public/images/report/transport1.png', 0, 0, { width: 600 });
								} else {
									doc.image('./public/images/report/transport.png', 0, 0, { width: 600 });
								}

								y = 115;
								page++;
							}
							y += 22;
							doc.y = y; doc.x = 25; doc.text(recordset[0][i]['orderNo']);
							doc.y = y; doc.x = 89; doc.text(recordset[0][i]['name']);
							doc.y = y; doc.x = 420; doc.text((recordset[0][i]['box']), { width: 35, align: 'right' });
							doc.y = y; doc.x = 475; doc.text('..........................................');
							allBox += parseInt(recordset[0][i]['box']);
						}

						doc.y = 51;
						doc.x = 500;
						doc.font('./fonts/THSarabun.ttf', 16)
							.text(allBox)

						doc.pipe(res);
						doc.end();
						return;

					} else {
						res.send(err.message);
					}
				});
			});
		}
		else if (report == 'serial') {
			var PDFDocument = require('pdfkit');
			var doc = new PDFDocument({ margin: 10, layout: 'landscape', size: [120, 300] });
			rq = require('request');

			rq({
				url: 'https://api.remaxthailand.co.th/barcode/' + branch,
				encoding: null
			}, function (err, response, body) {
				if (err) throw err;
				doc.y = 5; doc.x = 25;
				doc.font('./fonts/ANGSAU.TTF', 8).text('www.remaxthailand.co.th');

				doc.y = 7; doc.x = 14;
				doc.font('./fonts/ANGSAU.TTF', 8).text('HUB RU-U7 USB 3.0 (Silver) - REMAX');

				doc.image(body, 11, 11, { width: 65, height: 13 });

				doc.y = 19; doc.x = 29;
				doc.font('./fonts/ANGSAU.TTF', 4).text(branch);

				doc.y = 25; doc.x = 11;
				doc.font('./fonts/ANGSAU.TTF', 5.5).text('รับประกันพร้อมกล่องเท่านั้น\nชื่อสินค้า อุปกรณ์เสริมต่อพ่วงมือถือแท็บเล็ต\nวิธีใช้ ใช้งานตามวัตถุประสงค์\nจัดจำหน่ายโดย Powermax 8/8\nอ.บางบัวทอง จ.นนทบุรี\nวันที่ผลิด08/2017 ผลิตในประเทศจีน\nปริมาณสุทธิ 1ชิ้น');
				//-----------------------------------------------------------------------------------------------------
				doc.y = 5; doc.x = 136;
				doc.font('./fonts/ANGSAU.TTF', 8).text('www.remaxthailand.co.th');

				doc.y = 7; doc.x = 125;
				doc.font('./fonts/ANGSAU.TTF', 8).text('HUB RU-U7 USB 3.0 (Silver) - REMAX');

				doc.image(body, 122, 11, { width: 65, height: 13 });

				doc.y = 19; doc.x = 140;
				doc.font('./fonts/ANGSAU.TTF', 4).text(branch);

				doc.y = 25; doc.x = 122;
				doc.font('./fonts/ANGSAU.TTF', 5.5).text('รับประกันพร้อมกล่องเท่านั้น\nชื่อสินค้า อุปกรณ์เสริมต่อพ่วงมือถือแท็บเล็ต\nวิธีใช้ ใช้งานตามวัตถุประสงค์\nจัดจำหน่ายโดย Powermax 8/8\nอ.บางบัวทอง จ.นนทบุรี\nวันที่ผลิด08/2017 ผลิตในประเทศจีน\nปริมาณสุทธิ 1ชิ้น');
				//-----------------------------------------------------------------------------------------------------
				doc.y = 5; doc.x = 245;
				doc.font('./fonts/ANGSAU.TTF', 8).text('www.remaxthailand.co.th');

				doc.y = 7; doc.x = 234;
				doc.font('./fonts/ANGSAU.TTF', 8).text('HUB RU-U7 USB 3.0 (Silver) - REMAX');

				doc.image(body, 231, 11, { width: 65, height: 13 });

				doc.y = 19; doc.x = 249;
				doc.font('./fonts/ANGSAU.TTF', 4).text(branch);

				doc.y = 25; doc.x = 231;
				doc.font('./fonts/ANGSAU.TTF', 5.5).text('รับประกันพร้อมกล่องเท่านั้น\nชื่อสินค้า อุปกรณ์เสริมต่อพ่วงมือถือแท็บเล็ต\nวิธีใช้ ใช้งานตามวัตถุประสงค์\nจัดจำหน่ายโดย Powermax 8/8\nอ.บางบัวทอง จ.นนทบุรี\nวันที่ผลิด08/2017 ผลิตในประเทศจีน\nปริมาณสุทธิ 1ชิ้น');

				doc.pipe(res);
				doc.end();
				return;
			});
		}
		else if (report == 'orderReturn4office') {
			var orderNo = branch;
			var connection = new sql.Connection(config.mssql, function (err) {
				var request = new sql.Request(connection);
				request.multiple = true;

				var PDFDocument = require('pdfkit');
				var moment = require('moment');
				var doc = new PDFDocument({ margin: 10, size: 'A4' });

				//### ORDER FOR REPORT ###//
				request.query('EXEC sp_OrderEverntReturnByOrderNo \'' + orderNo + '\'', function (err, recordset, returnValue) {
					if (!err) {

						doc.image('./public/images/report/' + report + ((recordset[1].length > 52) ? '0' : '') + '.png', 0, 0, { width: 600 });
						rq = require('request');

						rq({
							url: 'https://24fin-api.remaxthailand.co.th/barcode/' + orderNo,
							encoding: null
						}, function (err, response, body) {
							if (err) throw err;

							doc.image(body, 436, 107, { width: 140 });

							rq({
								url: 'https://24fin-api.remaxthailand.co.th/barcode/' + recordset[0][0]['member'],
								encoding: null
							}, function (err, response, body) {
								if (err) throw err;

								doc.image(body, 25, 47, { width: 110 });


								/*var d = new Date(recordset[0][0]['addDate']);
								var m = moment(d);
								m.lang('th');
								m.utcOffset(0);*/
								//m.add(3600*7, 'seconds'); // GMT +7

								doc.y = 57;
								doc.x = 433;
								doc.font('./fonts/THSarabunBold.ttf', 12).text('อีเว้นท์วันที่ ' + moment(recordset[0][0]['eventStartDate']).lang('th').format('DD MMM') + ' ' + (parseInt(moment(recordset[0][0]['eventStartDate']).format('YYYY')) + 543) + ' ถึง ' + moment(recordset[0][0]['eventEndDate']).lang('th').format('DD MMM') + ' ' + (parseInt(moment(recordset[0][0]['eventEndDate']).format('YYYY')) + 543))

								doc.y = 88.7; doc.x = 513; doc.font('./fonts/CALIBRIB.TTF', 12).text(orderNo);
								doc.y = 29; doc.x = 67; doc.font('./fonts/CALIBRI.TTF', 12).text(recordset[0][0]['member']);


								doc.y = 24; doc.x = 150; doc.font('./fonts/THSarabunBold.ttf', 16).text(recordset[0][0]['name'] + ((recordset[0][0]['contactName'] != '') ? ' (' + recordset[0][0]['contactName'] + ')' : ''))

								doc.y = 44; doc.x = 150; doc.font('./fonts/THSarabunBold.ttf', 18).text(recordset[0][0]['shopName']);

								doc.y = 70; doc.x = 67; doc.font('./fonts/THSarabun.ttf', 14).text(recordset[0][0]['address'] + ' ' + recordset[0][0]['address2']);
								var isBkk = recordset[0][0]['province'] == 'กรุงเทพมหานคร';
								doc.y = 90; doc.x = 67; doc.text(((isBkk) ? 'แขวง' : 'ตำบล') + recordset[0][0]['subDistrict'] + ' ' + ((isBkk) ? 'เขต' : 'อำเภอ') + recordset[0][0]['district'] + ' ' + ((isBkk) ? '' : 'จังหวัด') + recordset[0][0]['province'] + ' รหัสไปรษณีย์ ' + recordset[0][0]['zipcode']);
								doc.y = 110.5; doc.x = 67; doc.text(recordset[0][0]['mobile'].substr(0, 3) + '-' + recordset[0][0]['mobile'].substr(3, 4) + '-' + recordset[0][0]['mobile'].substr(7, 3));

								var y = 158;
								var page = 1;
								var maxY = 795;
								var sumsellQty = 0;
								var sumsellPrice = 0.00;
								var sumreturnQty = 0;
								var sumreturnPrice = 0.00;
								var sumtotalQty = 0;
								var sumtotalPrice = 0.00;
								doc.font('./fonts/ANGSAU.TTF', 14);
								for (i = 0; i < recordset[1].length; i++) {
									if (page == 1) {
										if (y > maxY) {
											doc.addPage();
											doc.image('./public/images/report/' + report + '1.png', 0, 0, { width: 600 });
											y = 35;
											page++;
										}
									}
									else {
										if (y > maxY) {
											console.log('<<<<< con 2 >>>>>');
											doc.addPage();
											doc.image('./public/images/report/' + report + (((recordset[1].length - i) > 63) ? '1' : '2') + '.png', 0, 0, { width: 600 });
											doc.y = 10; doc.x = 10; doc.text('./public/images/report/' + report + (((recordset[1].length - i) > 63) ? '1' : '2') + '.png');
											y = 35;
											page++;
										}
									}
									y += 12;
									doc.y = y; doc.x = 25; doc.text(recordset[1][i]['sku']);
									doc.y = y; doc.x = 89; doc.text(recordset[1][i]['name']);
									doc.y = y; doc.x = 405; doc.text(numberWithCommas(recordset[1][i]['sellQty']), { width: 26, align: 'right' });
									doc.y = y; doc.x = 420; doc.text(numberWithCommas(recordset[1][i]['sellPrice']), { width: 43, align: 'right' });
									doc.y = y; doc.x = 457; doc.text(numberWithCommas(recordset[1][i]['returnQty']), { width: 26, align: 'right' });
									doc.y = y; doc.x = 476; doc.text(numberWithCommas(recordset[1][i]['returnPrice']), { width: 43, align: 'right' });
									doc.y = y; doc.x = 504; doc.text(numberWithCommas(recordset[1][i]['totalQty']), { width: 35, align: 'right' });
									doc.y = y; doc.x = 535; doc.text(numberWithCommas(recordset[1][i]['totalPrice']), { width: 43, align: 'right' });

									sumsellQty += recordset[1][i]['sellQty'];
									sumsellPrice += recordset[1][i]['sellPrice'];
									sumreturnQty += recordset[1][i]['returnQty'];
									sumreturnPrice += recordset[1][i]['returnPrice'];
									sumtotalQty += recordset[1][i]['totalQty'];
									sumtotalPrice += recordset[1][i]['totalPrice'];
								}

								doc.font('./fonts/ANGSAU.TTF', 14);
								doc.y = 803; doc.x = 405; doc.text(numberWithCommas(sumsellQty), { width: 26, align: 'right' });
								doc.y = 803; doc.x = 420; doc.text(numberWithCommas(sumsellPrice), { width: 43, align: 'right' });
								doc.y = 803; doc.x = 457; doc.text(numberWithCommas(sumreturnQty), { width: 26, align: 'right' });
								doc.y = 803; doc.x = 476; doc.text(numberWithCommas(sumreturnPrice), { width: 43, align: 'right' });
								doc.y = 803; doc.x = 504; doc.text(numberWithCommas(sumtotalQty), { width: 35, align: 'right' });
								doc.y = 803; doc.x = 535; doc.text(numberWithCommas(sumtotalPrice), { width: 43, align: 'right' });
								doc.pipe(res);
								doc.end();

							});
						});

					} else {
						res.send(err.message);
					}
				});
			});
		} else if (report == 'orderReturn4officeEvent') {
			var orderNo = decodeURIComponent(branch);
			var connection = new sql.Connection(config.mssql, function (err) {
				var request = new sql.Request(connection);
				request.multiple = true;

				var PDFDocument = require('pdfkit');
				var moment = require('moment');
				var doc = new PDFDocument({ margin: 10, size: 'A4' });

				//### ORDER FOR REPORT ###//
				request.query('EXEC sp_OrderEverntReturnByEvent \'' + orderNo + '\'', function (err, recordset, returnValue) {
					if (!err) {

						//doc.image('./public/images/report/'+report+((recordset[1].length > 52) ? '0' : '')+'.png', 0, 0, {width:600});
						doc.image('./public/images/report/' + report + '.png', 0, 0, { width: 600 });
						rq = require('request');

						rq({
							//url: 'https://24fin-api.remaxthailand.co.th/barcode/'+orderNo,
							url: 'https://24fin-api.remaxthailand.co.th/barcode/1234',
							encoding: null
						}, function (err, response, body) {
							if (err) throw err;

							//doc.image(body, 436, 107, {width:140});

							rq({
								url: 'https://24fin-api.remaxthailand.co.th/barcode/' + recordset[0][0]['member'],
								encoding: null
							}, function (err, response, body) {
								if (err) throw err;

								doc.image(body, 25, 47, { width: 110 });


								/*var d = new Date(recordset[0][0]['addDate']);
								var m = moment(d);
								m.lang('th');
								m.utcOffset(0);*/
								//m.add(3600*7, 'seconds'); // GMT +7

								doc.y = 57;
								doc.x = 433;
								doc.font('./fonts/THSarabunBold.ttf', 12).text('อีเว้นท์วันที่ ' + moment(recordset[0][0]['eventStartDate']).lang('th').format('DD MMM') + ' ' + (parseInt(moment(recordset[0][0]['eventStartDate']).format('YYYY')) + 543) + ' ถึง ' + moment(recordset[0][0]['eventEndDate']).lang('th').format('DD MMM') + ' ' + (parseInt(moment(recordset[0][0]['eventEndDate']).format('YYYY')) + 543))

								//doc.y = 88.7; doc.x = 513;		doc.font('./fonts/CALIBRIB.TTF', 12).text(orderNo);
								doc.y = 29; doc.x = 67; doc.font('./fonts/CALIBRI.TTF', 12).text(recordset[0][0]['member']);


								doc.y = 24; doc.x = 150; doc.font('./fonts/THSarabunBold.ttf', 16).text(recordset[0][0]['name'] + ((recordset[0][0]['contactName'] != '') ? ' (' + recordset[0][0]['contactName'] + ')' : ''))

								doc.y = 44; doc.x = 150; doc.font('./fonts/THSarabunBold.ttf', 18).text(recordset[0][0]['shopName']);

								doc.y = 70; doc.x = 67; doc.font('./fonts/THSarabun.ttf', 14).text(recordset[0][0]['address'] + ' ' + recordset[0][0]['address2']);
								var isBkk = recordset[0][0]['province'] == 'กรุงเทพมหานคร';
								doc.y = 90; doc.x = 67; doc.text(((isBkk) ? 'แขวง' : 'ตำบล') + recordset[0][0]['subDistrict'] + ' ' + ((isBkk) ? 'เขต' : 'อำเภอ') + recordset[0][0]['district'] + ' ' + ((isBkk) ? '' : 'จังหวัด') + recordset[0][0]['province'] + ' รหัสไปรษณีย์ ' + recordset[0][0]['zipcode']);
								doc.y = 110.5; doc.x = 67; doc.text(recordset[0][0]['mobile'].substr(0, 3) + '-' + recordset[0][0]['mobile'].substr(3, 4) + '-' + recordset[0][0]['mobile'].substr(7, 3));

								var y = 158;
								var page = 1;
								var maxY = 795;
								var sumsellQty = 0;
								var sumsellPrice = 0.00;
								var sumreturnQty = 0;
								var sumreturnPrice = 0.00;
								var sumtotalQty = 0;
								var sumtotalPrice = 0.00;
								doc.font('./fonts/ANGSAU.TTF', 14);
								for (i = 0; i < recordset[1].length; i++) {
									/*if ( page == 1){
										if ( y > maxY ) {
											doc.addPage();
											doc.image('./public/images/report/'+report+'1.png', 0, 0, {width:600});
											y = 35;
											page++;
										}
									}
									else {
										if ( y > maxY ) {
											console.log('<<<<< con 2 >>>>>');
											doc.addPage();
											doc.image('./public/images/report/'+report+(((recordset[1].length - i) > 63) ? '1' : '2')+'.png', 0, 0, {width:600});
											doc.y = 10;	doc.x = 10;	doc.text('./public/images/report/'+report+(((recordset[1].length - i) > 63) ? '1' : '2')+'.png');
											y = 35;
											page++;
										}
									}*/
									y += 12;
									doc.y = y; doc.x = 127; doc.text(recordset[1][i]['orderNo']);
									doc.y = y; doc.x = 305; doc.text(numberWithCommas(recordset[1][i]['sellQty']), { width: 26, align: 'right' });
									doc.y = y; doc.x = 345; doc.text(numberWithCommas(recordset[1][i]['sellPrice']), { width: 43, align: 'right' });
									doc.y = y; doc.x = 395; doc.text(numberWithCommas(recordset[1][i]['returnQty']), { width: 26, align: 'right' });
									doc.y = y; doc.x = 440; doc.text(numberWithCommas(recordset[1][i]['returnPrice']), { width: 43, align: 'right' });
									doc.y = y; doc.x = 483; doc.text(numberWithCommas(recordset[1][i]['totalQty']), { width: 35, align: 'right' });
									doc.y = y; doc.x = 535; doc.text(numberWithCommas(recordset[1][i]['totalPrice']), { width: 43, align: 'right' });

									sumsellQty += recordset[1][i]['sellQty'];
									sumsellPrice += recordset[1][i]['sellPrice'];
									sumreturnQty += recordset[1][i]['returnQty'];
									sumreturnPrice += recordset[1][i]['returnPrice'];
									sumtotalQty += recordset[1][i]['totalQty'];
									sumtotalPrice += recordset[1][i]['totalPrice'];
								}

								doc.font('./fonts/ANGSAU.TTF', 14);
								doc.y = 803; doc.x = 305; doc.text(numberWithCommas(sumsellQty), { width: 26, align: 'right' });
								doc.y = 803; doc.x = 345; doc.text(numberWithCommas(sumsellPrice), { width: 43, align: 'right' });
								doc.y = 803; doc.x = 395; doc.text(numberWithCommas(sumreturnQty), { width: 26, align: 'right' });
								doc.y = 803; doc.x = 440; doc.text(numberWithCommas(sumreturnPrice), { width: 43, align: 'right' });
								doc.y = 803; doc.x = 483; doc.text(numberWithCommas(sumtotalQty), { width: 35, align: 'right' });
								doc.y = 803; doc.x = 535; doc.text(numberWithCommas(sumtotalPrice), { width: 43, align: 'right' });
								doc.pipe(res);
								doc.end();

							});
						});

					} else {
						res.send(err.message);
					}
				});
			});
		} else if (report == 'orderProductSerial') {
			var orderNo = branch;
			var connection = new sql.Connection(config.mssql, function (err) {
				var request = new sql.Request(connection);
				//request.multiple = true;

				var PDFDocument = require('pdfkit');
				var moment = require('moment');
				var doc = new PDFDocument({ margin: 10, size: 'A4' });

				//### ORDER FOR REPORT ###//
				request.query('EXEC sp_OrderProductSerial \'' + orderNo + '\'', function (err, recordset, returnValue) {
					if (!err) {
						rq = require('request');
						doc.x = 24; doc.y = 24;

						doc.font('./fonts/THSarabunBold.ttf', 16).text('เลขที่คำสั่งซื้อ: ' + orderNo)
						var count = 0;
						var sameProduct = 0;
						var pX = 0;
						var pY = 0;
						var productName = '';
						recordset.forEach(x => {
							rq({
								url: 'http://127.0.0.1:9982/barcode/' + x['serial'],
								encoding: null
							}, function (err, response, body) {

								if (err) throw err;

								pX = count * 135;

								/*if (productName != x['name']) {
									pX = 0;
									pY = count * 45;
								} else {
									pX = count * 135;
									pY = 0;
								}

								if (productName != x['name'] && count == 2) {
									pX = 0;
									pY = 1 * 45;
								} else if (productName == x['name'] && count > 2) {
									pX = 1 * 135;
									pY = 1 * 45;
								}

								if (productName != x['name']) {
									doc.x = 24 + pX; doc.y = 50 + pY;
									doc.font('./fonts/THSarabunBold.ttf', 14).text(x['name'])
								}*/

								doc.x = 24 + pX; doc.y = 50 + pY;
								doc.font('./fonts/THSarabunBold.ttf', 10).text('EAN: '+x['barcode'])

								doc.image(body, 24 + pX, 63 + pY, { width: 110, height: 20 });

								doc.x = 50 + pX; doc.y = 80 + pY;
								doc.font('./fonts/THSarabunBold.ttf', 10).text(x['serial'])

								count++;

								productName = x['name'];

								if (count == recordset.length) {
									doc.pipe(res);
									doc.end();
								}

							});

						});

						/*for(i=0; i<recordset.length; i++){
							
							rq({
								url: 'https://24fin-api.remaxthailand.co.th/barcode/'+recordset[i]['serial'],
								encoding: null
							}, function(err, response, body) {
								count++;
								if (err) throw err;
								doc.y = 50; doc.x = 24;
								doc.font('./fonts/THSarabunBold.ttf', 14).text(recordset[i]['name'])
								
								doc.image(body, 24, 68, {width:110, height:20});
								
								doc.y = 85; doc.x = 50;
								doc.font('./fonts/THSarabunBold.ttf', 10).text(recordset[i]['serial'])
								if(count == recordset.length){			
									doc.pipe(res);
									doc.end();
								}	
							});

							
						}	*/

					} else {
						res.send(err.message);
					}
				});
			});
		}

	}
	catch (err) {
		data.err = err;
		res.json(data);
	}

};

exports.generate = function (req, res, report, vat, orderNo) {

	try {

		if (report == 'neoinvoice') {

			var connection = new sql.Connection(config.mssql, function (err) {
				var request = new sql.Request(connection);
				request.multiple = true;

				var PDFDocument = require('pdfkit');
				var moment = require('moment');
				var doc = new PDFDocument({ margin: 10, size: 'A4' });

				//### ORDER FOR REPORT ###//
				request.query('EXEC sp_DataOrderDetailInvoice \'' + orderNo + '\',\'' + vat + '\'', function (err, recordset, returnValue) {
					if (!err) {
						if (vat == 0) { //non-vat
							doc.image('./public/images/report/' + report + ((recordset[1].length > 42) ? '0' : '') + '.png', 0, 0, { width: 600 });
							rq = require('request');

							rq({
								url: 'https://24fin-api.azurewebsites.net/barcode/' + orderNo,
								encoding: null
							}, function (err, response, body) {
								if (err) throw err;

								doc.image(body, 436, 107, { width: 140 });

								rq({
									url: 'https://24fin-api.azurewebsites.net/barcode/' + recordset[0][0]['member'],
									encoding: null
								}, function (err, response, body) {
									if (err) throw err;

									doc.image(body, 25, 47, { width: 110 });


									var d = new Date(recordset[0][0]['addDate']);
									var m = moment(d);
									m.lang('th');
									m.utcOffset(0);
									//m.add(3600*7, 'seconds'); // GMT +7

									doc.y = 57;
									doc.x = 433;
									doc.font('./fonts/THSarabunBold.ttf', 16)
										.text('วันที่ ' + m.format('DD MMMM') + ' ' + (parseInt(m.format('YYYY')) + 543) + ' ' + m.format('HH:mm'))

									doc.y = 88.7; doc.x = 513; doc.font('./fonts/CALIBRIB.TTF', 12).text(orderNo);
									doc.y = 29; doc.x = 67; doc.font('./fonts/CALIBRI.TTF', 12).text(recordset[0][0]['member']);


									doc.y = 24; doc.x = 150; doc.font('./fonts/THSarabunBold.ttf', 16).text(recordset[0][0]['name'] + ((recordset[0][0]['contactName'] != '') ? ' (' + recordset[0][0]['contactName'] + ')' : ''))

									doc.y = 44; doc.x = 150; doc.font('./fonts/THSarabunBold.ttf', 18).text(recordset[0][0]['shopName']);

									doc.y = 70; doc.x = 67; doc.font('./fonts/THSarabun.ttf', 14).text(recordset[0][0]['address'] + ' ' + recordset[0][0]['address2']);
									var isBkk = recordset[0][0]['province'] == 'กรุงเทพมหานคร';
									doc.y = 90; doc.x = 67; doc.text(((isBkk) ? 'แขวง' : 'ตำบล') + recordset[0][0]['subDistrict'] + ' ' + ((isBkk) ? 'เขต' : 'อำเภอ') + recordset[0][0]['district'] + ' ' + ((isBkk) ? '' : 'จังหวัด') + recordset[0][0]['province'] + ' รหัสไปรษณีย์ ' + recordset[0][0]['zipcode']);
									doc.y = 110.5; doc.x = 67; doc.text(recordset[0][0]['mobile'].substr(0, 3) + '-' + recordset[0][0]['mobile'].substr(3, 4) + '-' + recordset[0][0]['mobile'].substr(7, 3));

									var y = 158;
									var page = 1;
									if (recordset[1].length == 47) {
										var maxY = 700;
									} else {
										var maxY = 785;
									}
									doc.font('./fonts/ANGSAU.TTF', 14);

									for (i = 0; i < recordset[1].length; i++) {
										if (page == 1) {
											if (y > maxY) {
												doc.addPage();
												if (recordset[1].length > 116) {
													doc.image('./public/images/report/' + report + '1.png', 0, 0, { width: 600 });
												} else {
													doc.image('./public/images/report/' + report + '2.png', 0, 0, { width: 600 });
												}

												y = 35;
												page++;
											}
										}
										else {
											if (y > maxY) {
												doc.addPage();
												doc.image('./public/images/report/' + report + (((recordset[1].length - i) > 63) ? '1' : '2') + '.png', 0, 0, { width: 600 });
												//doc.y = 10;	doc.x = 10;	doc.text('./public/images/report/'+report+(((recordset[1].length - i) > 63) ? '1' : '2')+'.png');
												y = 35;
												page++;
											}
										}
										y += 12;
										doc.y = y; doc.x = 25; doc.text(recordset[1][i]['sku']);
										doc.y = y; doc.x = 89; doc.text(recordset[1][i]['name']);
										doc.y = y; doc.x = 420; doc.text(numberWithCommas(recordset[1][i]['price'].toFixed(2)), { width: 35, align: 'right' });
										doc.y = y; doc.x = 475; doc.text(numberWithCommas(recordset[1][i]['qty']), { width: 26, align: 'right' });
										doc.y = y; doc.x = 525; doc.text(numberWithCommas(recordset[1][i]['totalPrice'].toFixed(2)), { width: 43, align: 'right' });
									}

									doc.font('./fonts/THSarabun.ttf', 14);
									doc.y = 733.5; doc.x = 90; doc.text(numberWithCommas(recordset[0][0]['textPrice']), { width: 250, align: 'center' });
									doc.font('./fonts/CALIBRIB.TTF', 10);
									doc.y = 735; doc.x = 523; doc.text(numberWithCommas(recordset[0][0]['totalPrice'].toFixed(2)), { width: 50, align: 'right' });
									doc.font('./fonts/CALIBRIB.TTF', 10);
									doc.y = 773; doc.x = 523; doc.text((recordset[0][0]['vat'] == 0) ? '-' : numberWithCommas(recordset[0][0]['vat'].toFixed(2)), { width: 50, align: 'right' });
									doc.font('./fonts/CALIBRIB.TTF', 10);
									doc.y = 810; doc.x = 523; doc.text(numberWithCommas(recordset[0][0]['totalPriceAV'].toFixed(2)), { width: 50, align: 'right' });

									doc.pipe(res);
									doc.end();
									return;
								});
							});
						} else { //vat 
							doc.image('./public/images/report/' + report + ((recordset[1].length > 42) ? '0' : '') + '_vat.png', 0, 0, { width: 600 });
							rq = require('request');

							rq({
								url: 'https://24fin-api.azurewebsites.net/barcode/' + orderNo,
								encoding: null
							}, function (err, response, body) {
								if (err) throw err;

								doc.image(body, 436, 116, { width: 140 });
								doc.y = 5; doc.x = 16; doc.font('./fonts/THSarabunBold.ttf', 32).text('บริษัท นีโอลูชั่น เทคโนโลยี คอร์ปอเรชั่น จำกัด');
								doc.y = 40; doc.x = 16; doc.font('./fonts/THSarabunBold.ttf', 16).text('44 ซอยเอกชัย 63 ถนนเอกชัย แขวงบางบอน เขตบางบอน กรุงเทพมหานคร 10150');
								doc.y = 60; doc.x = 16; doc.font('./fonts/THSarabunBold.ttf', 16).text('Tel: 028-9828-75, Fax: 028-9828-58');
								doc.y = 80; doc.x = 16; doc.font('./fonts/THSarabunBold.ttf', 16).text('เลขประจำตัวผู้เสียภาษี 0105548046089');

								rq({
									url: 'https://24fin-api.azurewebsites.net/barcode/' + recordset[0][0]['member'],
									encoding: null
								}, function (err, response, body) {
									if (err) throw err;

									doc.image(body, 25, 47 + 82.5, { width: 110 });


									var d = new Date(recordset[0][0]['addDate']);
									var m = moment(d);
									m.lang('th');
									m.utcOffset(0);
									//m.add(3600*7, 'seconds'); // GMT +7

									doc.y = 75;
									doc.x = 434;
									doc.font('./fonts/THSarabunBold.ttf', 16)
										.text('วันที่ ' + m.format('DD MMMM') + ' ' + (parseInt(m.format('YYYY')) + 543) + ' ' + m.format('HH:mm'))

									var yPlus = 82.5;

									doc.y = 102.5; doc.x = 513; doc.font('./fonts/CALIBRIB.TTF', 12).text(orderNo);
									doc.y = 29 + yPlus; doc.x = 67; doc.font('./fonts/CALIBRI.TTF', 12).text(recordset[0][0]['member']);


									doc.y = 24 + yPlus; doc.x = 150; doc.font('./fonts/THSarabunBold.ttf', 16).text(recordset[0][0]['name'] + ((recordset[0][0]['contactName'] != '') ? ' (' + recordset[0][0]['contactName'] + ')' : ''))

									doc.y = 44 + yPlus; doc.x = 150; doc.font('./fonts/THSarabunBold.ttf', 18).text(recordset[0][0]['shopName']);

									doc.y = 70 + yPlus; doc.x = 67; doc.font('./fonts/THSarabun.ttf', 14).text(recordset[0][0]['address'] + ' ' + recordset[0][0]['address2']);
									var isBkk = recordset[0][0]['province'] == 'กรุงเทพมหานคร';
									doc.y = 90 + yPlus; doc.x = 67; doc.text(((isBkk) ? 'แขวง' : 'ตำบล') + recordset[0][0]['subDistrict'] + ' ' + ((isBkk) ? 'เขต' : 'อำเภอ') + recordset[0][0]['district'] + ' ' + ((isBkk) ? '' : 'จังหวัด') + recordset[0][0]['province'] + ' รหัสไปรษณีย์ ' + recordset[0][0]['zipcode']);
									doc.y = 110.5 + yPlus; doc.x = 67; doc.text(recordset[0][0]['mobile'].substr(0, 3) + '-' + recordset[0][0]['mobile'].substr(3, 4) + '-' + recordset[0][0]['mobile'].substr(7, 3));
									doc.y = 110.5 + yPlus; doc.x = 250; doc.text(((recordset[0][0]['taxNo']) == '-') ? '' : 'เลขประจำตัวผู้เสียภาษี ' + recordset[0][0]['taxNo']);

									var y = 158 + 83;
									var page = 1;

									if (recordset[1].length == 39) {
										var maxY = 700 - 83;
									} else {
										var maxY = 785 + 10;
									}
									doc.font('./fonts/ANGSAU.TTF', 14);

									for (i = 0; i < recordset[1].length; i++) {
										if (page == 1) {
											if (y > maxY) {
												doc.addPage();
												if (recordset[1].length > 83) {
													doc.image('./public/images/report/' + report + '1_vat.png', 0, 0, { width: 600 });
												} else {
													doc.image('./public/images/report/' + report + '2_vat.png', 0, 0, { width: 600 });
												}

												y = 35;
												page++;
											}
										}
										else {
											if (y > maxY) {
												doc.addPage();
												if (recordset[1].length > 200) {
													doc.image('./public/images/report/' + report + '1_vat.png', 0, 0, { width: 600 });
												} else {
													doc.image('./public/images/report/' + report + '2_vat.png', 0, 0, { width: 600 });
												}

												y = 35;
												page++;
											}
										}
										y += 12;
										doc.y = y; doc.x = 25; doc.text(recordset[1][i]['sku']);
										doc.y = y; doc.x = 89; doc.text(recordset[1][i]['name']);
										doc.y = y; doc.x = 420; doc.text(numberWithCommas(recordset[1][i]['price'].toFixed(2)), { width: 35, align: 'right' });
										doc.y = y; doc.x = 475; doc.text(numberWithCommas(recordset[1][i]['qty']), { width: 26, align: 'right' });
										doc.y = y; doc.x = 525; doc.text(numberWithCommas(recordset[1][i]['totalPrice'].toFixed(2)), { width: 43, align: 'right' });
									}

									doc.font('./fonts/THSarabun.ttf', 14);
									doc.y = 733.5; doc.x = 90; doc.text(numberWithCommas(recordset[0][0]['textPrice']), { width: 250, align: 'center' });
									doc.font('./fonts/CALIBRIB.TTF', 10);
									doc.y = 735; doc.x = 523; doc.text(numberWithCommas(recordset[0][0]['totalPrice'].toFixed(2)), { width: 50, align: 'right' });
									doc.font('./fonts/CALIBRIB.TTF', 10);
									doc.y = 773; doc.x = 523; doc.text((recordset[0][0]['vat'] == 0) ? '-' : numberWithCommas(recordset[0][0]['vat'].toFixed(2)), { width: 50, align: 'right' });
									doc.font('./fonts/CALIBRIB.TTF', 10);
									doc.y = 810; doc.x = 523; doc.text(numberWithCommas(recordset[0][0]['totalPriceAV'].toFixed(2)), { width: 50, align: 'right' });

									doc.pipe(res);
									doc.end();
									return;
								});
							});
						}
					} else {
						res.send(err.message);
					}
				});
			});
		}
	}
	catch (err) {
		data.err = err;
		res.json(data);
	}

};

exports.shop = function (req, res, firstname, lastname) {
	firstname = decodeURI(firstname);
	lastname = decodeURI(lastname);
	try {

		var request = require('request');

		request.post({
			headers: { 'referer': 'https://api.remaxthailand.co.th' }, url: 'http://127.0.0.1:9991/register/shop/info',
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
					var doc = new PDFDocument({ margin: 10, size: 'A4' });

					var x = 10;
					var y = 10;

					doc.font('./fonts/THSarabun.ttf', 32);
					//doc.y = y; doc.x = x; doc.text('ชื่อผู้สมัคร', {width: 130, align: 'right'} );
					doc.font('./fonts/THSarabunBold.ttf', 32);
					doc.y = y; doc.x = x + 140; doc.text('คุณ' + json.firstname + '  ' + json.lastname + ' (' + json.nickname + ')');
					y += 32;

					doc.font('./fonts/THSarabun.ttf', 18);
					doc.y = y; doc.x = x; doc.text('เบอร์โทรศัพท์', { width: 130, align: 'right' });
					doc.font('./fonts/THSarabunBold.ttf', 18);
					doc.y = y; doc.x = x + 140; doc.text(json.mobile.substr(0, 3) + '-' + json.mobile.substr(3, 4) + '-' + json.mobile.substr(7));
					y += 18;

					doc.font('./fonts/THSarabun.ttf', 18);
					doc.y = y; doc.x = x; doc.text('เวลาที่สะดวกในการติดต่อ', { width: 130, align: 'right' });
					doc.font('./fonts/THSarabunBold.ttf', 18);
					doc.y = y; doc.x = x + 140; doc.text(json.time);
					y += 18;

					/*doc.font('./fonts/THSarabun.ttf', 18);
					doc.y = y; doc.x = x; doc.text('สนใจเป็นตัวแทนในจังหวัด', {width: 130, align: 'right'});
					doc.font('./fonts/THSarabunBold.ttf', 18);
					doc.y = y; doc.x = x+140; doc.text( json.Province );
					y += 18;*/

					doc.font('./fonts/THSarabun.ttf', 18);
					doc.y = y; doc.x = x; doc.text('ที่อยู่', { width: 130, align: 'right' });
					doc.font('./fonts/THSarabunBold.ttf', 18);
					doc.y = y; doc.x = x + 140; doc.text(json.address);
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
				} else {
					data.err = error;
					res.json(data);
				}
			});

	}
	catch (err) {
		data.err = err;
		res.json(data);
	}
}

function drawHeadLine(doc, groupName, posX, y, width) {

	doc.y = y; doc.x = posX[0];
	doc.font('./fonts/THSarabunBold.ttf', 18)
		.text(groupName, { width: 300, align: 'left' });

	doc.y = y + 3; doc.x = posX[3];
	doc.font('./fonts/THSarabunBold.ttf', 12)
		.text('ทุน', { width: width, align: 'right' })
	//doc.y = y+3; doc.x = posX[2];
	//doc.text('ทุนใหม่', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[4];
	doc.text('90', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[5];
	doc.text('60', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[6];
	doc.text('30', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[7];
	doc.text('15', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[8];
	doc.text('ปัจจุบัน', { width: width, align: 'right' })
	//doc.y = y+3; doc.x = posX[8];
	//doc.text('Plan', { width: width, align: 'right' })

	doc.lineWidth(0.75)
		.moveTo(posX[0], y + 18)
		.lineTo(posX[9], y + 18)
		.dash(1, { space: 0 })
		.stroke()
}

function drawHeadLineRunRate(doc, groupName, posX, y, width) {

	doc.y = y + 4; doc.x = posX[0];
	doc.font('./fonts/CALIBRIB.TTF', 12)
		.text(groupName, { width: 300, align: 'left' });

	doc.y = y + 3; doc.x = posX[1];
	doc.font('./fonts/THSarabunBold.ttf', 12)
		.text('ทุน', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[2];
	doc.text('Stock', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[3];
	doc.text('วันนี้', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[4];
	doc.text('-1', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[5];
	doc.text('-2', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[6];
	doc.text('-3', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[7];
	doc.text('-4', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[8];
	doc.text('-5', { width: width, align: 'right' })

	doc.lineWidth(0.75)
		.moveTo(posX[0], y + 18)
		.lineTo(posX[9], y + 18)
		.dash(1, { space: 0 })
		.stroke()
}

function drawHeadLineBrand(doc, groupName, posX, y, width) {

	doc.y = y; doc.x = posX[0];
	doc.font('./fonts/THSarabunBold.ttf', 18)
		.text(groupName, { width: 300, align: 'left' });

	doc.y = y + 3; doc.x = posX[1];
	doc.font('./fonts/THSarabunBold.ttf', 12)
		.text('ทุน', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[2];
	doc.text('ทุนใหม่', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[3];
	doc.text('90', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[4];
	doc.text('60', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[5];
	doc.text('30', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[6];
	doc.text('15', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[7];
	doc.text('ปัจจุบัน', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[8];
	doc.text('Plan', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[9];
	doc.text('จอง', { width: width, align: 'right' })

	doc.lineWidth(0.75)
		.moveTo(posX[0], y + 18)
		.lineTo(posX[10], y + 18)
		.dash(1, { space: 0 })
		.stroke()
}

function drawHeadLineRunRateBrand(doc, groupName, posX, y, width) {

	doc.y = y + 4; doc.x = posX[0];
	doc.font('./fonts/CALIBRIB.TTF', 12)
		.text(groupName, { width: 300, align: 'left' });

	doc.y = y + 3; doc.x = posX[0] + 235;
	doc.font('./fonts/THSarabunBold.ttf', 12).text('เคลม(%)', { width: width + 30, align: 'center' })
	doc.y = y + 3; doc.x = posX[1];
	doc.font('./fonts/THSarabunBold.ttf', 12).text('ทุน', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[2];
	doc.text('Stock', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[3];
	doc.text('วันนี้', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[4];
	doc.text('-1', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[5];
	doc.text('-2', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[6];
	doc.text('-3', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[7];
	doc.text('-4', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[8];
	doc.text('-5', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[9];
	doc.text('Plan', { width: width, align: 'right' })
	doc.y = y + 3; doc.x = posX[10];
	doc.text('จอง', { width: width, align: 'right' })

	doc.lineWidth(0.75)
		.moveTo(posX[0], y + 18)
		.lineTo(posX[11], y + 18)
		.dash(1, { space: 0 })
		.stroke()
}
function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
