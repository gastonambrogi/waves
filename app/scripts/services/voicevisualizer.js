'use strict';

/**
 * @ngdoc service
 * @name wavesApp.voiceVisualizer
 * @description
 * # voiceVisualizer
 * Service in the wavesApp.
 */
angular.module('wavesApp')
  .service('voiceVisualizer', ['$window', function ($window) {
      $window.navigator.getUserMedia = ($window.navigator.getUserMedia ||
                            $window.navigator.webkitGetUserMedia ||
                            $window.navigator.mozGetUserMedia ||
                            $window.navigator.msGetUserMedia);
  
      var audioCtx = new ($window.AudioContext || $window.webkitAudioContext)();
      
      var source;
      var stream;
  
      var analyser = audioCtx.createAnalyser();
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.85;
  
      var distortion = audioCtx.createWaveShaper();
      var gainNode = audioCtx.createGain();
      var biquadFilter = audioCtx.createBiquadFilter();
      var convolver = audioCtx.createConvolver();
      
      var canvas,
          canvasCtx,
          intendedWidth, 
          drawVisual;
      
      var WIDTH;
      var HEIGHT;
/*
      var _frequency = 1.5;
      var _phase = 0;
      var _amplitude = 1.0;
      var _whiteValue = 1.0;
      var _idleAmplitude = 0.1;
      var _dampingAmplitude = 1;
      var _dampingFactor = 0.86;
      var _waves = 1;
      var _waveWidth = 2;
      var _phaseShift = -0.15;
      var _density = 5.0;
      var _maxAmplitude = 0.5;
*/

      return {
        init: function( cnvs ){
          
          canvas = cnvs;
          canvasCtx = cnvs.getContext("2d");
          intendedWidth = document.querySelector('.visualizer-wrapper').clientWidth;
          canvas.setAttribute('width', intendedWidth);
          canvas.setAttribute('height', 400);

          
          if ($window.navigator.getUserMedia) {
            
            $window.navigator.getUserMedia ( 
              { audio: true },
              function(stream) {
                source = audioCtx.createMediaStreamSource(stream);
                source.connect(analyser);
                analyser.connect(distortion);
                distortion.connect(biquadFilter);
                biquadFilter.connect(convolver);
                convolver.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                
                $window.cancelAnimationFrame(drawVisual);
              },
              function err() {
                // console.log('The following gUM error occured: ' + err);
              });
          } else {
            // console.log('getUserMedia not supported on your browser!');
          }
          this.visualize();
          return this;
        }, 
        visualize: function (){
          WIDTH = canvas.width;
          HEIGHT = canvas.height;
          analyser.fftSize = 512;
          var bufferLength = analyser.frequencyBinCount;
          // var bufferLength = analyser.fftSize;

          var dataArray = new Uint8Array(bufferLength);

          canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

/*          function drawSin() {
            drawVisual = requestAnimationFrame(drawSin);
            analyser.getByteFrequencyData(dataArray);
            // analyser.getByteTimeDomainData(dataArray);

            canvasCtx.fillStyle = 'rgb(0, 0, 0)';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgb(255, 255, 255)';
            canvasCtx.beginPath();

            var sliceWidth = WIDTH * 1.0 / bufferLength;
            var x = 0;
            
            for(var i = 0; i < bufferLength; i++) {
              var v = dataArray[i]; //Vale de 0 a 255
              var value = map(v, 0, 255, 0, 100) /100;

              for (var w = 0; w < _waves; w++) {
                // 
                if (value > _dampingAmplitude) _dampingAmplitude += (Math.min(value,1.0)-_dampingAmplitude)/4.0;
                else if (value<0.01) _dampingAmplitude *= _dampingFactor;
                // _phase += _phaseShift;
                _phase += -sliceWidth;
                _amplitude = Math.max( Math.min(_dampingAmplitude*20, 1.0), _idleAmplitude);
                // 
                var maxAmplitude = (HEIGHT/2) * _maxAmplitude - 4;
                var progress = 1.0- w / _waves;
                var normedAmplitude = (1.5 * progress - 0.5) * _amplitude;
                var multiplier = Math.min(1.0, (progress / 3.0 * 2.0) + (1.0 / 3.0));

                //canvasCtx.strokeStyle = 'rgba(255, 255, 255, '+multiplier+')';

                // 
                var scaling = -Math.pow(1 / (WIDTH/2) * (x - (WIDTH/2)), 2) + 1;
                var _y = scaling * maxAmplitude * normedAmplitude * Math.sin(2 *Math.PI *(x / WIDTH) * _frequency + _phase) + (HEIGHT/2);
                // 

                var y = (HEIGHT-HEIGHT/4) - v;
                if(i === 0) {
                  canvasCtx.moveTo(x, _y);
                } else {
                  canvasCtx.lineTo(x, _y);
                }
                x += sliceWidth;
              }
            }
            canvasCtx.lineTo(WIDTH, HEIGHT/2);
            canvasCtx.stroke();
          };
          drawSin();*/

          function supercalifragilistic_function(x){
            function E(x){
              return 0.1 + Math.pow(Math.sin(x),2) + 0.35*Math.pow(Math.E, -0.5*Math.pow((x/0.4),2));
            }
            function H(x){
              return Math.cos(21*x);
            }
            function G(x){
              return Math.pow(Math.E, (-0.5*Math.pow(((x-0.15)/0.10), 2)));
            }
            return E(x)*H(x)*(1-(0.5*G(x)))+((1/6)*G(x));
          }
          
          function basic_function(x){
            return Math.sin(x/256)*Math.sin(20*x/256);
          }

          function drawSimple(){
            drawVisual = requestAnimationFrame(drawSimple);
            analyser.getByteTimeDomainData(dataArray);

            canvasCtx.fillStyle = 'rgb(0, 0, 0)';
            canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = 'rgb(255, 255, 255)';
            canvasCtx.beginPath();

            var sliceWidth = WIDTH * 1.0 / bufferLength;
            var x = 0, y;

            for(var i = 0; i < bufferLength; i++) {
              x = i * (sliceWidth + 1);
              // y = dataArray[i]/256 * HEIGHT;                                 //Meh, stupidly ugly.
              y = basic_function(dataArray[i])*(HEIGHT/6)+(HEIGHT/2);
              // y = dataArray[i]*basic_function(x)+(HEIGHT/2);                 //Became amazing.
              // y = dataArray[i]*supercalifragilistic_function(x)+(HEIGHT/2);    //So near to the real amazing sine wave form! 
              if(i === 0) {
                canvasCtx.moveTo(x, y);
              } else {
                canvasCtx.lineTo(x, y);
              }
            } 
            canvasCtx.lineTo(WIDTH, HEIGHT/2);
            canvasCtx.stroke();
          }
          drawSimple();
        }
      };
    }]);
/*function map ( value, in_min , in_max , out_min , out_max ) {
  return ( value - in_min ) * ( out_max - out_min ) / ( in_max - in_min ) + out_min;
}*/