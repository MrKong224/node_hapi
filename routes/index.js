const basic =  require('./basic.js');
const path1 =  require('./path1.js');
const path2 =  require('./path2.js');

module.exports = [].concat(basic.totalRoutes, path1, path2);