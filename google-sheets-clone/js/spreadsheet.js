// This file contains the logic for managing the spreadsheet data. 
// It includes functions for adding, deleting, and resizing rows and columns, 
// as well as handling cell dependencies and updating formulas.

class Spreadsheet {
    constructor(rows = 20, cols = 10) {
        this.rows = rows;
        this.cols = cols;
        this.data = this.createEmptySpreadsheet();
    }

    createEmptySpreadsheet() {
        const data = [];
        for (let i = 0; i < this.rows; i++) {
            const row = new Array(this.cols).fill('');
            data.push(row);
        }
        return data;
    }

    getCell(row, col) {
        return this.data[row] ? this.data[row][col] : undefined;
    }

    setCell(row, col, value) {
        if (this.data[row]) {
            this.data[row][col] = value;
        }
    }

    addRow() {
        this.data.push(new Array(this.cols).fill(''));
        this.rows++;
    }

    deleteRow(row) {
        if (row >= 0 && row < this.rows) {
            this.data.splice(row, 1);
            this.rows--;
        }
    }

    addColumn() {
        this.data.forEach(row => row.push(''));
        this.cols++;
    }

    deleteColumn(col) {
        if (col >= 0 && col < this.cols) {
            this.data.forEach(row => row.splice(col, 1));
            this.cols--;
        }
    }

    resize(rows, cols) {
        while (this.rows < rows) {
            this.addRow();
        }
        while (this.rows > rows) {
            this.deleteRow(this.rows - 1);
        }
        while (this.cols < cols) {
            this.addColumn();
        }
        while (this.cols > cols) {
            this.deleteColumn(this.cols - 1);
        }
    }

    updateFormula(row, col, formula) {
        // Logic to handle formula updates and dependencies can be added here
        this.setCell(row, col, formula);
    }
}

const spreadsheet = new Spreadsheet();