const get = require('lodash/get');

const setHttpPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse({ response }) {
        const apolloErrorCode = get(response, 'errors.[0].extensions.code', false);

        if (apolloErrorCode) {
          switch (apolloErrorCode) {
            case 'UNAUTHENTICATED':
              response.http.status = 401;

              break;
            case 'BAD_USER_INPUT':
              response.http.status = 400;

              break;
            case 'PERSISTED_QUERY_NOT_FOUND':
              response.http.status = 404;

              break;
            default:
              break;
          }
        }
      },
    };
  },
};

module.exports = setHttpPlugin;
