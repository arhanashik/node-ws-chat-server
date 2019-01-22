/* 
* This module is for providing filtering support to html contents
*/ 

function filter(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
}

module.exports = {
    filter: filter
}