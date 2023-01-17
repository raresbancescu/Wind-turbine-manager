  function createRedGreenChart(
  chartLabels,
  dataSetLabel,
  chartData,
  ctx,
  title,
  x,
  y,
  isAsccendingGreen
  ) {
  let asccending, desccending

  if (isAsccendingGreen) {
    asccending = 'rgba(98, 175, 68, 0.9)'
    desccending = 'rgba(171, 5, 1, 0.9)'
  } else {
    asccending = 'rgba(171, 5, 1, 0.9)'
    desccending = 'rgba(98, 175, 68, 0.9)'
  }
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: dataSetLabel,
          data: chartData,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title,
        },
        legend: {
          display: false,
        },
        decimation: {
          enabled: true,
          algorithm: 'lttb',
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: x,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: y,
          },
        },
      },
      datasets: {
        bar: {
          borderColor: (context) => {
            var index = context.dataIndex
            var value = context.dataset.data[index]
            if (index === 0) return asccending
            else {
              return value >= context.dataset.data[index - 1]
                ? asccending
                : desccending
            }
          },
          backgroundColor: (context) => {
            var index = context.dataIndex
            var value = context.dataset.data[index]
            if (index === 0) return asccending.replace('0.9', '0.8')
            else {
              return value >= context.dataset.data[index - 1]
                ? asccending.replace('0.9', '0.8')
                : desccending.replace('0.9', '0.8')
            }
          },
        },
      },
    },
  })
  return chart
  }

  function createCumulativeChart(
  chartLabels,
  dataSetLabel,
  chartData,
  ctx,
  title,
  x,
  y,
  backgroundColor,
  borderColor,
  fillColor
  ) {
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: dataSetLabel,
          data: chartData,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          fill: {
            target: 'origin',
            above: fillColor,
          },
          cubicInterpolationMode: 'monotone',
          pointRadius: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: title,
        },
        decimation: {
          enabled: true,
          algorithm: 'lttb',
        },
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: x,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: y,
          },
        },
      },
    },
  })
  return chart
  }
