import React from 'react';
import * as CoinTypes from './constants';
import { Draggable } from 'react-drag-and-drop';
import pawnBlack from '../../assets/images/pawn_black.png';
import queenBlack from '../../assets/images/queen_black.png';
import './coin.css';

const Coin = (props) => {
    let coin;
    let dragType = 'coin';

    switch(props.type) {
        case CoinTypes.PAWN :
            coin = <img src={pawnBlack} alt="♟" />; //'';
            break;
        case CoinTypes.QUEEN : 
            coin = <img src={queenBlack} alt="♛" />
            break;
        default :
    }

    if(props.type !== CoinTypes.EMPTY)
        return <Draggable className="coin" type={dragType} onDragStart={() => props.dragstart(props.x, props.y)}>{coin}</Draggable>;
    else
        return <div className="coin"></div>;
}

export default Coin;