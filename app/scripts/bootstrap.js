angular
.module('wavesApp')
.config(function (localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('waves');
})
.run(['$rootScope', '$state', '$timeout', 'keywordHelper',
  function($rootScope, $state, $timeout, keywordHelper){
    var responseTimeout = null;

    annyang.addCommands({
      'inicio': function() {$state.go('active_screen')},
      ':command': {
        'regexp': /^(noticias|clima|farmacias)$/,
        'callback': function (command) {
          // if(!$state.is('talking')) $state.go('talking');
          // $timeout(()=>{$rootScope.$emit("speech:result", {text: command, final: true})}, 10); 
          $state.go('talking').then(function () {$timeout(function() {$rootScope.$emit("speech:result", {text: command, final: true})}, 10)});
        }
      },
            // '*allSpeech': function(allSpeech){
            //   if(!$state.is('talking')) $state.go('talking');
            //   $rootScope.$emit("speech:result", {text: allSpeech, final: true});
            // }
// 'noticias':   () => { 
//   if(!$state.is('talking')) $state.go('talking');
//   setTimeout(()=>{$rootScope.$emit("speech:result", {text: 'noticias', final: true})}, 0); 
// },
// 'clima':      () => { 
//   if(!$state.is('talking')) $state.go('talking');
//   setTimeout(()=>{$rootScope.$emit("speech:result", {text: 'clima', final: true})}, 0); 
// },
// 'farmacias':  () => { 
//   if(!$state.is('talking')) $state.go('talking');
//   setTimeout(()=>{$rootScope.$emit("speech:result", {text: 'farmacias', final: true})}, 0); 
// },
      // '*allSpeech': function(allSpeech){       
      //   if(!$state.is('talking')) $state.go('talking');
      //   console.info("COMMAND:", allSpeech);
      //   $rootScope.$emit("speech:result", {text: allSpeech, final: true});
      // }
    });

    annyang.addCallback('result', function(userSaid) {
      // console.info('ANNYANG:partial-result', userSaid);
      $timeout.cancel(responseTimeout);
      if(!$state.is('talking')) $state.go('talking');
      

      $timeout(function() {$rootScope.$emit("speech:result", {text: userSaid[0], final: false}), 10});
    });
    annyang.addCallback('resultMatch', function(userSaid/*, commandText, phrases*/) {
      // console.info('ANNYANG:final-result', userSaid);
      // $rootScope.$emit("speech:result", {text: userSaid, final: true});
    });

    // annyang.addCallback('error', function(e) {
    //   if(e.error !== 'no-speech'){
    //     console.error("ANNYANG:error", e);
    //     $state.go('boot');
    //   }
    // });
    // annyang.addCallback('errorNetwork', function(e) {
    //   console.error("ANNYANG:errorNetwork", e);
    //   $state.go('boot');
    // });
    // annyang.addCallback('errorPermissionBlocked', function(e) {
    //   console.error("ANNYANG:errorPermissionBlocked", e);
    //   $state.go('boot');
    // });
    // annyang.addCallback('errorPermissionDenied', function(e) {
    //   console.error("ANNYANG:errorPermissionDenied", e);
    //   $state.go('boot');
    // });

    annyang.debug(true);
    
    annyang.setLanguage('es-AR');
    annyang.start({ autoRestart: true, continuous: true });
    
    $rootScope.$on('$stateChangeStart', function(ev, next, nextParams, from){
      if(['loading', 'not_found', 'clima', 'farmacias', 'noticias'].indexOf(next.name)!== -1){
        annyang.resume();
        responseTimeout=$timeout(function() {
          $state.go('active_screen');
        }, 15000);
      }
    });
}]);
