declare type Configuration = {
  // General configuration properties
  name: string;
  studyName: string;
  manipulations: {
    [k: string]: number | string;
  };
  stimuli: {
    [k: string]: string;
  };
  allowParticipantContact: boolean;
  contact: string;

  // Optional initial state configuration
  state?: any;

  // Optional logging level
  logging?: any;

  // Seed for RNG
  seed: number;
};
