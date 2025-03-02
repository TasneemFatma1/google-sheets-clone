import { sum, average, max, min, count } from './mathFunctions.js';
import { trimData, toUpperCase, toLowerCase, removeDuplicates, findAndReplace } from './dataValidation.js';

document.addEventListener('DOMContentLoaded', () => {
  const spreadsheetUI = new SpreadsheetUI();
  spreadsheetUI.init();
});

class SpreadsheetUI {
  constructor() {
    // Initialize a 100×26 grid (rows×columns) for cell data.
    this.data = [];
    this.currentCell = null;
  }

  init() {
    this.createGrid();
    this.addUIEventListeners();
    this.addFormulaListener();
    this.setupDataQualityListeners();
    this.setupFormatAndSaveListeners();
  }

  createGrid() {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = '';
    
    // Create table element
    const table = document.createElement('table');
    table.className = 'spreadsheet-table';

    // Create table header row (first cell blank then A, B, C...)
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const cornerTh = document.createElement('th');
    headerRow.appendChild(cornerTh);  // blank top-left cell

    for (let j = 0; j < 26; j++) {
      const th = document.createElement('th');
      th.innerText = String.fromCharCode(65 + j);
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body with row numbers
    const tbody = document.createElement('tbody');
    for (let i = 0; i < 100; i++) {
      const tr = document.createElement('tr');

      // Row header with numbering
      const rowHeader = document.createElement('th');
      rowHeader.innerText = (i + 1).toString();
      tr.appendChild(rowHeader);

      this.data[i] = [];
      for (let j = 0; j < 26; j++) {
        const td = document.createElement('td');
        td.className = 'cell';
        td.contentEditable = true;
        td.dataset.row = i;
        td.dataset.col = j;
        td.addEventListener('focus', (e) => this.selectCell(e.target));
        tr.appendChild(td);
        this.data[i][j] = '';
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    gridContainer.appendChild(table);
  }

  selectCell(cell) {
    if (this.currentCell) {
      this.currentCell.classList.remove('selected');
    }
    this.currentCell = cell;
    this.currentCell.classList.add('selected');
    this.updateFormulaBar();
  }

  updateFormulaBar() {
    const formulaBar = document.getElementById('formula-bar');
    formulaBar.value = this.currentCell?.innerText || '';
  }

  evaluateFormula(formula) {
    // [formula evaluation code from previous version...]
    const funcPattern = /^=([A-Z]+)\(([^:]+):([^)]+)\)$/i;
    const match = formula.match(funcPattern);
    
    if (match) {
      const funcName = match[1].toUpperCase();
      const startRef = match[2].trim().toUpperCase();
      const endRef = match[3].trim().toUpperCase();
      
      // Convert cell references to indices.
      const colIndex = ref => ref.charCodeAt(0) - 65;
      const rowIndex = ref => parseInt(ref.slice(1), 10) - 1;
      const startCol = colIndex(startRef);
      const startRow = rowIndex(startRef);
      const endCol = colIndex(endRef);
      const endRow = rowIndex(endRef);
      
      let values = [];
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
          if (cell) {
            values.push(parseFloat(cell.innerText) || 0);
          }
        }
      }
      switch (funcName) {
        case 'SUM': return sum(values);
        case 'AVG':
        case 'AVERAGE': return average(values);
        case 'MAX': return max(values);
        case 'MIN': return min(values);
        case 'COUNT': return count(values);
        default: return 'ERROR: Unknown function';
      }
    } else {
      // Fallback for a simple addition expressed as "=A1+B1"
      formula = formula.slice(1);
      const parts = formula.split('+');
      if (parts.length !== 2) return formula;
      const getValueFromRef = (ref) => {
        ref = ref.trim().toUpperCase();
        const col = ref.charCodeAt(0) - 65;
        const row = parseInt(ref.slice(1), 10) - 1;
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        return cell ? parseFloat(cell.innerText) || 0 : 0;
      };
      return getValueFromRef(parts[0]) + getValueFromRef(parts[1]);
    }
  }
  
  addFormulaListener() {
    const formulaBar = document.getElementById('formula-bar');
    formulaBar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.currentCell) {
        e.preventDefault();
        const val = e.target.value;
        if (val.startsWith('=')) {
          const result = this.evaluateFormula(val);
          this.currentCell.innerText = result;
          const row = this.currentCell.dataset.row;
          const col = this.currentCell.dataset.col;
          this.data[row][col] = result;
        } else {
          this.currentCell.innerText = val;
          const row = this.currentCell.dataset.row;
          const col = this.currentCell.dataset.col;
          this.data[row][col] = val;
        }
      }
    });
  }

  addUIEventListeners() {
    document.getElementById('addRow').addEventListener('click', () => this.addRow());
    document.getElementById('addColumn').addEventListener('click', () => this.addColumn());
    document.getElementById('deleteRow').addEventListener('click', () => this.deleteRow());
    document.getElementById('deleteColumn').addEventListener('click', () => this.deleteColumn());
  }

  addRow() {
    const tableBody = document.querySelector('#grid table tbody');
    const newRowIndex = this.data.length;
    const tr = document.createElement('tr');
    const rowHeader = document.createElement('th');
    rowHeader.innerText = (newRowIndex + 1).toString();
    tr.appendChild(rowHeader);
    const newRow = [];
    const colCount = document.querySelector('#grid table thead tr').children.length - 1;
    for (let j = 0; j < colCount; j++) {
      const td = document.createElement('td');
      td.className = 'cell';
      td.contentEditable = true;
      td.dataset.row = newRowIndex;
      td.dataset.col = j;
      td.addEventListener('focus', (e) => this.selectCell(e.target));
      tr.appendChild(td);
      newRow.push('');
    }
    this.data.push(newRow);
    tableBody.appendChild(tr);
  }

  addColumn() {
    const headerRow = document.querySelector('#grid table thead tr');
    const currentColumns = headerRow.children.length - 1;
    const th = document.createElement('th');
    th.innerText = String.fromCharCode(65 + currentColumns);
    headerRow.appendChild(th);
    
    const tbodyRows = document.querySelectorAll('#grid table tbody tr');
    tbodyRows.forEach((tr, i) => {
      const td = document.createElement('td');
      td.className = 'cell';
      td.contentEditable = true;
      td.dataset.row = i;
      td.dataset.col = currentColumns;
      td.addEventListener('focus', (e) => this.selectCell(e.target));
      tr.appendChild(td);
      this.data[i].push('');
    });
  }

  deleteRow() {
    if (this.data.length === 0) return;
    const tableBody = document.querySelector('#grid table tbody');
    tableBody.removeChild(tableBody.lastElementChild);
    this.data.pop();
  }

  deleteColumn() {
    const headerRow = document.querySelector('#grid table thead tr');
    const currentColumns = headerRow.children.length - 1;
    if (currentColumns === 0) return;
    headerRow.removeChild(headerRow.lastElementChild);
    const tbodyRows = document.querySelectorAll('#grid table tbody tr');
    tbodyRows.forEach((tr, i) => {
      tr.removeChild(tr.lastElementChild);
      this.data[i].pop();
    });
  }
  
  setupDataQualityListeners() {
    // Existing data quality functions (TRIM, UPPER, etc.)
    document.getElementById('trimCell').addEventListener('click', () => {
      if (this.currentCell) {
        const original = this.currentCell.innerText;
        const trimmed = trimData([original])[0];
        this.currentCell.innerText = trimmed;
        const row = this.currentCell.dataset.row;
        const col = this.currentCell.dataset.col;
        this.data[row][col] = trimmed;
      }
    });
    document.getElementById('upperCell').addEventListener('click', () => {
      if (this.currentCell) {
        const original = this.currentCell.innerText;
        const uppered = toUpperCase([original])[0];
        this.currentCell.innerText = uppered;
        const row = this.currentCell.dataset.row;
        const col = this.currentCell.dataset.col;
        this.data[row][col] = uppered;
      }
    });
    document.getElementById('lowerCell').addEventListener('click', () => {
      if (this.currentCell) {
        const original = this.currentCell.innerText;
        const lowered = toLowerCase([original])[0];
        this.currentCell.innerText = lowered;
        const row = this.currentCell.dataset.row;
        const col = this.currentCell.dataset.col;
        this.data[row][col] = lowered;
      }
    });
    document.getElementById('removeDuplicates').addEventListener('click', () => {
      const rangeInput = prompt('Enter range to remove duplicates e.g., A1:B5');
      if (!rangeInput) return;
      const parts = rangeInput.split(':');
      if (parts.length !== 2) {
        alert('Invalid range format'); return;
      }
      const [startRef, endRef] = parts.map(r => r.trim().toUpperCase());
      const colIndex = ref => ref.charCodeAt(0) - 65;
      const rowIndex = ref => parseInt(ref.slice(1), 10) - 1;
      const startCol = colIndex(startRef);
      const startRow = rowIndex(startRef);
      const endCol = colIndex(endRef);
      const endRow = rowIndex(endRef);
      const rowEls = [];
      for (let r = startRow; r <= endRow; r++) {
        let cells = [];
        for (let c = startCol; c <= endCol; c++) {
          const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
          if (cell) cells.push(cell);
        }
        rowEls.push({ row: r, cells });
      }
      const seen = new Set();
      rowEls.forEach(({ cells }) => {
        const key = cells.map(cell => cell.innerText).join('|');
        if (seen.has(key)) {
          cells.forEach(cell => {
            cell.innerText = '';
            this.data[cell.dataset.row][cell.dataset.col] = '';
          });
        } else {
          seen.add(key);
        }
      });
    });
    document.getElementById('findAndReplace').addEventListener('click', () => {
      const findText = document.getElementById('findText').value;
      const replaceText = document.getElementById('replaceText').value;
      if (!findText) {
        alert('Please enter text to find.');
        return;
      }
      const rangeInput = prompt('Enter range for Find & Replace e.g., A1:B5');
      if (!rangeInput) return;
      const parts = rangeInput.split(':');
      if (parts.length !== 2) {
        alert('Invalid range format');
        return;
      }
      const [startRef, endRef] = parts.map(r => r.trim().toUpperCase());
      const colIndex = ref => ref.charCodeAt(0) - 65;
      const rowIndex = ref => parseInt(ref.slice(1), 10) - 1;
      const startCol = colIndex(startRef);
      const startRow = rowIndex(startRef);
      const endCol = colIndex(endRef);
      const endRow = rowIndex(endRef);
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
          if (cell) {
            const updated = findAndReplace([cell.innerText], findText, replaceText)[0];
            cell.innerText = updated;
            this.data[r][c] = updated;
          }
        }
      }
    });
  }
  
  setupFormatAndSaveListeners() {
    // Formatting buttons
    document.getElementById('boldCell').addEventListener('click', () => {
      if (this.currentCell) {
        // Toggle bold style.
        if (this.currentCell.style.fontWeight === 'bold') {
          this.currentCell.style.fontWeight = 'normal';
        } else {
          this.currentCell.style.fontWeight = 'bold';
        }
      }
    });
    document.getElementById('italicCell').addEventListener('click', () => {
      if (this.currentCell) {
        // Toggle italic style.
        if (this.currentCell.style.fontStyle === 'italic') {
          this.currentCell.style.fontStyle = 'normal';
        } else {
          this.currentCell.style.fontStyle = 'italic';
        }
      }
    });
    document.getElementById('underlineCell').addEventListener('click', () => {
      if (this.currentCell) {
        // Toggle underline style.
        if (this.currentCell.style.textDecoration === 'underline') {
          this.currentCell.style.textDecoration = 'none';
        } else {
          this.currentCell.style.textDecoration = 'underline';
        }
      }
    });
    // Save spreadsheet data to localStorage.
    document.getElementById('saveSheet').addEventListener('click', () => {
        const dataStr = JSON.stringify(this.data);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'spreadsheet.json';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
        alert('Spreadsheet saved and file downloaded.');
      });
    // Load spreadsheet data from localStorage.
        document.getElementById('loadSheet').addEventListener('click', () => {
      // Create a hidden file input element.
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.style.display = 'none';
      
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const loadedData = JSON.parse(reader.result);
            this.data = loadedData;
            this.redrawGrid();
            alert('Spreadsheet loaded successfully.');
          } catch (error) {
            alert('Error loading file. Please ensure it is a valid spreadsheet JSON.');
          }
        };
        reader.readAsText(file);
      });
      
      // Simulate click on file input to open dialog.
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    });
  }
  
  // Redraw grid helper: rebuilds table from this.data.
  redrawGrid() {
    const gridContainer = document.getElementById('grid');
    gridContainer.innerHTML = '';
    const table = document.createElement('table');
    table.className = 'spreadsheet-table';
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.appendChild(document.createElement('th'));
    const colCount = this.data[0] ? this.data[0].length : 0;
    for (let j = 0; j < colCount; j++) {
      const th = document.createElement('th');
      th.innerText = String.fromCharCode(65 + j);
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    for (let i = 0; i < this.data.length; i++) {
      const tr = document.createElement('tr');
      const rowHeader = document.createElement('th');
      rowHeader.innerText = (i + 1).toString();
      tr.appendChild(rowHeader);
      for (let j = 0; j < colCount; j++) {
        const td = document.createElement('td');
        td.className = 'cell';
        td.contentEditable = true;
        td.dataset.row = i;
        td.dataset.col = j;
        td.innerText = this.data[i][j];
        td.addEventListener('focus', (e) => this.selectCell(e.target));
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    gridContainer.appendChild(table);
  }
}