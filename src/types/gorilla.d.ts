declare type Gorilla = {
  ready(func: () => void): void;
  manipulation(key: string): any;
  stimuliURL(stimuli: string): string;
  metric(data: any): void;
  finish(): void;
};
