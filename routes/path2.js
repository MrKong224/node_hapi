const axios = require('axios');

const getPageNav = (headerLink) => {
  let result = { first: null, last: null, next: null, prev: null };

  const arrayLink = (headerLink).split(',').map(d => d.trim())
  arrayLink.forEach(link => {
    const urlLink = link.split(';').map(d => d.trim());
    
    // find rel type
    const relType = urlLink[1];

    // find page number
    const pageNumber = urlLink[0].substring(urlLink[0].indexOf('&page=') + 6, urlLink[0].length - 1)

    // Set result value
    const url = `http://localhost:3000/path2/${pageNumber}`
    if (relType === 'rel="first"') {
      result.first = pageNumber ? url : '#'
    } else if (relType === 'rel="last"') {
      result.last = pageNumber ? url : '#'
    } else if (relType === 'rel="next"') {
      result.next = pageNumber ? url : '#'
    } else if (relType === 'rel="prev"') {
      result.prev = pageNumber ? url : '#'
    }
  })
  return result;
}

module.exports = {
  method: 'GET',
  path: '/path2/{pageNo?}',
  handler: async (req, h) => {
    const pageNo = req.params.pageNo || 1;
    try {
      const respGithub = await axios({
        method: 'GET',
        url: `https://api.github.com/search/repositories?q=nodejs&per_page=10&page=${pageNo}`,
      });
      if (respGithub.status !== 200) {
        console.log('!!!! Error during call github api !!!!');
        console.log('Error data : ', respGithub.statusText);
        throw Boom.badData(respGithub);
      }
      
      const headerLink = getPageNav(respGithub.headers.link)
      return h.view('./index', {
        curPage: pageNo,
        cntRecords: respGithub.data.items.length,
        tableHeader: Object.keys(respGithub.data.items[0]),
        searchResult: respGithub.data.items,
        navigate: headerLink,
      });
    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        console.log(error);
        throw Boom.badData(error.message);
      } else {
        console.log(error.response.data);
        throw Boom.badData(JSON.stringify(error.response.data));
      }
    }
  }
};