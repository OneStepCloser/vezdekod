import { NOTE } from '../key/types';

export type OctaveNumber = 3 | 4;

export interface KeyPressedPayload {
    note: NOTE;
    octaveNumber: OctaveNumber;
}
