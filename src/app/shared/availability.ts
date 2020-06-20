import { Player } from './player'

export class Availability {
    id: number;
    player: Player;
    availabilityType: string;
    trainingPresence: string;
    matchPresence: string;
    selection: string;
}