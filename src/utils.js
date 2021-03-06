import PropTypes from 'prop-types';

// eslint-disable-next-line import/prefer-default-export
export const requireAtLeastOne = checkProps => {
  return (props, propName, compName) => {
    const requirePropNames = Object.keys(checkProps);
    const found = requirePropNames.find(propRequired => props[propRequired]);

    try {
      if (!found) {
        throw new Error(
          `One of ${requirePropNames.join(', ')} is required by '${compName}' component.`
        );
      }
      PropTypes.checkPropTypes(checkProps, props, propName, compName);
    } catch (e) {
      return e;
    }
    return null;
  };
};
