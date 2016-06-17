$(function () {
    kendoui = kendo.ui,
	Widget = kendoui.Widget
    itsmGridCheckVal = {};
    var ExtGrid = Widget.extend({
        dataSource: null,
        pageable: true,
        selectable: true,
        checkOptions: {
            enable: false,
            key: ""
        },
        sortable: {
            mode: "multiple",
            allowUnsort: true
        },
        init: function (element, options) {
            var that = this;
            Widget.fn.init.call(that, element, options);
            if (options.checkOptions) {
                that.checkOptions = options.checkOptions;
                if (that.checkOptions.enable) {
                    options.columns.unshift({
                        field: "CheckRow",
                        title: (kendo.format("<input id='{0}CheckAll' ITSM-Control='Grid' type='checkbox' class='checkbox' />", element.id)),
                        width: 40,
                        template: kendo.format("<input Grid-ID='{0}' ITSM-Control='Grid' type='checkbox' class='checkbox' />", element.id),
                        attributes: { style: "text-align:center;" },
                        sortable: false
                    });
                }
            }

            if (!$.isEmptyObject(options.selectable)) {
                that.selectable = options.selectable;
            }

            if (!$.isEmptyObject(options.sortable)) {
                that.sortable = options.sortable;
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
            var grid = $('#' + element.id).kendoGrid({
                pageable: that.pageable,
                columns: options.columns,
                dataSource: that.dataSource,
                sortable: that.sortable,
                selectable: that.selectable,
                dataBound: function (e) {
                    //把相關參數傳入
                    that.dataBound(that, element);
                    //dataBound 擴充事件
                    if (typeof that.options.dataBound == "function") {
                        that.options.dataBound();
                    }
                }
            }).data("kendoGrid");

            //row select
            grid.table.on("click", "input[ITSM-Control='Grid']", function (e) {
                //Grid Checkbox click 事件
                that.onGridCheck(this, that, element);
            });

            //Select All
            grid.thead.on("click", "input[ITSM-Control='Grid']", function () {
                var isSelectAll = this.checked;
                $(kendo.format('input[Grid-ID="{0}"]', element.id)).each(function (i, item) {
                    if (isSelectAll) {
                        if (item.checked && isSelectAll) {
                        } else {
                            $(item).click();
                        }
                    } else {
                        if (item.checked) {
                            $(item).click();
                        }
                    }
                });
            });
        }, dataBound: function (that, element) {
            //沒資料塞一列顯示"查無資料"
            var grid = $("#" + element.id).data("kendoGrid");
            if (grid.dataSource.view().length == 0) {
                var colCount = that.options.columns.length;
                $("#" + element.id).find('.k-grid-content tbody').append('<tr class="kendo-data-row"><td colspan="' +
                        colCount +
                        '" style="text-align:center"><b>查無資料!</b></td></tr>');
            }
            if (!that.checkOptions.enable) {
                return;
            }
            //找回之前已勾選的資料
            if ($.isEmptyObject(itsmGridCheckVal[element.id])) {
                itsmGridCheckVal[element.id] = {};
            }

            var view = this.dataSource.view();
            for (var i = 0; i < view.length; i++) {
                if (itsmGridCheckVal[element.id][view[i][that.options.checkOptions.key]]) {
                    grid.tbody.find("tr[data-uid='" + view[i].uid + "']")
                    .addClass("k-state-selected")
                    .find(".checkbox")
                    .attr("checked", "checked");
                }
            }
        },
        onGridCheck: function (e, that, element) {
            //紀錄點擊按鈕
            var checked = e.checked,
                gridId = element.id,
                 row = $(e).closest("tr"),
                 grid = $("#" + gridId).data("kendoGrid"),
                 dataItem = grid.dataItem(row);
            itsmGridCheckVal[gridId][dataItem[that.checkOptions.key]] = checked;
            if (checked) {
                //-select the row
                row.addClass("k-state-selected");
            } else {
                //-remove selection
                row.removeClass("k-state-selected");
            }
        },
        options: {
            name: "ExtGrid"
        }
    });
    kendoui.plugin(ExtGrid);

})