function sum(range) {
    return range.reduce((acc, val) => acc + (parseFloat(val) || 0), 0);
}

function average(range) {
    const total = sum(range);
    const count = range.filter(val => !isNaN(val)).length;
    return count > 0 ? total / count : 0;
}

function max(range) {
    return Math.max(...range.map(val => parseFloat(val) || -Infinity));
}

function min(range) {
    return Math.min(...range.map(val => parseFloat(val) || Infinity));
}

function count(range) {
    return range.filter(val => !isNaN(val)).length;
}

export { sum, average, max, min, count };