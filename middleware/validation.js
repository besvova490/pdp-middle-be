const validation = (schema, property = 'body') => (req, res, next) => {
  const { error } = schema.validate(req[property]);

  if (!error) {
    next();
  } else {
    const { details } = error;

    const errors = {};

    details.forEach((i) => {
      errors[i.context.key] = i.message;
    });
    res.status(422).json({ details: errors });
  }
};

module.exports = validation;
