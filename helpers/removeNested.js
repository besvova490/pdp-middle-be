/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/* eslint-disable security/detect-object-injection */

function removeNested(obj, newObject = {}, deleteKeys = []) {
  for (const key in obj) {
    if (deleteKeys.some((item) => item === key)) continue;
    else if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
      removeNested(obj[key], newObject);
    } else {
      newObject[key] = obj[key];
    }
  }

  return newObject;
}

module.exports = removeNested;
