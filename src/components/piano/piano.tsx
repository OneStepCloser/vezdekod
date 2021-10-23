import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';

import Octave from '../octave/octave';
import { KeyPressedPayload, OctaveNumber } from '../octave/types';
import { NOTE } from '../key/types';
import { keyboardKeyToKeyMap, keyToKeyboardKeyMap, russianToEnglishMap } from '../../constants';

import './piano.scss';

function usePrevious(value: any): any {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

function getKeyId (octaveNumber: OctaveNumber, note: NOTE) {
    return `${note}${octaveNumber}`;
}

export default function Piano () {
    const [activeLetters, setActiveLetters] = useState<string[]>([]);

    const activeKeys = useMemo<KeyPressedPayload[]>(() =>
        activeLetters.map(letter => keyboardKeyToKeyMap[letter]), [activeLetters]);

    const addLetter = useCallback((letter: string) => {
        setActiveLetters((prevState) => {
            return prevState.includes(letter) ? prevState : [...prevState, letter];
        });
    }, [setActiveLetters]);

    const handleKeyPressed = useCallback((payload: KeyPressedPayload) => {
        const letter = keyToKeyboardKeyMap[payload.octaveNumber][payload.note];

        if (letter) {
            addLetter(letter);
        }
    }, [addLetter]);

    const handleMouseUp = useCallback(() => {
        setActiveLetters((prevState) => {
            return prevState.length ? [] : prevState;
        });
    }, [setActiveLetters]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.repeat) {
            return;
        }

        const letter = russianToEnglishMap[e.key] || e.key;

        if (!(letter in keyboardKeyToKeyMap)) {
            return;
        }

        addLetter(letter);

    }, [addLetter]);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        if (e.repeat) {
            return;
        }

        const letter = russianToEnglishMap[e.key] || e.key;

        if (!(letter in keyboardKeyToKeyMap)) {
            return;
        }

        setActiveLetters((prevState) => {
            if (!prevState.includes(letter)) {
                return prevState;
            }

            const copy = prevState.slice();
            const index = prevState.indexOf(letter);

            if (index >= 0) {
                copy.splice(index, 1);
            }

            return copy;
        })
    }, [setActiveLetters]);

    const prevHandleMouseUp = usePrevious(handleMouseUp);
    const prevHandleKeyDown = usePrevious(handleKeyDown);
    const prevHandleKeyUp = usePrevious(handleKeyUp);
    const prevActiveKeys: KeyPressedPayload[] = usePrevious(activeKeys);

    useEffect(() => {
        if (!prevActiveKeys || activeLetters.length < prevActiveKeys.length) {
            return;
        }

        const newKeys = activeKeys.filter(payload => {
            const existsInPrev = prevActiveKeys.some(payloadInPrev =>
                payloadInPrev.octaveNumber === payload.octaveNumber && payloadInPrev.note === payload.note);

            return !existsInPrev;
        });

        newKeys.forEach(payload => {
            const mySound = new Audio(`/sounds/Piano.ff.${getKeyId(payload.octaveNumber, payload.note)}.mp3`);
            mySound.play();
        })
    }, [activeKeys]);

    useEffect(() => {
        if (prevHandleMouseUp !== handleMouseUp) {
            window.removeEventListener('mouseup', prevHandleMouseUp);
            window.addEventListener('mouseup', handleMouseUp, true);
        }

        if (prevHandleKeyDown !== handleKeyDown) {
            window.removeEventListener('keydown', prevHandleKeyDown);
            window.addEventListener('keydown', handleKeyDown, true);
        }

        if (prevHandleKeyUp !== handleKeyUp) {
            window.removeEventListener('keyup', prevHandleKeyUp);
            window.addEventListener('keyup', handleKeyUp, true);
        }

        return function () {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        }
    }, [handleMouseUp, handleKeyDown, handleKeyUp]);

    return (
        <div className="piano">
            <div className="piano__top">
                Vezdekod Piano
            </div>
            <div className="piano__octaves">
                <Octave
                    octaveNumber={3}
                    activeKeys={activeKeys}
                    onKeyPressed={handleKeyPressed}
                />
                <Octave
                    octaveNumber={4}
                    notesCount={8}
                    activeKeys={activeKeys}
                    onKeyPressed={handleKeyPressed}
                />
            </div>
        </div>
    )
}
