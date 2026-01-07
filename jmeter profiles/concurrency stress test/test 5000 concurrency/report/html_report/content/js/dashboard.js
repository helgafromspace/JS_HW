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

    var data = {"OkPercent": 97.66855033821615, "KoPercent": 2.331449661783849};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8154225698362744, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9993638816381144, 500, 1500, "Delete hero"], "isController": false}, {"data": [0.9992652622575091, 500, 1500, "Change hero"], "isController": false}, {"data": [0.9225749923810354, 500, 1500, "Get hero by id"], "isController": false}, {"data": [0.1963088120613465, 500, 1500, "Get all heros"], "isController": false}, {"data": [0.9925111483636284, 500, 1500, "Create hero"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 461687, 10764, 2.331449661783849, 1077.6620459315418, 0, 168227, 4.0, 15001.0, 18206.0, 45131.81000000003, 2298.070701137868, 4419.05635952946, 411.84251214522504], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Delete hero", 91178, 58, 0.06361183618855426, 2.924938033297506, 0, 15001, 1.0, 10.0, 15.0, 25.0, 739.2171487871319, 211.60887880136045, 155.92386688853938], "isController": false}, {"data": ["Change hero", 91189, 67, 0.07347377424908706, 6.7996359209992665, 0, 24327, 1.0, 11.0, 16.0, 28.0, 734.3587678679283, 195.3439182982686, 167.78907193728608], "isController": false}, {"data": ["Get hero by id", 91876, 960, 1.0448865862684489, 483.3797292002264, 0, 144249, 2.0, 1679.0, 6707.900000000089, 15004.0, 506.43265828087624, 142.33324422052937, 62.64262642075207], "isController": false}, {"data": ["Get all heros", 96175, 9595, 9.976605146867689, 4658.331354302077, 32, 168227, 3109.0, 15001.0, 21223.0, 46545.98, 478.7159908811261, 3916.0543614315065, 53.44869249061732], "isController": false}, {"data": ["Create hero", 91269, 84, 0.09203563093711994, 46.3443337825547, 0, 43202, 1.0, 10.0, 16.0, 1701.9900000000016, 702.8640077626239, 191.56105997021632, 158.41030789382992], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 9374, 87.08658491267187, 2.030379889405593], "isController": false}, {"data": ["404/Not Found", 111, 1.0312151616499443, 0.0240422623985514], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 1279, 11.882199925678187, 0.2770275099797049], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 461687, 10764, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 9374, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 1279, "404/Not Found", 111, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Delete hero", 91178, 58, "404/Not Found", 56, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["Change hero", 91189, 67, "404/Not Found", 55, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 11, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 1, "", "", "", ""], "isController": false}, {"data": ["Get hero by id", 91876, 960, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 856, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 104, "", "", "", "", "", ""], "isController": false}, {"data": ["Get all heros", 96175, 9595, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 8430, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 1165, "", "", "", "", "", ""], "isController": false}, {"data": ["Create hero", 91269, 84, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 75, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:3001 failed to respond", 9, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
