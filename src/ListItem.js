import PropTypes from 'prop-types';
import React from 'react';

export function ListItem(props) {
  const { name } = props;
  return (
    <div>
      { name }
    </div>
  );
}
ListItem.propTypes = {
  name: PropTypes.func,
};

ListItem.defaultProps = {
  name: PropTypes.func,
};
export default ListItem;
