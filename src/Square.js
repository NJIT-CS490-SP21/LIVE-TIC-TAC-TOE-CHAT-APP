import React from 'react';

export function Square(props) {
    return <button class='box' onClick={props.onClick}>{props.value}</button>
}
