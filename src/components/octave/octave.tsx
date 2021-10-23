import React, { useCallback } from 'react';
import { NOTE } from '../key/types';
import Key from '../key/key';
import { KeyPressedPayload, OctaveNumber } from './types';

import './octave.scss';

interface Props {
    octaveNumber: OctaveNumber;
    notesCount?: number;
    activeKeys: KeyPressedPayload[];
    onKeyPressed: (payload: KeyPressedPayload) => void;
}

const octave = [NOTE.C, NOTE.D_B, NOTE.D, NOTE.E_B, NOTE.E, NOTE.F, NOTE.G_B, NOTE.G, NOTE.A_B, NOTE.A, NOTE.B_B, NOTE.B];

const defaultNotesCount = octave.length;

export default function Octave (props: Props) {
    const { octaveNumber, notesCount = defaultNotesCount, activeKeys, onKeyPressed } = props;
    const notesCountIsValid = notesCount >= 1 && notesCount <= octave.length;

    const handleKeyPress = useCallback((note: NOTE) => {
        onKeyPressed({note, octaveNumber})
    }, [onKeyPressed, octaveNumber]);

    return (
        <div className="octave">
            {octave.slice(0, notesCountIsValid ? notesCount : defaultNotesCount).map(note => {
                const isActive = activeKeys.some(payload =>
                    payload.octaveNumber === octaveNumber && payload.note === note
                );

                return (
                    <Key
                        note={note}
                        key={note}
                        octaveNumber={octaveNumber}
                        isActive={isActive}
                        onPress={handleKeyPress}
                    />
                )
            })}
        </div>
    );
}
