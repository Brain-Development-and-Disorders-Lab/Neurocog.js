export interface APIFeature {
  // Get a singular element from the API, identified uniquely
  public get: (identifier: string) => any;

  // Get all elements stored by the API
  public getAll: () => any[] | { [key: string]: any };
}