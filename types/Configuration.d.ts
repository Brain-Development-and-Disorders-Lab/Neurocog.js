// General configuration properties
export type Configuration = {
  name: string;
  studyName: string;

  // Gorilla manipulations
  manipulations: {
    [k: string]: number | string | boolean | any;
  };

  // Gorilla resources
  resources: {
    [k: string]: string;
  };

  // Gorilla stimuli
  stimuli: {
    [k: string]: string;
  };

  // Error-handling contact
  allowParticipantContact: boolean;
  contact: string;

  // Optional initial state configuration
  state?: any;

  // Optional logging level
  logging?: any;

  // Seed for RNG
  seed: number;
};