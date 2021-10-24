import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { parseString } from 'xml2js';

import Octave from '../octave/octave';
import { KeyPressedPayload, OctaveNumber } from '../octave/types';
import { NOTE } from '../key/types';
import { keyboardKeyToKeyMap, keyToKeyboardKeyMap, LETTER, russianToEnglishMap } from '../../constants';

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

interface PlayableNote extends KeyPressedPayload {
    duration: number;
}

const DURATION_MULTIPLIER = 4;

export default function Piano () {
    const [activeLetters, setActiveLetters] = useState<LETTER[]>([]);
    const [playableNotes, setPlayableNotes] = useState<PlayableNote[]>([]);

    const activeKeys = useMemo<KeyPressedPayload[]>(() =>
        activeLetters.map(letter => keyboardKeyToKeyMap[letter]), [activeLetters]);

    const addLetter = useCallback((letter: LETTER) => {
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
    }, [activeKeys, activeLetters.length]);

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

    const handleFileChange = useCallback((e) => {
        const files = e.target.files;
        const f = files[0];

        const reader = new FileReader();

        reader.onload = function() {
            if (reader.result) {
                parseString(reader.result, function (err, parsedObj) {
                    if (err) {
                        alert('Не удалось распарсить файл. Возможно, некорректный формат.');
                        return;
                    }

                    const measures = parsedObj['score-partwise'].part[0].measure;
                    const playableNotes: PlayableNote[] = [];

                    measures.forEach((measure: any) => {
                        measure.note.forEach((note: any) => {
                            playableNotes.push({
                                duration: Number(note.duration[0]),
                                note: note.pitch[0].step[0],
                                octaveNumber: Number(note.pitch[0].octave[0]) as OctaveNumber,
                            });
                        });
                    });

                    setPlayableNotes(playableNotes);
                });
            }
        };

        reader.onerror = function() {
            alert('Не удалось прочитать файл :(')
        };

        reader.readAsText(f);
    }, [setPlayableNotes]);

    const handlePlayClick = useCallback(() => {
        let i = 0;

        function recursiveCall() {
            const currentNote = playableNotes[i];
            const duration = currentNote.duration * DURATION_MULTIPLIER;
            const letter = keyToKeyboardKeyMap[currentNote.octaveNumber][currentNote.note];

            if (letter) {
                setActiveLetters([]);
                setActiveLetters([letter]);
            }

            if (i < playableNotes.length - 1) {
                i++;
                setTimeout(recursiveCall, duration);
            } else {
                setTimeout(() => setActiveLetters([]), duration);
            }
        }

        recursiveCall();
    }, [playableNotes, setActiveLetters]);

    return (
        <div className="piano">
            <div className="piano__top">
                <span className="piano__title">Vezdekod Piano</span>
                <div className="piano__buttons">
                    {playableNotes?.length ? (
                        <button
                            className="piano__play-button"
                            onClick={handlePlayClick}
                        >
                        </button>
                    ) : null}
                    <label
                        htmlFor="file-input"
                        className="piano__upload-file-button"
                    >
                        <input
                            type="file"
                            id="file-input"
                            className="piano__upload-file-input"
                            accept="text/xml"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>
            </div>
            <div className="piano__octaves">
                <Octave
                    octaveNumber={3}
                    activeKeys={activeKeys}
                    onKeyPressed={handleKeyPressed}
                />
                <Octave
                    octaveNumber={4}
                    activeKeys={activeKeys}
                    onKeyPressed={handleKeyPressed}
                />
            </div>
        </div>
    )
}
