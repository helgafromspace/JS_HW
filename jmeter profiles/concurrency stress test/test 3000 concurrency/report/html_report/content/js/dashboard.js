/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.07583860986455, "KoPercent": 0.9241613901354481};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8494344378188972, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9999381117907353, 500, 1500, "Delete hero"], "isController": false}, {"data": [0.9999381130674259, 500, 1500, "Change hero"], "isController": false}, {"data": [0.9696126343947734, 500, 1500, "Get hero by id"], "isController": false}, {"data": [0.295708768559651, 500, 1500, "Get all heros"], "isController": false}, {"data": [0.9987676219744862, 500, 1500, "Create hero"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 488010, 4510, 0.9241613901354481, 604.292875145992, 0, 51213, 2.0, 4770.700000000135, 15000.0, 24203.99, 3328.6950827723094, 1435.72543885396, 602.1352805139761], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete hero", 96949, 6, 0.006188820926466492, 1.9653219734087106, 0, 128, 1.0, 2.0, 7.0, 17.0, 805.2710705771931, 230.42085185340926, 169.07834848683063], "isController": false}, {"data": ["Change hero", 96951, 6, 0.006188693257418696, 2.268279852709086, 0, 9946, 1.0, 2.0, 9.0, 17.0, 805.040272357386, 213.06292426098148, 183.18098752906252], "isController": false}, {"data": ["Get hero by id", 97195, 186, 0.19136786871752662, 141.02945624774858, 0, 45206, 2.0, 10.0, 827.8500000000022, 7637.990000000002, 663.4606852017447, 173.85849571578257, 82.77387932858693], "isController": false}, {"data": ["Get all heros", 99948, 4305, 4.307239764677632, 2801.008594469131, 0, 51213, 1593.0, 15000.0, 15001.0, 25648.980000000003, 706.3063572377533, 745.2974445349379, 83.82546310323444], "isController": false}, {"data": ["Create hero", 96967, 7, 0.007218950777068487, 8.538502789608865, 0, 21206, 1.0, 3.0, 7.0, 18.0, 728.41796875, 196.45338792067307, 164.3089881310096], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3982, 88.29268292682927, 0.8159668859244688], "isController": false}, {"data": ["404/Not Found", 12, 0.2660753880266075, 0.002458966004794984], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 516, 11.441241685144124, 0.1057355382061843], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 488010, 4510, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3982, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 516, "404/Not Found", 12, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Delete hero", 96949, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Change hero", 96951, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get hero by id", 97195, 186, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 162, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 24, "", "", "", "", "", ""], "isController": false}, {"data": ["Get all heros", 99948, 4305, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 3813, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 492, "", "", "", "", "", ""], "isController": false}, {"data": ["Create hero", 96967, 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 7, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
