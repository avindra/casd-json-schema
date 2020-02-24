const isRequest = category => category === 'request';

const normalize = category => isRequest(category) ? 'request' : `${category}-objects`;

module.exports = {
    normalize,
}