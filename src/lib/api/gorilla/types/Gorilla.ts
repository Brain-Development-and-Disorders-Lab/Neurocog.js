export type Gorilla = {
  ready(func: () => void): void,
  stimuliURL(stimuli: string): string,
  metric(data: any): void,
  finish(): void,
};
