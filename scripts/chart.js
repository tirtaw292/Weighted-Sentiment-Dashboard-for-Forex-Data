function updateChart() {
  const ctx = document.getElementById('sentimentChart').getContext('2d');
  const currencies = [...new Set(data.map(item => item.negara))];
  const currencyData = currencies.map(currency => {
    const items = data.filter(item => item.negara === currency);
    const positif = items.filter(item => item.sentimen === "Positif").length;
    const negatif = items.filter(item => item.sentimen === "Negatif").length;
    return { currency, positif, negatif };
  });

  if (window.sentimentChart) window.sentimentChart.destroy();

  window.sentimentChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: currencies,
      datasets: [
        {
          label: 'Positif',
          data: currencyData.map(d => d.positif),
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
        },
        {
          label: 'Negatif',
          data: currencyData.map(d => d.negatif),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
