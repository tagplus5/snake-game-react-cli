const React = require('react');
const { Text, Box, useStdin } = require('ink');
const { useState, useEffect } = require('react');
const useInterval = require('./useInterval');
const importJsx = require('import-jsx');
const EndScreen = importJsx('./endScreen');

const ARROW_UP = "\u001B[A";
const ARROW_DOWN = "\u001B[B";
const ARROW_RIGHT = "\u001B[C";
const ARROW_LEFT = "\u001B[D";

const FIELD_SIZE = 16;

const FIELD_ROW = [...new Array(FIELD_SIZE).keys()];

let foodItem = newFoodItem();

 function newFoodItem(){
     return {
        x: Math.floor(Math.random() * FIELD_SIZE),
        y: Math.floor(Math.random() * FIELD_SIZE),
    };
 }

const DIRECTION = {
    RIGHT: { x: 1, y: 0 },
    LEFT: { x: -1, y: 0 },
    TOP: { x: 0, y: -1 },
    BOTTOM: { x: 0, y: 1 },
}

function getItem(x, y, snakeSegments) {

    if (foodItem.x === x && foodItem.y === y) {
        return <Text color='red'>🍏</Text>
    }

    for (const segment of snakeSegments) {
        if (segment.x === x && segment.y === y) {
            return <Text color='green'>🟧</Text>
        }
    }

    return <Text> . </Text>
}

function limitByField(j) {
    if (j >= FIELD_SIZE) {
        return 0;
    }
    if (j < 0) {
        return FIELD_SIZE - 1;
    }
    return j;
}

function newSnakePosition(segments, direction) {
 
    const [head] = segments;

    const newHead = {
        x: limitByField(head.x + direction.x),
        y: limitByField(head.y + direction.y)
    };

    if (collidesWithFood(newHead, foodItem)) {
        foodItem = newFoodItem();
        return [newHead, ...segments];
    };

    return [newHead, ...segments.slice(0, -1)];
}

function collidesWithFood(head, foodItem) {
    if (head.x === foodItem.x && head.y === foodItem.y) {
        return true;
    }
    return false;
}

const App = () => {
    const [snakeSegments, setSnakeSegments] = useState([
        { x: 8, y: 6 },
        { x: 8, y: 7 },
        { x: 8, y: 8 },
    ]);

    const [direction, setDirection] = useState(DIRECTION.LEFT);

    const { stdin, setRawMode } = useStdin();

    useEffect(() => {
        setRawMode(true);
        stdin.on("data", data => {
            const value = data.toString();
            if (value == ARROW_UP) {
                setDirection(DIRECTION.TOP);
            }
            if (value == ARROW_DOWN) {
                setDirection(DIRECTION.BOTTOM);
            }
            if (value == ARROW_LEFT) {
                setDirection(DIRECTION.LEFT);
            }
            if (value == ARROW_RIGHT) {
                setDirection(DIRECTION.RIGHT);
            }
        });
    }, []);

    const [head, ...tail] = snakeSegments;

    const intersectsWithItSelf = tail.some(segment => segment.x === head.x && segment.y === head.y
    );

    useInterval(() => {
        setSnakeSegments(segments => newSnakePosition(segments, direction))
    }, intersectsWithItSelf ? null : 200);




    return (
        <Box flexDirection='column' alignItems='center'>
            <Text>
                <Text color="green">Snake</Text> game
				</Text>
            {intersectsWithItSelf ? (
                <EndScreen size={FIELD_SIZE} />
            ) : (
                <Box flexDirection='column'>
                    {FIELD_ROW.map(y => (
                        <Box key={y}>
                            {FIELD_ROW.map(x => (
                                <Box key={x}>
                                    <Text> {getItem(x, y, snakeSegments)} </Text>
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};

module.exports = App;