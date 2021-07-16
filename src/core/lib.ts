/**
 * Define any additional classes here.
 */

/**
 * Class to handle data collection and storage outside
 * the individual trials
 */
export class TrialDataManager {
  private _options: any;
  private _dataObject: any;
  private _keypressData: any[];
  private _mouseData: any[];
  private _recordKeypresses: boolean;
  private _recordMouse: boolean;
  private _mouseDelta: number;
  private _lastMouseTime: number;
  /**
   * Default constructor
   * @param {any} _dataObject existing data structure
   * @param {any} _options set of custom parameters
   */
  constructor(_dataObject: any, _options: any) {
    this._dataObject = _dataObject;
    this._options = _options;

    // Data collections
    this._keypressData = [];
    this._mouseData = [];

    // Read in any options
    this._extractOptions();

    // Gather accessible system information
    this._extractSystemInformation();
  }

  /**
   * Extract the options from the options
   * parameters
   */
  _extractOptions() {
    // Record keypresses
    if (this._options.keypress !== undefined) {
      if (this._options.keypress === true || this._options.keypress === false) {
        this._recordKeypresses = this._options.keypress;
      } else {
        console.warn(`Invalid option '${this._options.keypress}'!`);
      }
    }

    // Record mouse position
    if (this._options.mouse !== undefined) {
      if (this._options.mouse === true || this._options.mouse === false) {
        this._recordMouse = this._options.mouse;
      } else {
        console.warn(`Invalid option '${this._options.mouse}'!`);
      }
    }

    // Mouse recording delta
    if (this._options.delta !== undefined) {
      if (!isNaN(parseInt(this._options.delta))) {
        this._mouseDelta = parseInt(this._options.delta);
      } else {
        console.warn(`Invalid delta '${this._options.delta}'!`);
      }
    }
  }

  /**
   * Extract system information of participants device
   * @return {any} collection of system information
   */
  _extractSystemInformation() {
    const _systemInformation = {
      viewWidth: window.innerWidth,
      viewHeight: window.innerHeight,
      language: navigator.language,
      automated: navigator.webdriver,
      agent: navigator.userAgent,
      vendor: navigator.vendor,
    };
    return _systemInformation;
  }

  /**
   * Start data collection
   */
  start() {
    if (this._recordKeypresses) {
      document.addEventListener('keypress', this._keypressEvent.bind(this));
    }

    if (this._recordMouse) {
      document.addEventListener('mousemove', this._mouseEvent.bind(this));
    }
  }

  /**
   * Get the value of a field stored in the trial data
   * @param {string} _id ID of the field
   * @return {any} field value
   */
  getField(_id) {
    if (this._dataObject[_id] !== undefined) {
      return this._dataObject[_id];
    }
    console.warn(`Attempting to get unknown field '${_id}'`);
    return null;
  }

  /**
   * Set the value of a field stored in the trial data
   * @param {string} _id ID of the field
   * @param {any} _value field value
   */
  setField(_id, _value) {
    this._dataObject[_id] = _value;
  }

  /**
   * Store information on a keypress event
   * @param {any} _event event object
   */
  _keypressEvent(_event) {
    this._keypressData.push(
        `${performance.now()}:${_event.code}`
    );
  }

  /**
   * Store information on a mouse movement event
   * @param {any} _event event object
   */
  _mouseEvent(_event) {
    const _time = performance.now();
    // Restrict the frequency of updates
    if (_time - this._lastMouseTime > this._mouseDelta) {
      this._mouseData.push(
          `${performance.now()}:(${_event.clientX},${_event.clientY})`
      );
      this._lastMouseTime = _time;
    }
  }

  /**
   * Clean up any listeners
   */
  _tidy() {
    // Remove keypress listener
    if (this._recordKeypresses) {
      document.removeEventListener('keypress', this._keypressEvent.bind(this));
    }

    // Remove mouse listener
    if (this._recordMouse) {
      document.removeEventListener('mousemove', this._mouseEvent.bind(this));
    }
  }

  /**
   * Extract and return the data gathered throughout the trial
   * @return {any} the trial data
   */
  getData(): any {
    if (this._recordKeypresses) {
      this._dataObject.keypresses = this._keypressData.toString();
    }

    if (this._recordMouse) {
      this._dataObject.mousemovement = this._mouseData.toString();
    }

    // Clean up any event listeners
    this._tidy();

    return this._dataObject;
  }
}

/**
 * Load trial configuration data from a JSON file exported
 */
export class TrialLoader {
  private _data: JSON;
  private _name: string;
  /**
   * Default constructor for TrialLoader
   * @param {string} _name the name of the file or trial
   * configuration
   * @param {string} _path the absolutepath to the file
   */
  constructor(_name: string, _path: string) {
    fetch(_path)
        .then((_response) => _response.json())
        .then((_obj) => {
          console.info(`Loaded JSON configuration for trials`);
          this._data = _obj;
        })
        .catch((_error) => {
          console.error(`Error loading JSON configuration for trials`);
        });
    this._name = _name;
  }

  /**
   * Retrieve the data stored in the JSON configuration
   * @return {JSON}
   */
  getTrialData(): JSON {
    return this._data;
  }
}

/**
 * Subsitute utility class to load images from the configuration
 * file
 */
export class ImageLoader {
  private _images: any;
  private _config: any;
  /**
   * Default constructor
   * @param {any} config user-created task configuration
   */
  constructor(config: any) {
    console.info(`Instantiated ImageLoader utility.`);
    this._config = config;
    this._images = {};
    this._load();
  }

  /**
   * Load images from the configuration file.
   */
  _load() {
    Object.keys(this._config.images).forEach((_image: any) => {
      console.debug(`Image: ${_image}`);
      this._images[_image] = this._config.images[_image];
    });
  }

  /**
   * Return the generated collection of images
   * @return {any} collection of images
   */
  getImages(): any {
    return this._images;
  }
}
