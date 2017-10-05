'use strict';

/**
 * @ngdoc overview
 * @name wavesApp
 * @description
 * # wavesApp
 *
 * Main module of the application.
 */
angular
  .module('wavesApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'puigcerber.capitalize',
    'ngHolder',
    'pascalprecht.translate',
    'LocalStorageModule'
  ])
  .config(function ($stateProvider, $routeProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $stateProvider
      .state('boot', { 
        url: '/',
        views: {
          'content': { 
            'templateUrl': 'views/boot.html' 
          }
        }
      })
      .state('active_screen', {
        url: '/active_screen',
        views: {
          'top_left_content': { 
            'template': '<holliday-detail/>' 
          },
          'top_right_content': { 
            'template': '<forecast-detail/>' 
          },
          'content': { 
            'templateUrl': 'views/active_screen/main.html' 
          }
        }
      })
      .state('talking', {
        url: '/talking',
        params: { 
          result: null, 
          speechRecognitionNotSupported: false 
        },
        views: {
          'content': {             
            'template': '<talking/>' 
          }
        }
      })
      .state('loading', {
        url: '/loading',
        params: { text: null },
        views: {
          'content': { 
            'template': '<loading/>'
          }
        }
      })
      .state('not_found', {
        url: '/not_found',
        params: { response: null },
        views: {
          'content': {
            'template': '<not-found-response/>'
          }
        }
      })
      .state('noticias', {
        url: '/noticias',
        params: { response: null },
        views: {
          'content': {
            'template': '<news-response/>'
          }
        }
      })
      .state('clima', {
        url: '/clima',
        params: { response: null },
        views: {
          'content': {
            'template': '<weather-response/>'
          }
        }
      })
      .state('farmacias', {
        url: '/farmacias',
        params: { response: null },
        views: {
          'content': {
            'template': '<pharmacies-response/>'
          }
        }
      });
  });
