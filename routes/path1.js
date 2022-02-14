const Boom = require('@hapi/boom');

function validatePayload(payload) {
  let flg = true;

  const levels = Object.keys(payload).map(lv => +lv);

  if (!levels.includes(0)) {
    flg = false;
    return flg;
  }

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    const dataList = payload[level];
    const incorrectData = dataList.filter(d => d.level !== level);
    if (incorrectData.length > 0) {
      flg = false;
      break;
    }
  }
  
  return flg;
}

module.exports = {
  method: 'POST',
  path: '/path1',
  handler: async (req, h) => {

    const payload = req.payload;
    if (!validatePayload(payload)) {
      console.log('!!!! Payload is incorrect format !!!!');
      console.log(JSON.stringify(payload));
      throw Boom.badData(`Level is incorrect format`);
    }

    let newJsonFormat = [];

    // Get keys level and orderby desc
    const levels = Object.keys(payload).map(lv => +lv);
    levels.sort((a, b) => b - a);

    levels.forEach(level => {
      const parentList = payload[level];
      if (newJsonFormat.length === 0) {
        newJsonFormat.push(...parentList);
      } else {   
        const childrenList = newJsonFormat;
        childrenList.forEach(child => {
          const parent = parentList.find(p => p.id === child.parent_id);
          if (parent) {
            parent.children.push(child);
          } else {
            console.log('!!!! Error not found parent !!!!');
            console.log('Error data : ', child);
            throw Boom.badData(`Data id ${child.id} not found parent [patent_id: ${child.parent_id}]. Please check your data`);
          }
        })
        newJsonFormat = parentList;   
      }

      if (level === 0) {
        const cntParentId = parentList.filter(p => !!p.parent_id)
        if (cntParentId.length > 0) {
          console.log('!!!! Error root parent is incorrect !!!!');
          console.log('Error data : ', cntParentId);
          throw Boom.badData(`There are some data at level 0 is incorrect. Please check your data`);
        }
      }
    })

    return newJsonFormat;

  }
};