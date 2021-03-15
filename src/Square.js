import PropTypes from 'prop-types';
import React from 'react';

export function Square(props) {
  const { onclck, vale } = props;
  return (
    <button className="box" onClick={onclck} type="button">
      {vale}
    </button>
  );
}
Square.propTypes = {
  onclck: PropTypes.func,
  vale: PropTypes.func,
};

Square.defaultProps = {
  onclck: PropTypes.func,
  vale: PropTypes.func,
};
export default Square;
