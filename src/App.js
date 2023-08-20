import { useReducer } from 'react';
import './App.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    ALL_CLEAR: 'all-clear',
    DELETE_DIGIT: 'delete-digit',
    EVALUATE: 'evaluate',
};

const InitialState = {
    currentOperand: '',
    previousOperand: '',
    operation: '',
    overwrite: false,
};

function evaluateCalculation({ currentOperand, previousOperand, operation }) {
    const previous = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    let computation;
    switch (operation) {
        case '+':
            computation = previous + current;
            break;
        case '-':
            computation = previous - current;
            break;
        case '*':
            computation = previous * current;
            break;
        case '÷':
            computation = previous / current;
            break;
        default:
            computation = '';
    }
    return computation.toString();
}
function addDigitHandler(state, digit) {
    const { overwrite, currentOperand } = state;
    if (overwrite) {
        return {
            ...InitialState,
            currentOperand: digit,
        };
    }
    if (digit === '0' && currentOperand === '0') {
        return state;
    }
    if (digit === '.' && currentOperand.includes('.')) {
        return state;
    }

    return {
        ...state,
        currentOperand: `${currentOperand || ''}${digit}`,
    };
}

function chooseOperationHandler(state, operation) {
    const { currentOperand, previousOperand } = state;
    if (currentOperand === '' && previousOperand === '') {
        return state;
    }

    if (previousOperand === '') {
        return {
            ...state,
            previousOperand: currentOperand,
            currentOperand: '',
            operation: operation,
            overwrite: false,
        };
    }
    if (currentOperand === '') {
        return {
            ...state,
            overwrite: false,
            operation: operation,
        };
    }

    return {
        ...state,
        overwrite: false,
        previousOperand: evaluateCalculation(state),
        currentOperand: '',
        operation: operation,
    };
}

function deleteDigitHandler(state) {
    const { currentOperand, overwrite } = state;
    if (overwrite) {
        return InitialState;
    }
    if (currentOperand === '') {
        return state;
    }

    if (currentOperand.length === 1) {
        return {
            ...state,
            currentOperand: '',
        };
    }
    return {
        ...state,
        currentOperand: currentOperand.slice(0, -1),
    };
}

function evaluateHandler(state) {
    const { previousOperand, currentOperand, operation } = state;
    if (previousOperand === '' || currentOperand === '' || operation === '') {
        return state;
    }
    return {
        ...state,
        overwrite: true,
        previousOperand: '',
        currentOperand: evaluateCalculation(state),
        operation: '',
    };
}

function reducer(state, { type, payload }) {
    switch (type) {
        case ACTIONS.ADD_DIGIT:
            return addDigitHandler(state, payload.digit);

        case ACTIONS.CHOOSE_OPERATION:
            return chooseOperationHandler(state, payload.operation);

        case ACTIONS.ALL_CLEAR:
            return InitialState;

        case ACTIONS.DELETE_DIGIT:
            return deleteDigitHandler(state);

        case ACTIONS.EVALUATE:
            return evaluateHandler(state);

        default:
            return state;
    }
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
    maximumFractionDigits: 0,
});

function formatOperand(operand) {
    if (operand === '') {
        return;
    }
    const [integerPart, decimalPart] = operand.split('.');

    if (decimalPart == null) return INTEGER_FORMATTER.format(integerPart);
    return `${INTEGER_FORMATTER.format(integerPart)}.${decimalPart}`;
}
function App() {
    const [
        { currentOperand, previousOperand, operation },
        dispatch,
    ] = useReducer(reducer, InitialState);

    return (
        <div className='calculator-grid'>
            <div className='output'>
                <div className='previous-operand'>
                    {formatOperand(previousOperand)} {operation}
                </div>
                <div className='current-operand'>
                    {formatOperand(currentOperand)}
                </div>
            </div>

            <button
                className='span-two'
                onClick={() => dispatch({ type: ACTIONS.ALL_CLEAR })}
            >
                AC
            </button>
            <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
                DEL
            </button>
            <OperationButton operation={'÷'} dispatch={dispatch} />

            <DigitButton digit={'1'} dispatch={dispatch} />
            <DigitButton digit={'2'} dispatch={dispatch} />
            <DigitButton digit={'3'} dispatch={dispatch} />
            <OperationButton operation={'*'} dispatch={dispatch} />

            <DigitButton digit={'4'} dispatch={dispatch} />
            <DigitButton digit={'5'} dispatch={dispatch} />
            <DigitButton digit={'6'} dispatch={dispatch} />
            <OperationButton operation={'+'} dispatch={dispatch} />

            <DigitButton digit={'7'} dispatch={dispatch} />
            <DigitButton digit={'8'} dispatch={dispatch} />
            <DigitButton digit={'9'} dispatch={dispatch} />
            <OperationButton operation={'-'} dispatch={dispatch} />

            <DigitButton digit={'.'} dispatch={dispatch} />

            <DigitButton digit={'0'} dispatch={dispatch} />

            <button
                className='span-two'
                onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
            >
                =
            </button>
        </div>
    );
}

export default App;
