export class PresenceTrainingsFormat {
    trainings: Array<{
        date: string,
        label: string,
        presences: {
            [key: string]: {
                name: string,
                presenceType: string
            }
        }
    }>;
    players: Array<string>;
}