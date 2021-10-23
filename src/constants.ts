import { KeyPressedPayload, OctaveNumber } from './components/octave/types';
import { NOTE } from './components/key/types';

export const keyToKeyboardKeyMap: Record<OctaveNumber, Partial<Record<NOTE, string>>> = {
    3: {
        [NOTE.C]: 'q',
        [NOTE.D]: 'w',
        [NOTE.E]: 'e',
        [NOTE.F]: 'r',
        [NOTE.G]: 't',
        [NOTE.A]: 'y',
        [NOTE.B]: 'u',
        [NOTE.D_B]: '2',
        [NOTE.E_B]: '3',
        [NOTE.G_B]: '5',
        [NOTE.A_B]: '6',
        [NOTE.B_B]: '7',
    },
    4: {
        [NOTE.C]: 'i',
        [NOTE.D]: 'o',
        [NOTE.E]: 'p',
        [NOTE.F]: '[',
        [NOTE.G]: ']',
        [NOTE.D_B]: '9',
        [NOTE.E_B]: '0',
        [NOTE.G_B]: '=',
    }
};

export const keyboardKeyToKeyMap: Record<string, KeyPressedPayload> = Object.entries(keyToKeyboardKeyMap)
    .reduce((acc: Record<string, KeyPressedPayload>, [octaveNumber, map]) => {
        Object.entries(map).forEach(([note, letter]) => {
            acc[letter] = {
                octaveNumber: Number(octaveNumber) as OctaveNumber,
                note: note as NOTE,
            }
        });

        return acc;
    }, {});



