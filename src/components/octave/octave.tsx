import React, { useCallback } from 'react';
import { NOTE } from '../key/types';
import Key from '../key/key';
import {KeyPressedPayload, OctaveNumber} from './types';

import './octave.scss';

interface Props {
    octaveNumber: OctaveNumber;
    notesCount?: number;
    onKeyPressed: (payload: KeyPressedPayload) => void;
}

const octave = [NOTE.C, NOTE.D_B, NOTE.D, NOTE.E_B, NOTE.E, NOTE.F, NOTE.G_B, NOTE.G, NOTE.A_B, NOTE.A, NOTE.B_B, NOTE.B];

const defaultNotesCount = octave.length;

export default function Octave (props: Props) {
    const { octaveNumber, notesCount = defaultNotesCount, onKeyPressed } = props;
    const notesCountIsValid = notesCount >= 1 && notesCount <= octave.length;

    const handleKeyClick = useCallback((note: NOTE) => {
        onKeyPressed({note, octaveNumber})
    }, [onKeyPressed, octaveNumber]);

    return (
        <div className="octave">
            {octave.slice(0, notesCountIsValid ? notesCount : defaultNotesCount).map(note => (
                <Key note={note} key={note} onClick={handleKeyClick}/>
            ))}
        </div>
    )
}
