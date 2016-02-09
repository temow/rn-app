angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

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

      .state('app.all-buyers', {
          url: '/all-buyers',
          cache: false,
          views:{
              'tab-home': {
                  templateUrl: 'templates/all-buyers.html',
                  controller: 'allBuyersCtrl'
              }
          }
      })

      .state('app.all-products', {
          url: '/all-products',
          cache: false,
          views:{
              'tab-home': {
                  templateUrl: 'templates/all-products.html',
                  controller: 'allProductsCtrl'
              }
          }
      })

      .state('app.all-categories', {
          url: '/all-categories',
          cache: false,
          views:{
              'tab-home': {
                  templateUrl: 'templates/all-categories.html',
                  controller: 'allCategoriesCtrl'
              }
          }
      })

      .state('app.all-colors', {
          url: '/all-colors',
          cache: false,
          views:{
              'tab-home': {
                  templateUrl: 'templates/all-colors.html',
                  controller: 'allColorsCtrl'
              }
          }
      })

      .state('buyer', {
          url: '/buyer',
          abstract: true,
          cache: false,
          templateUrl: 'templates/buyerTabs.html',
          controller: 'appCtrl'
      })

      //.state('buyer.tab', {
      //    url: '/tab',
      //    abstract: true,
      //    cache: false,
      //    views:{
      //        'menuContent':{
      //            templateUrl: 'templates/buyerTabs.html',
      //            controller: 'appCtrl'
      //        }
      //    }
      //})

      .state('buyer.home', {
          url: '/home',
          cache: false,
          views:{
              'tab-home':{
                  templateUrl: 'templates/buyer.html',
                  controller: 'buyerHomeCtrl'
              }
          }
      })

      .state('buyer.viewMoreProducts', {
          url: '/viewMoreProducts',
          cache: false,
          views:{
              'tab-home':{
                  templateUrl: 'templates/viewMoreProducts.html',
                  controller: 'viewMoreProductsCtrl'
              }
          }
      })

      .state('buyer.productPage', {
          url: '/productPage',
          cache: false,
          views:{
              'tab-home':{
                  templateUrl: 'templates/productPage.html',
                  controller: 'productPageCtrl'
              }
          }
      })

      .state('buyer.createOrder', {
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