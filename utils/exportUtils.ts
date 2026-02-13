
import { Contact } from '../types';

export const exportToCSV = (contacts: Contact[]) => {
  const headers = ['Name', 'Title', 'Company', 'Email', 'Phone', 'Website', 'Address', 'LinkedIn', 'Notes'];
  
  const csvContent = [
    headers.join(','),
    ...contacts.map(c => {
      // Create data row strictly following headers order
      const rowData = [
        c.name,
        c.title,
        c.company,
        c.email,
        c.phone,
        c.website,
        c.address,
        c.linkedin,
        c.notes
      ];
      
      return rowData.map(val => {
        // Ensure everything is a string, handle null/undefined, and escape quotes
        const strVal = String(val || '').trim();
        // Replace internal double quotes with two double quotes for CSV standard
        const escaped = strVal.replace(/"/g, '""');
        // Wrap the final value in double quotes to handle commas or newlines
        return `"${escaped}"`;
      }).join(',');
    })
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `bizcards_export_${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
