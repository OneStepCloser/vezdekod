import React, { useMemo } from 'react';
import b from 'b_';
import { NOTE } from './types';

import './key.scss';

interface Props {
    note: NOTE;
    onClick: (note: NOTE) => void;
}

enum NOTE_TYPE {
    WHITE = 'white',
    BLACK = 'black',
}

const blackNotes = [
    NOTE.D_B, NOTE.E_B, NOTE.G_B, NOTE.A_B, NOTE.B_B,
];

function getTypeByNote (note: NOTE) {
    return blackNotes.includes(note) ? NOTE_TYPE.BLACK : NOTE_TYPE.WHITE;
}

export default function Key (props: Props) {
    const { note, onClick } = props;

    const type = useMemo(() => getTypeByNote(note), [note]);

    return (
        <button className={b('key', {type})} onClick={() => onClick(note)}></button>
    )
}
