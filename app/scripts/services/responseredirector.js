'use strict';

/**
 * @ngdoc service
 * @name wavesApp.responseredirector
 * @description
 * # responseredirector
 * Service in the wavesApp.
 */
angular.module('wavesApp')
  .service('responseRedirector', ['$state', function ($state) {
    function noServiceFound(response){
      return response.status === 'not_found';
    }

    return {
      redirect: function(response){
        response = JSON.parse(response);
        if(noServiceFound(response)){
          $state.go(response.attributes.query_words[0].toLowerCase(), response);
        }else{
          $state.go('not_found', response);
        }
      }
    };
  }]);