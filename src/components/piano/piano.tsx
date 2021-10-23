import React, {useCallback} from 'react';

import Octave from '../octave/octave';
import { KeyPressedPayload } from '../octave/types';

import './piano.scss';


export default function Piano () {
    const handleKeyPressed = useCallback((payload: KeyPressedPayload) => {
        console.log('KEY PRESSED', payload);
    }, []);

    return (
        <div className="piano">
            <div className="piano__top">
                Vezdekod Piano
            </div>
            <div className="piano__octaves">
                <Octave octaveNumber={3} onKeyPressed={handleKeyPressed}/>
                <Octave octaveNumber={4} notesCount={8} onKeyPressed={handleKeyPressed}/>
            </div>
        </div>
    )
}
