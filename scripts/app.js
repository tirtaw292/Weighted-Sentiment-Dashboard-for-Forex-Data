let data = [];

function hitungSentimen(actual, consensus, previous, revisi) {
  const aVsC = actual - consensus;
  const aVsP = actual - previous;
  const weightedScore = (aVsC * 0.5) + (aVsP * 0.3) + (revisi * 0.2);
  return weightedScore >= 0 ? "Positif" : "Negatif";
}

function tambahData() {
  const newData = {
    id: Date.now(),
    tanggal: document.getElementById('tanggal').value,
    negara: document.getElementById('negara').value,
    jenis_news: document.getElementById('jenis-news').value,
    consensus: parseFloat(document.getElementById('consensus').value),
    actual: parseFloat(document.getElementById('actual').value),
    previous: parseFloat(document.getElementById('previous').value),
    revisi: parseFloat(document.getElementById('revisi').value || 0),
    sentimen: hitungSentimen(
      parseFloat(document.getElementById('actual').value),
      parseFloat(document.getElementById('consensus').value),
      parseFloat(document.getElementById('previous').value),
      parseFloat(document.getElementById('revisi').value || 0)
    )
  };
  data.push(newData);
  updateTable();
  updateChart();
}

function updateTable() {
  const tableBody = document.querySelector('#data-table tbody');
  tableBody.innerHTML = data.map(item => `
    <tr>
      <td>${item.tanggal}</td>
      <td>${item.negara}</td>
      <td>${item.jenis_news}</td>
      <td>${item.consensus}</td>
      <td>${item.actual}</td>
      <td>${item.previous}</td>
      <td>${item.revisi}</td>
      <td class="${item.sentimen.toLowerCase()}">${item.sentimen}</td>
      <td>
        <button onclick="editData(${item.id})">Edit</button>
        <button onclick="hapusData(${item.id})">Hapus</button>
      </td>
    </tr>
  `).join('');
}

function editData(id) {
  const item = data.find(d => d.id === id);
  if (!item) return;
  document.getElementById('tanggal').value = item.tanggal;
  document.getElementById('negara').value = item.negara;
  document.getElementById('jenis-news').value = item.jenis_news;
  document.getElementById('consensus').value = item.consensus;
  document.getElementById('actual').value = item.actual;
  document.getElementById('previous').value = item.previous;
  document.getElementById('revisi').value = item.revisi;
  hapusData(id);
}

function hapusData(id) {
  data = data.filter(d => d.id !== id);
  updateTable();
  updateChart();
}

function exportExcel() {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sentimen Data");
  XLSX.writeFile(wb, "sentimen-forex.xlsx");
}

function importExcel() {
  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];
  if (!file) return alert("Pilih file Excel terlebih dahulu!");

  const reader = new FileReader();
  reader.onload = function(e) {
    const dataExcel = new Uint8Array(e.target.result);
    const workbook = XLSX.read(dataExcel, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
    data = jsonData;
    updateTable();
    updateChart();
  };
  reader.readAsArrayBuffer(file);
}
