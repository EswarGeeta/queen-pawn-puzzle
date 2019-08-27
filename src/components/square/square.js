import React from 'react';
import { Droppable } from 'react-drag-and-drop';
import './square.css';

const Square = (props) => {
    const cssClasses = "square " + props.fillColor;
    return <Droppable types={['coin']} onDrop={() => props.drop(props.x, props.y)}>
            <div className={cssClasses} >
        {props.children}
    </div>
    </Droppable>;
}

export default Square;