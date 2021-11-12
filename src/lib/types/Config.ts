export type Config = {
  name: string,
  studyName: string,
  manipulations: {
    [k: string]: number | string,
  },
  stimuli: {
    [k: string]: string,
  },
  seed: string,
  allowParticipantContact: boolean,
  contact: string,
};
