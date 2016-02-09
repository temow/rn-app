angular.module('app', ['ionic','ionic.service.core','app.controllers', 'app.routes', 'app.services', 'app.directives', 'app.filters', 'ngCordova','ngResource','ngDreamFactory','ngStorage'])

    .constant('DSP_URL', 'http://ec2-52-74-75-163.ap-southeast-1.compute.amazonaws.com')
    .constant('DSP_API_KEY', '6498a8ad1beb9d84d63035c5d1120c007fad6de706734db9689f8996707e0f7d')

.run(function($ionicPlatform, $rootScope, $ionicLoading, $http, DSP_API_KEY, $ionicPopup) {

  $http.defaults.headers.common['X-Dreamfactory-API-Key'] = DSP_API_KEY;

  $rootScope.showLoading = function() {
    $ionicLoading.show({
      template: '<ion-spinner icon="ripple" class="spinner-assertive"></ion-spinner>'
    });
  };
  $rootScope.hideLoading = function(){
    $ionicLoading.hide();
  };

  $rootScope.showAlert = function(title,body){
    $ionicPopup.alert({
      title: title,
      template: body,
      buttons:[
        {
          text: '<b>OK</b>',
          type: 'button-assertive'
        }
      ]
    });
  }

  $rootScope.selectedProduct = {};
  $rootScope.presentBuyerProducts = [];
  $rootScope.repeatProducts = [];
  $rootScope.specificRepeatProduct = [];

  $ionicPlatform.ready(function() {

    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    Ionic.io();

  });
})

.config(function($ionicConfigProvider, $compileProvider, $httpProvider) {
  $ionicConfigProvider.tabs.position("bottom");
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
  $httpProvider.interceptors.push('httpInterceptor');
  //$ionicConfigProvider.scrolling.jsScrolling(false);
})

;
