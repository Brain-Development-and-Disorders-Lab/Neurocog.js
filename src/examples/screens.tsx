// Define the different example screens in this file

// UI components
import React from 'react';
import {render} from 'react-dom';
import {Grommet} from 'grommet';

// Libraries for examples
import webgazer from 'webgazer/dist/webgazer.commonjs2';

// Define the screen types
export enum Screens {
  // eslint-disable-next-line no-unused-vars
  Eyetracking = 'eyetracking',
};

// Screen 1: Showcase front-end frameworks e.g., React.

// Screen 2: Showcase localisation using i18next

// Screen 3: Showcase eye-tracking using WebGazer

// Screen 4: Showcase 3D graphics using three.js

// Screen 5: Direct port from Unity to WebGL

/**
 * General screen layout utility template
 * @param {any} props properties, namely the screen
 * @return {any}
 */
function ScreenLayout(props: { screen: any; }): any {
  return (
    <Grommet>
      {props.screen}
    </Grommet>
  );
}

/**
 * Eye tracking example
 * @param {any} props properties for the component
 * @return {any}
 */
function EyeTracking(props: any): any {
  webgazer.setGazeListener(function(data, elapsedTime) {
    if (data == null) {
      return;
    }
  }).begin();
  return (
    <h1>
      WebGazer Preview
    </h1>
  );
}

/**
 * Helper function to handle selection and display of screens
 * @param {SCREENS} _type the type of screen
 * @param {HTMLElement} _target target element
 * @param {any} _screenProps properties for the component
 */
export function displayScreen(
    _type: Screens,
    _target: HTMLElement,
    _screenProps: any) {
  console.debug(`Screen to display: '${_type}'`);
  if (_type === Screens.Eyetracking) {
    render(
        // eslint-disable-next-line new-cap
        ScreenLayout({
          // eslint-disable-next-line new-cap
          screen: EyeTracking(_screenProps),
        }),
        _target
    );
  }
}
