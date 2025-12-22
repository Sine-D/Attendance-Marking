import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Export attendance data to PDF
 */
export const exportToPDF = (data, title = 'Attendance Report', fileName = 'attendance_report.pdf') => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 14, 22);

  // Add date
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  // Prepare table data
  const tableColumn = ["Sr. No.", "Employee Name", "ID", "Clock-in", "Clock-out", "Status"];
  const tableRows = [];

  data.forEach((emp, index) => {
    const rowData = [
      index + 1,
      emp.name || emp.data?.name || 'Unknown',
      emp.rollNumber || emp.data?.rollNumber || 'N/A',
      emp.checkin || emp.data?.checkin || '-',
      emp.checkout || emp.data?.checkout || '-',
      emp.status || (emp.data?.checkout ? 'Present' : 'Absent')
    ];
    tableRows.push(rowData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    theme: 'grid',
    headStyles: { fillColor: [102, 126, 234] }, // Matches app theme color
  });

  doc.save(fileName);
};

/**
 * Export attendance data to CSV (browser native)
 */
export const exportToCSV = (data, fileName = 'attendance_report.csv') => {
  // Prepare CSV content
  const headers = ['Sr. No.', 'Employee ID', 'Name', 'Clock-in', 'Clock-out', 'Status', 'Date'];
  const rows = data.map((emp, index) => [
    index + 1,
    emp.rollNumber || emp.data?.rollNumber || 'N/A',
    emp.name || emp.data?.name || 'Unknown',
    emp.checkin || emp.data?.checkin || '-',
    emp.checkout || emp.data?.checkout || '-',
    emp.status || (emp.data?.checkout ? 'Present' : 'Absent'),
    emp.date || new Date().toLocaleDateString()
  ]);

  // Create CSV string
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Print report (opens browser print dialog)
 */
export const printReport = (data, title = 'Attendance Report') => {
  const totalEmployees = data.length;
  const presentCount = data.filter(emp => emp.status === 'Present' || emp.checkout || emp.data?.checkout).length;
  const absentCount = totalEmployees - presentCount;
  const attendanceRate = totalEmployees > 0 ? ((presentCount / totalEmployees) * 100).toFixed(1) : 0;

  // Create print window content
  const printWindow = window.open('', '_blank');
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #667eea; text-align: center; }
        .summary { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 8px; }
        .summary-item { display: inline-block; margin-right: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #667eea; color: white; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .present { color: green; font-weight: bold; }
        .absent { color: red; font-weight: bold; }
        @media print {
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="summary">
        <div class="summary-item"><strong>Total Employees:</strong> ${totalEmployees}</div>
        <div class="summary-item"><strong>Present:</strong> ${presentCount} (${attendanceRate}%)</div>
        <div class="summary-item"><strong>Absent:</strong> ${absentCount}</div>
        <div class="summary-item"><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Clock-in</th>
            <th>Clock-out</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${data.map((emp, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${emp.rollNumber || emp.data?.rollNumber || 'N/A'}</td>
              <td>${emp.name || emp.data?.name || 'Unknown'}</td>
              <td>${emp.checkin || emp.data?.checkin || '-'}</td>
              <td>${emp.checkout || emp.data?.checkout || '-'}</td>
              <td class="${emp.data?.checkout ? 'present' : 'absent'}">
                ${emp.data?.checkout ? 'Present' : 'Absent'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="margin-top: 20px; text-align: center;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Report</button>
        <button onclick="window.close()" style="padding: 10px 20px; background: #999; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Close</button>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

/**
 * Format raw attendance data for reports
 */
export const formatReportData = (rawData) => {
  return rawData.map(item => ({
    id: item.id || item._id,
    rollNumber: item.data?.rollNumber || item.rollNumber,
    name: item.data?.name || item.name,
    checkin: item.data?.checkin || item.checkin,
    checkout: item.data?.checkout || item.checkout,
    status: item.data?.checkout || item.checkout ? 'Present' : 'Absent',
    date: item.data?.date || item.date || new Date().toISOString().split('T')[0]
  }));
};

/**
 * Get date range string
 */
export const getDateRangeString = (startDate, endDate) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!startDate && !endDate) {
    return formatDate(new Date());
  }

  if (startDate && !endDate) {
    return formatDate(startDate);
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

/**
 * Get date N days ago
 */
export const getDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

/**
 * Get start of month
 */
export const getStartOfMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
};

/**
 * Get end of month
 */
export const getEndOfMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
};

/**
 * Format date
 */
export const formatDate = (date, formatStr = 'MMM dd') => {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (formatStr === 'MMM dd') {
    return `${months[d.getMonth()]} ${d.getDate()}`;
  }

  return d.toLocaleDateString();
};
