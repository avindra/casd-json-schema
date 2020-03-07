const hasNoSuffix = category => {
  switch(category) {
    case 'request':
    case 'problem-category':
    case 'relational-information':
      return true;
  }

  return false;
};

/**
 * 
 * Deal with inconsistent naming conventions
 * in the URLS
 */
const normalize = category => {
  if (hasNoSuffix(category)) return category;

  return `${category}-objects`;
}

module.exports = {
  normalize,
}