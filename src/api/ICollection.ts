export interface ICollection {
  getOne(identifier: string): any; // Retrieve one element from a collection
  getAll(): { [identifier: string]: any }; // Retrieve the entire collection
};
