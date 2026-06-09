import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function DashboardLineChart() {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 10, 10, 0.8)',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      padding: 12,
      textStyle: { color: '#e2e8f0', fontFamily: 'SF Pro Display' }
    },
    grid: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 20,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: Array.from({ length: 30 }, (_, i) => i + 1),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
          color: '#64748b',
          fontSize: 10,
          fontFamily: 'SF Pro Display'
      }
    },
    yAxis: {
      scale: true,
      position: 'right',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
          color: '#64748b',
          fontSize: 10,
          fontFamily: 'SF Pro Display'
      },
      splitLine: {
        lineStyle: {
            color: 'rgba(255,255,255,0.03)',
            type: 'dashed'
        }
      }
    },
    series: [
      {
        type: 'candlestick',
        barWidth: '50%',
        data: [
          [120, 130, 90, 140],
          [130, 110, 100, 150],
          [110, 125, 95, 135],
          [125, 105, 90, 140],
          [105, 115, 95, 120],
          [115, 140, 110, 150],
          [140, 135, 120, 145],
          [135, 125, 115, 140]
        ],
        itemStyle: {
          color: '#10b981',
          color0: '#f43f5e',
          borderColor: '#10b981',
          borderColor0: '#f43f5e',
          borderWidth: 1.5
        }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />;
}

