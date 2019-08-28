import React, { Component } from 'react';
import Square from '../square/square';
import Coin from '../coin/coin';
import * as CoinTypes from '../coin/constants';
import * as BoardTypes from './constants';
import { Button } from 'antd';

import ReactDOM from 'react-dom';
import Modal from 'antd/lib/modal';
import 'antd/lib/modal/style';
import './board.css';
import '../../assets/css/modal.css';

class Board extends Component {
    state = {
        gamePositions: [
            [CoinTypes.EMPTY, CoinTypes.EMPTY, CoinTypes.EMPTY, CoinTypes.EMPTY, CoinTypes.EMPTY],
            [CoinTypes.EMPTY, CoinTypes.EMPTY, CoinTypes.EMPTY, CoinTypes.EMPTY, CoinTypes.EMPTY],
            [CoinTypes.EMPTY, CoinTypes.EMPTY, CoinTypes.EMPTY, CoinTypes.EMPTY, CoinTypes.EMPTY],
            [CoinTypes.EMPTY, CoinTypes.EMPTY, CoinTypes.EMPTY, CoinTypes.EMPTY, CoinTypes.EMPTY],
            [CoinTypes.EMPTY, CoinTypes.EMPTY, CoinTypes.EMPTY, CoinTypes.EMPTY, CoinTypes.EMPTY]],
        initialPositions: [CoinTypes.QUEEN, CoinTypes.QUEEN, CoinTypes.QUEEN, CoinTypes.PAWN, CoinTypes.PAWN, CoinTypes.PAWN, CoinTypes.PAWN, CoinTypes.PAWN]
    };
    squares = [];
    oldX = null;
    oldY = null;

    renderSquare(x, y, coinType, boardType) {
        const fillColor = ((x + y) % 2 === 1) ? 'light' : 'dark';
        const coin = (coinType !== CoinTypes.EMPTY) ? <Coin type={coinType} x={x} y={y} dragstart={this.onDragStartHandler} /> : null;

        return <Square key={5 * x + y} x={x} y={y}
            fillColor={fillColor}
            click={this.handleReplacement}
            drop={this.onDropHandler} >
            {coin}
        </Square>;
    }

    onDropHandler = (x, y) => {
        const oldX = this.oldX;
        const oldY = this.oldY;
        if (oldX === 100 && x === 100) {
            return;
        }
        const newState = { ...this.state };

        const isEmptySquare = (x !== 100) ? (this.state.gamePositions[x][y] === CoinTypes.EMPTY) : (this.state.initialPositions[y] === CoinTypes.EMPTY);
        if (isEmptySquare) {
            let i = 0;

            if (x !== 100) {
                outerloop:
                for (; i < 5; i++) {
                    for (let j = 0; j < 5; j++) {
                        const draggedCoin = (oldX === 100) ? this.state.initialPositions[oldY] : this.state.gamePositions[oldX][oldY];
                        const isConflictingCoin = (this.state.gamePositions[i][j] !== CoinTypes.EMPTY && this.state.gamePositions[i][j] !== draggedCoin);
                        if (isConflictingCoin && (x !== i || y !== j) && (x === i || y === j || x - i === y - j || x - i === j - y)) {
                            console.log('breaking loop at ', i, j);
                            const node = ReactDOM.findDOMNode(this);
                            // Get child nodes
                            if (node instanceof HTMLElement) {
                                const position = i * 5 + j + 8;
                                const child = node.querySelectorAll('.Droppable')[position];
                                const coinElement = child.querySelector('img');
                                const currentColor = coinElement.style.backgroundColor;
                                coinElement.style.backgroundColor = 'red';
                                window.setTimeout(() => coinElement.style.backgroundColor = currentColor, 500);
                            }


                            break outerloop;
                        }
                    }
                }
            }
            if (i === 5 || x === 100) {
                if (oldX === 100) {
                    newState.gamePositions[x][y] = this.state.initialPositions[oldY];
                    newState.initialPositions[oldY] = CoinTypes.EMPTY;
                }
                else if (x === 100) {
                    newState.initialPositions[y] = this.state.gamePositions[oldX][oldY];
                    newState.gamePositions[oldX][oldY] = CoinTypes.EMPTY;
                }
                else {
                    newState.gamePositions[x][y] = this.state.gamePositions[oldX][oldY];
                    newState.gamePositions[oldX][oldY] = CoinTypes.EMPTY;
                }
                this.setState(
                    { state: newState }
                )
            }

            if (!this.state.initialPositions.find(coinType => coinType !== CoinTypes.EMPTY)) {
                this.showWinModal();
            }
        }
    }

    onDragStartHandler = (x, y) => {
        this.oldX = x;
        this.oldY = y;
    }

    showGameRules = () => {
        Modal.info({
            title: 'QUEEN PAWN PUZZLE',
            content: 'All the 3 queens and 5 pawns should be arranged in the board so that no queen can attack a pawn.',
        });
    }

    
    showWinModal = () => {
        Modal.success({
            title: 'Congratualtions',
            content: 'You have solved the puzzle',
        });
    }

    render() {
        const sideBoard = [];
        for (let j = 0; j < this.state.initialPositions.length; j++) {
            sideBoard.push(this.renderSquare(100, j, this.state.initialPositions[j], BoardTypes.SIDEBOARD));
        }
        const gameBoard = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                gameBoard.push(this.renderSquare(i, j, this.state.gamePositions[i][j], BoardTypes.GAMEBOARD));
            }
        }

        return <div className="layout">
            <div className="sideBoard">{sideBoard}</div>
            <div className="gameBoard">{gameBoard}</div>
            <Button type="primary" onClick={this.showGameRules} >Game Rules</Button>
        </div>;
    }
}

export default Board;