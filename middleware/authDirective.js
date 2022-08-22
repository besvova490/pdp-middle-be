require('dotenv').config();

const { defaultFieldResolver } = require('graphql');
const { mapSchema, MapperKind, getDirective } = require('@graphql-tools/utils');

const { AuthenticationError } = require('apollo-server-express');
const JWT = require('jsonwebtoken');

const authDirective = (directiveName) => {
  const typeDirectiveArgumentMaps = {};

  return {
    authDirectiveTypeDefs: `directive @${directiveName} on OBJECT | FIELD_DEFINITION`,
    authDirectiveTransformer: (schema) => mapSchema(schema, {
      [MapperKind.TYPE]: (type) => {
        const isAuthDirective = getDirective(schema, type, directiveName)?.[0];

        if (isAuthDirective) {
          typeDirectiveArgumentMaps[type.name] = isAuthDirective;
        }

        return undefined;
      },
      [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
        const isAuthDirective = getDirective(schema, fieldConfig, directiveName)?.[0]
        ?? typeDirectiveArgumentMaps[typeName];

        if (isAuthDirective) {
          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = (source, args, context, info) => {
            const authToken = context.req.headers.authorization;
            const token = authToken && authToken.split(' ')[1];

            if (!token) throw new AuthenticationError('not authorized');

            return JWT.verify(token, process.env.EXPRESS_APP_JWT_ACCESS_SECRET, (e, user) => {
              if (e) throw new AuthenticationError(e);

              return resolve(source, args, { ...(context || {}), user }, info);
            });
          };

          return fieldConfig;
        }
      },
    }),
  };
};

module.exports = authDirective;
