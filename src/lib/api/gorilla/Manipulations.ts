/**
 * Class that links to the Gorilla Manipulations API. It allows safe references
 * to the API while developing the tasks locally.
 */
export class Manipulations {
  // Target object containing the manipulations
  private _manipulations: any;
  // List of manipulation keys
  private _keys: string[];

  /**
   * Default constructor
   * @param {any} _manipulations target object containing the manipulations
   * @param {string[]} _keys list of manipulation keys
   */
  constructor(_manipulations: any, _keys: string[]) {
    this._manipulations = _manipulations;
    this._keys = _keys;
    this._connect();
  }

  /**
   * Retrieves the Gorilla instance and connects any manipulations specified
   * to the Gorilla Manipulations API.
   */
  private _connect() {
    const _gorilla: any = window['gorilla'];
    this._keys.forEach((_manipulationKey) => {
      if (this._manipulations[_manipulationKey]) {
        // Type checks to make sure properties are preserved
        if (this._manipulations[_manipulationKey] instanceof Number) {
          // Number
          this._manipulations[_manipulationKey] =
              Number(_gorilla.manipulation(_manipulationKey));
        } else if (this._manipulations[_manipulationKey] instanceof Boolean) {
          // Boolean
          this._manipulations[_manipulationKey] =
              _gorilla.manipulation(_manipulationKey) == 'true';
        } else {
          // Everything else (strings etc.)
          this._manipulations[_manipulationKey] =
              _gorilla.manipulation(_manipulationKey);
        }
      } else {
        console.warn(`Manipulation '${_manipulationKey}' was not bound`);
      }
    });
  }
}
