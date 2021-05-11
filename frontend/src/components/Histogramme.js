import React from "react";
import 'chartjs-node';

const ChartjsNode = require('chartjs-node');

export default async function Histogramme(dataHisto) {
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
            type: 'bar',
            data: dataHisto
        }
        );
    return myChart;
}