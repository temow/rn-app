angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

      .state('app', {
          url: '/app',
          abstract: true,
          cache: false,
          templateUrl: 'templates/tabs.html',
          controller: 'appCtrl'
      })

    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
        
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
    })

      .state('app.home', {
          url: '/tabHome',
          cache: false,
          views:{
              'tab-home': {
                  templateUrl: 'templates/home.html',
                  controller: 'homeCtrl'
              }
          }
      })

      .state('app.settings', {
          url: '/settings',
          cache: false,
          views:{
              'tab-settings': {
                  templateUrl: 'templates/settings.html',
                  controller: 'settingsCtrl'
              }
          }
      })

      .state('app.role', {
          url: '/role',
          cache: false,
          views:{
              'tab-settings': {
                  templateUrl: 'templates/role.html',
                  controller: 'roleCtrl'
              }
          }
      })

      .state('app.addUserToRole', {
          url: '/addUserToRole',
          cache: false,
          views:{
              'tab-settings': {
                  templateUrl: 'templates/addUserToRole.html',
                  controller: 'AddUserRole'
              }
          }
      })

      .state('app.orders', {
          url: '/orders',
          cache: false,
          views:{
              'tab-orders': {
                  templateUrl: 'templates/orders.html',
                  controller: 'orderCtrl'
              }
          }
      })

      .state('app.addProduct', {
          url: '/addProduct',
          cache: false,
          views:{
              'tab-settings': {
                  templateUrl: 'templates/addProduct.html',
                  controller: 'addProductCtrl'
              }
          }
      })

      .state('app.createColor', {
          url: '/createColor',
          cache: false,
          views:{
              'tab-settings': {
                  templateUrl: 'templates/createColor.html',
                  controller: 'colorCtrl'
              }
          }
      })

      .state('app.addColorToProduct', {
          url: '/addColorToProduct',
          cache: false,
          views:{
              'tab-settings': {
                  templateUrl: 'templates/addColorToProduct.html',
                  controller: 'addColorToProductCtrl'
              }
          }
      })

      .state('app.createCategory', {
          url: '/createCategory',
          cache: false,
          views:{
              'tab-settings': {
                  templateUrl: 'templates/createCategory.html',
                  controller: 'createCategoryCtrl'
              }
          }
      })

      .state('app.repeatOrders', {
          url: '/repeatOrders',
          cache: false,
          views:{
              'tab-orders': {
                  templateUrl: 'templates/repeatOrders.html',
                  controller: 'repeatOrdersCtrl'
              }
          }
      })

      .state('app.specificRepeatOrder', {
          url: '/specificRepeatOrder',
          cache: false,
          views:{
              'tab-orders': {
                  templateUrl: 'templates/specificRepeatOrder.html',
                  controller: 'specificRepeatOrderCtrl'
              }
          }
      })

      .state('buyer', {
          url: '/buyer',
          abstract: true,
          cache: false,
          templateUrl: 'templates/buyerSideMenu.html',
          controller: 'appCtrl'
      })

      .state('buyer.tab', {
          url: '/tab',
          abstract: true,
          cache: false,
          views:{
              'menuContent':{
                  templateUrl: 'templates/buyerTabs.html',
                  controller: 'appCtrl'
              }
          }
      })

      .state('buyer.tab.home', {
          url: '/home',
          cache: false,
          views:{
              'tab-home':{
                  templateUrl: 'templates/buyer.html',
                  controller: 'buyerHomeCtrl'
              }
          }
      })

      .state('buyer.tab.createOrder', {
          url: '/createOrder',
          cache: false,
          views:{
              'tab-order':{
                  templateUrl: 'templates/createOrder.html',
                  controller: 'buyerCreateOrderCtrl'
              }
          }
      })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});