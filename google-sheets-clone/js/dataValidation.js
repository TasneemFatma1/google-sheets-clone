function trimData(data) {
    return data.map(item => item.trim());
}

function toUpperCase(data) {
    return data.map(item => item.toUpperCase());
}

function toLowerCase(data) {
    return data.map(item => item.toLowerCase());
}

function removeDuplicates(data) {
    return [...new Set(data)];
}

function findAndReplace(data, find, replace) {
    return data.map(item => item.replace(new RegExp(find, 'g'), replace));
}

export { trimData, toUpperCase, toLowerCase, removeDuplicates, findAndReplace };