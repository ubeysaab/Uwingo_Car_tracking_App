// /**
//  * @format
//  */
// import i18n from '@/localization/i18n.ts'
// import i18next from 'i18next';
// import { AppRegistry } from 'react-native';
// import App from '@/App';
// import { name as appName } from './app.json';
// console.log('Is i18n initialized?', i18next.isInitialized);
// AppRegistry.registerComponent(appName, () => App);
/** @format */
import './src/localization/i18n'; // Just import the file for side-effects
import i18next from 'i18next';
import { AppRegistry } from 'react-native';
import App from '@/App';
import { name as appName } from './app.json';

// This is a more reliable way to check
i18next.on('initialized', (options) => {
  console.log('i18n is officially ready!', options.lng);
});

// If you want to check it right now:
console.log('Instance exists?', !!i18next);

AppRegistry.registerComponent(appName, () => App);