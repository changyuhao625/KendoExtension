$(function () {
	kendoui = kendo.ui,
	Widget = kendoui.Widget

	var ExtGrid = Widget.extend({
		dataSource: null,
		pageable: true,
		sortable: {
			mode: "multiple",
			allowUnsort: true
		},
		dataBound: function () { },
		init: function (element, options) {
			var that = this;
			Widget.fn.init.call(that, element, options);
			if (options.sortable) {
				sortable = options.sortable;
			}
			if (typeof options.dataBound === "function") {
				dataBound = options.dataBound;
			}

			if (!$.isEmptyObject(options.dataSource)) {
				//因為Schema 無法後來再指給他,只好重新new 一個DataSource起來重塞.
				//這個做法式為了讓共用更好操作,使用者無需再自行設定Schema and 設定
				//trigger KendoGridRequest Model Binding
				that.dataSource = new kendo.data.DataSource({
					schema: {
						//取出資料陣列
						data: function (d) { return d.data; },
						//取出資料總筆數(計算頁數用)
						total: function (d) { return d.total; }
					},
					pageSize: options.dataSource.options.pageSize,
					serverPaging: options.dataSource.options.serverPaging,
					serverSorting: options.dataSource.options.serverSorting

				});
				that.dataSource.transport = options.dataSource.transport;
				that.dataSource.transport.parameterMap = function (data, type) {
					if (type == "read") {
						//trigger KendoGridRequest Model Binding
						data.KendoGridRequest = null;
						return data;
					}
				};
			}

			this._initWidget(element, that, options);
		},
		_initWidget: function (element, that, options) {
			$('#' + element.id).kendoGrid({
				pageable: that.pageable,
				columns: options.columns,
				dataSource: that.dataSource,
				sortable: that.sortable,
				dataBound: function () {
					that.dataBound();
					//沒資料塞一列顯示"查無資料"
					var grid = $("#" + element.id).data("kendoGrid");
					if (grid.dataSource.view().length == 0) {
						var colCount = that.options.columns.length;
						$("#" + element.id).find('.k-grid-content tbody').append('<tr class="kendo-data-row"><td colspan="' +
                                colCount +
                                '" style="text-align:center"><b>查無資料!</b></td></tr>');
					}
				}
			});
		},
		options: {
			name: "ExtGrid"
		}
	});
	kendoui.plugin(ExtGrid);

})