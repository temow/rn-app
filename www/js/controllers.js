angular.module('app.controllers', [])

.controller('appCtrl', function($scope,$rootScope,$state,LoginService,$sessionStorage) {

  $scope.logout = function(){

    $scope.showLoading();

    delete $sessionStorage.currentUser;
    $state.go("login");

    $scope.hideLoading();

  }

  $scope.createOrderTabSelected = function(){
    $rootScope.selectedProduct = {};
    $state.go('buyer.createOrder');
  }

})

.controller('loginCtrl', function($scope, $rootScope, $state, $stateParams, LoginService, $window, $sessionStorage) {

  $scope.login = function(){
    $scope.showLoading();

    LoginService.login($scope.user.username, $scope.user.password).then(function(resp){
      $sessionStorage.currentUser= resp;
      $sessionStorage.currentUser.role = $sessionStorage.currentUser.roles_by_role_id;
      delete $sessionStorage.currentUser.roles_by_role_id;
      console.log(JSON.stringify($sessionStorage.currentUser));

      Ionic.User.load(String($sessionStorage.currentUser.id)).then(function(loadedUser){
        Ionic.User.current(loadedUser);
        var user = Ionic.User.current();
        console.log("User ID: "+user);
        var push = new Ionic.Push({
          "onNotification": function(notification) {
            alert('Received push notification!');
          },
          "pluginConfig": {
            "android": {
              "iconColor": "#0000FF"
            }
          }
        });
        push.register(function(token) {
          console.log("Device token:",token.token);
          var user = Ionic.User.current();// Load current user
          push.addTokenToUser(user); // Add token to that user
          user.save();
        });
      }, function(err){
        var user = Ionic.User.current();
        user.id = String($sessionStorage.currentUser.id);
        user.set('name', $sessionStorage.currentUser.firstname+" "+$sessionStorage.currentUser.lastname);
        console.log(user);
        user.save();
        var push = new Ionic.Push({
          "onNotification": function(notification) {
            alert('Received push notification!');
          },
          "pluginConfig": {
            "android": {
              "iconColor": "#0000FF"
            }
          }
        });
        push.register(function(token) {
          console.log("Device token:",token.token);
          var user = Ionic.User.current();// Load current user
          push.addTokenToUser(user); // Add token to that user
          user.save();
        });
        console.log("User was not created: "+err);
      });

      if($sessionStorage.currentUser.role.name == "Admin"){
        $state.go("app.home");
      }
      else{
        $state.go("buyer.home");
      }

      $scope.hideLoading();
    }, function(err){
      console.log("Error: "+err);
      $scope.hideLoading();
    });
  }

})

.controller('signupCtrl', function($scope) {

})

.controller('homeCtrl', function($scope,LoginService, $http, $resource, $sessionStorage) {

  $scope.name = $sessionStorage.currentUser.firstname;

})

.controller('settingsCtrl', function(){

})

.controller('roleCtrl', function($scope, RoleService, $ionicLoading) {

  this.role = {};

  this.createRole = function(){

    $scope.showLoading();
    var createRolePromise = RoleService.createRole(this.role.name);
    createRolePromise.then(function(resp){
      console.log(resp);
      $scope.hideLoading();
    },function(err){
      console.log(err);
      alert("Not Created: "+err);
      $scope.hideLoading();
    });

  }

})

.controller('AddUserRole', function($scope, LoginService, RoleService, $ionicLoading) {

  $scope.user = {};

  $scope.roles = [];

  $scope.getAllRoles = function(){

    RoleService.getAllRoles().then(function(data){
      console.log(data);
      for(var i=0;i<data.length;i++){
        $scope.roles.push(data[i]);
        console.log($scope.roles[i].name)
      }
      //Hide loading
     $scope.hideLoading();
    },function(error){
      //Hide loading
      $scope.hideLoading();
      console.log(error);
    });

  }

  $scope.createUserWithRole = function() {

    if($scope.user.password === $scope.user.confirm_password){

      $scope.showLoading();

      RoleService.createUserWithRole($scope.user).then(function(resp){
        console.log("User Created: "+resp);
        $scope.hideLoading();
      }, function(err){
        console.log("Error: "+JSON.stringify(err));
        $scope.hideLoading();
      });

    }
    else{
        var title = "Password Mismatch";
        var body = "The entered passwords did not match.<br>Please enter both the passwords again."
        $scope.showAlert(title,body);
    }

  }

})

.controller('orderCtrl', function($scope, $rootScope, $state, RoleService, OrderService) {

  $scope.allOrders = [];
  $scope.products = [];
  $scope.counter = 0;

  $scope.getAllOrders = function(){

    $scope.showLoading();

    RoleService.getAllRoles().then(function(data)
    {
      console.log(data);
      for(var i=0;i<data.length;i++)
      {
        if(data[i].name == "Admin")
        {
          continue;
        }
        $scope.allOrders.push({role:data[i],repeatProducts:[]});
        console.dir("All Orders: "+JSON.stringify($scope.allOrders));
        $scope.hideLoading();
      }
    }).then(function() {
      for (var i = 0; i < $scope.allOrders.length; i++) {

        (function (i) {
          console.log("i is " + i);
          OrderService.getSpecificRoleRepeatOrder($scope.allOrders[i].role.id).then(function (data) {
            var tempProducts = data;
            $scope.counter = 0;
            for (var j = 0; j < tempProducts.length; j++) {
              (function (j) {
                $scope.allOrders[i].repeatProducts.push({
                  id:tempProducts[j].id,
                  productName: tempProducts[j].product_name,
                  categoryName: tempProducts[j].category_by_category_id.name,
                  image: tempProducts[j].image,
                  createdBy: tempProducts[j].users_by_user_id.firstname + " " + tempProducts[j].users_by_user_id.lastname,
                  createdAt:tempProducts[j].create_time,
                  colorAndQuantity: JSON.parse(tempProducts[j].color_quantity),
                  viewed: tempProducts[j].viewed
                });

                if (tempProducts[j].viewed == false) {
                  $scope.counter++;
                  console.log("Counter for i="+i+": "+$scope.counter);
                }

              })(j);
              console.log("j is " + j + " and i is " + i);
              $scope.allOrders[i].notViewed =  $scope.counter;
              $scope.hideLoading();
            }
          });
        })(i);
      }
      console.dir($scope.allOrders);
      $scope.hideLoading();
    });
  }

  $scope.repeatOrder = function(role,products){
    $rootScope.repeatProducts = products;
    $rootScope.repeatProducts.role = role;
    $state.go("app.repeatOrders")
  }

})

.controller('repeatOrdersCtrl', function($scope, $rootScope, $state){

  $scope.products = $rootScope.repeatProducts;
  $scope.products.role = $rootScope.repeatProducts.role;

  $scope.specificRepeatOrder = function(specificProduct){

    var result = $.grep($rootScope.repeatProducts, function(e){ return e.id == specificProduct.id; });
    console.log("Selected: "+JSON.stringify(result));
    var index = $rootScope.repeatProducts.indexOf(specificProduct);
    console.log("Index: "+index);
    if (index !== -1) {
      specificProduct.viewed = true;
      $rootScope.repeatProducts[index] = specificProduct;
    }
    $rootScope.specificRepeatProduct = specificProduct;
    $state.go("app.specificRepeatOrder");
  }

})

.controller('specificRepeatOrderCtrl', function($scope, $rootScope, $state, OrderService){

  $scope.product = $rootScope.specificRepeatProduct;
  $scope.product.totalQty = 0;

  OrderService.setViewed($scope.product.id);

  console.log($scope.product);

  $scope.populateTotalQuantity = function(){
    for(var i=0;i<$scope.product.colorAndQuantity.length;i++){
      $scope.product.totalQty += $scope.product.colorAndQuantity[i].qty;
    }
  }

})

.controller('addProductCtrl', function($scope, RoleService, $ionicActionSheet, CameraService, ColorService, CategoryService, ProductService, S3Service) {
  $scope.roles = [];
  $scope.product = {};
  $scope.colors = [];
  $scope.categories = [];

  $scope.getAllRoles = function(){
    $scope.showLoading();
    RoleService.getAllRoles().then(function(data){
      console.log(data);
      for(var i=0;i<data.length;i++){
        $scope.roles.push(data[i]);
        console.log($scope.roles[i].name)
        $scope.hideLoading();
      }
    },function(error){
      console.log(error);
      $scope.hideLoading();
    });
  };

  $scope.addMedia = function(){
    $scope.hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<span class="assertive">Take photo</span>' },
        { text: '<span class="assertive">Photo from library</span>' }
      ],
      titleText: '<b>Add Product Image</b>',
      cancelText: '<span class="button button-block button-assertive">Cancel</span>',
      buttonClicked: function(index) {
        $scope.takePicture(index);
      }
    });
  }

  $scope.takePicture = function(type) {

    var source;
    switch (type) {
      case 0:
        source = Camera.PictureSourceType.CAMERA;
        break;
      case 1:
        source = Camera.PictureSourceType.PHOTOLIBRARY;
        break;
    }

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: source,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

    CameraService.getPicture(options).then(function(imageURI) {
      $scope.showLoading();
      console.log(imageURI);
      var base64pic = "data:image/jpeg;base64," + imageURI;
      $scope.product.image = base64pic;
      $scope.product.blob = imageURI;
      $scope.hideLoading();
    }, function(err) {
      console.dir(err);
      $scope.hideLoading();
    });
  };

  $scope.addProduct = function(){

    $scope.showLoading();

    ProductService.addProduct($scope.product).then(function(resp){
      console.log("Product Saved");
      $scope.hideLoading();
    }, function(err){
      console.log("Error: "+err);
      $scope.hideLoading();
    });

  }

  $scope.getAllCategories = function(){

    $scope.showLoading();

    CategoryService.getAllCategories().then(function(data){
      for(var i=0;i<data.length;i++){
        $scope.categories.push(data[i]);
        console.log($scope.categories[i].name)
        $scope.hideLoading();
      }
    }, function(err){
      console.dir("Error: "+err);
      $scope.hideLoading();
    });

  }

})

.controller('colorCtrl', function($scope, ColorService) {

  $scope.color = {};

  $scope.createColor = function(){
    $scope.showLoading();

      ColorService.createColor($scope.color.name).then(function(result){
        console.log("Created");
        $scope.hideLoading();
      },function(err){
        console.dir(err);
        $scope.hideLoading();
      });
    }

})

.controller('addColorToProductCtrl', function($scope, $http, $q,$rootScope,ProductService, S3Service, ColorService, $ionicModal, $ionicPopup, CameraService, $ionicActionSheet ) {

  $scope.products = [];
  $scope.product = {};
  $scope.colors = [];
  $scope.selectedColors = [];
  $scope.selectedColorsPics = [];

  $scope.getAllProducts = function(){
    $scope.showLoading();
    ProductService.getAllProducts().then(function(data){
      console.dir(data);
      for(var i=0;i<data.length;i++) {
        $scope.products.push(data[i]);
        console.log($scope.products[i].name)
      }
      $scope.hideLoading();
    }, function(err){
      console.dir(err);
      $scope.hideLoading();
    });
  };

  $ionicModal.fromTemplateUrl('colorModal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.selectedColors = [];
    for(var i=0;i<$scope.colors.length;i++){
      if($scope.colors[i].checked){
        $scope.selectedColors.push($scope.colors[i].name);
      }
    }
    console.log($scope.selectedColors);
    $scope.modal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });

  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  $scope.unSelectColors = function(){
    for(var i=0;i<$scope.colors.length;i++){
      $scope.colors[i].checked = false;
    }
  }

  $scope.getColors = function(product){

    $scope.showLoading();

    $scope.selectedColors = [];

    $scope.unSelectColors();

    $scope.product = product;

    $scope.getAllColors();

    ColorService.getSpecificProductColors(product).then(function(result){

      Array.prototype.getIndexBy = function (name, value) {
        for (var i = 0; i < this.length; i++) {
          if (this[i][name] == value) {
            return i;
          }
        }
        return -1;
      }

      if(result.resource[0].colors_pictures){
        result.resource[0].colors_pictures = JSON.parse(result.resource[0].colors_pictures);
        console.log("After: "+JSON.stringify(result.resource[0]));


        for(var i=0;i<result.resource[0].colors_pictures.length;i++){

          $scope.selectedColors.push({name:result.resource[0].colors_pictures[i].name});

          var index = $scope.colors.getIndexBy("name",result.resource[0].colors_pictures[i].name);
          console.log("Index: "+index);
          if (index !== -1) {
            if (result.resource[0].colors_pictures[i].hasOwnProperty("image")) {
              $scope.colors[index].name = result.resource[0].colors_pictures[i].name;
              $scope.colors[index].image = result.resource[0].colors_pictures[i].image;
              $scope.colors[index].checked = true;
            }
            else {
              $scope.colors[index].name = result.resource[0].colors_pictures[i].name;
              $scope.colors[index].checked = true;
            }
          }
        }
      }


      console.dir("Colors: "+JSON.stringify($scope.colors));
      console.dir("Selected Colors: "+JSON.stringify($scope.selectedColors));
      $scope.hideLoading();
    }, function(err){
      console.log(err.message);
      $scope.hideLoading();
    });

  }

  $scope.getAllColors = function(){

    $scope.colors = [];

    ColorService.getAllColors().then(function(data){
      for(var i=0;i<data.length;i++) {
        $scope.colors.push({name: data[i].name,checked:false});
      }
      console.dir($scope.colors);
    }, function(err){
      console.dir(err);
    });
  }

  $scope.addMedia = function(color){
    $scope.hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<span class="assertive">Take photo</span>' },
        { text: '<span class="assertive">Photo from library</span>' }
      ],
      titleText: '<b>Add Product Image</b>',
      cancelText: '<span class="button button-block button-assertive">Cancel</span>',
      buttonClicked: function(index) {
        $scope.takePicture(index, color);
      }
    });
  }

  $scope.takePicture = function(type, color) {

    var source;
    switch (type) {
      case 0:
        source = Camera.PictureSourceType.CAMERA;
        break;
      case 1:
        source = Camera.PictureSourceType.PHOTOLIBRARY;
        break;
    }

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: source,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

    CameraService.getPicture(options).then(function(imageURI) {
      $scope.showLoading();
      var base64pic = "data:image/jpeg;base64," + imageURI;
      for(var i=0;i<$scope.colors.length;i++) {
        if ($scope.colors[i].name === color.name) {
          $scope.colors[i].image = base64pic;
          $scope.colors[i].blob = imageURI;
        }
      }
      $scope.hideLoading();
    }, function(err) {
      console.dir(err);
      $scope.hideLoading();
    });
  }

  $scope.addColorToProduct = function(){

   $scope.selectedColorsPics = [];

    for(var i=0;i<$scope.colors.length;i++){
      (function(i){
        console.dir($scope.colors[i]);
        if($scope.colors[i].checked){

          var string = $scope.colors[i].image,
              substring = "http";
          console.log(string.indexOf(substring));
          if (string.indexOf(substring) === -1) {
            $scope.showLoading();
            var d = new Date();
            var n = d.getTime();
            var imageName = n+".jpg";

            S3Service.uploadPicture("color-images",imageName,$scope.colors[i].blob).then(function(resp){

              console.log("Picture Uploaded for color");
              $scope.selectedColorsPics.push({name:$scope.colors[i].name,image:"https://s3-ap-southeast-1.amazonaws.com/rn-app/color-images/"+imageName});
              $scope.updateRecord();
              $scope.hideLoading();
            }, function(err){
              console.log("Error: "+err);
              $scope.hideLoading();
            });
          }
          else{
            if($scope.colors[i].image !== "http://placehold.it/100x100"){
              $scope.selectedColorsPics.push({name:$scope.colors[i].name,image:$scope.colors[i].image});
              $scope.updateRecord();
            }
            else {
              $scope.selectedColorsPics.push({name:$scope.colors[i].name});
              $scope.updateRecord();
            }
          }
        }
      })(i);

    }
    console.dir("Color And Pics: " + JSON.stringify($scope.selectedColorsPics));

  }

  $scope.updateRecord = function(){

    var deferred = $q.defer();

    var putData = {
      resource: [
        {
          id:$scope.product.id,
          colors_pictures:JSON.stringify($scope.selectedColorsPics)
        }
      ]
    }

    $http.put('/api/v2/mysql/_table/products',putData).then(function(resp) {
      console.log("Success: "+resp.data);
      deferred.resolve(resp.data.resource);
    }, function(err) {
      console.error('ERR', JSON.stringify(err));
      deferred.reject(err);
    });

    return deferred.promise;

  }

})

.controller('createCategoryCtrl', function($scope, CategoryService) {

  $scope.category = {};

  $scope.createCategory = function(){

    $scope.showLoading();

    CategoryService.createCategory($scope.category.name).then(function(response){
      console.log("Created Category");
      $scope.hideLoading();
    }, function(err){
      console.dir("Error: "+err);
      $scope.hideLoading();
    });

  }

})

.controller('allBuyersCtrl', function($scope, RoleService, $ionicModal, $ionicPopup){

  $scope.listCanSwipe = true

  $scope.getAllBuyers = function(){

    $scope.buyers = [];
    $scope.showLoading();
    RoleService.getAllRoles().then(function(resp){
      $scope.buyers = resp;
      console.log(resp);
      $scope.hideLoading();
    }, function(err){
      console.log(err);
      $scope.hideLoading();
    });

  }

  $scope.delete = function(item) {

    $scope.showConfirm = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete Buyer',
        template: 'Are you sure you want delete this buyer from the database?'
      });

      confirmPopup.then(function (res) {
        if (res) {
          $scope.showLoading();
          RoleService.deleteRole(item).then(function (resp) {
            console.log("Successfully deleted role: " + resp);
            $scope.buyers = $scope.buyers.filter(function(el){
              return el.id !== item.id;
            });
            $scope.hideLoading();
          }, function (err) {
            console.log("Could not delete role: " + JSON.stringify(err));
            $scope.hideLoading();
          });
        } else {
          console.log('You are not sure');
        }
      });
    }

    $scope.showConfirm();

  }

  $ionicModal.fromTemplateUrl('edit-buyer.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function(buyer) {
    $scope.buyer = buyer;
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.edit = function(item){

    $scope.showLoading();

    RoleService.editRole(item).then(function(resp){
      console.log("Role edited: "+JSON.stringify(resp));
      $scope.hideLoading();
      $scope.closeModal();
    }, function(err){
      console.log("Role not edited: "+JSON.stringify(err));
      $scope.hideLoading();
    });

  }

})

.controller('allProductsCtrl', function($scope, ProductService, $ionicModal, RoleService, CategoryService, $ionicActionSheet, CameraService ){

  $scope.listCanSwipe = true;

  $scope.roles = [];
  $scope.categories = [];

  $scope.getAllProducts = function(){

    $scope.products = [];

    $scope.showLoading();

    ProductService.getAllProducts().then(function(resp){
      $scope.products = resp;
      console.log(resp);
      $scope.hideLoading();
    }, function(err){
      console.log(err);
      $scope.hideLoading();
    });

  }

  $scope.getAllRoles = function(){
    $scope.showLoading();
    RoleService.getAllRoles().then(function(data){
      console.log(data);
      for(var i=0;i<data.length;i++){
        $scope.roles.push(data[i]);
        console.log($scope.roles[i].name)
        $scope.hideLoading();
      }
    },function(error){
      console.log(error);
      $scope.hideLoading();
    });
  }

  $scope.getAllCategories = function(){

    $scope.showLoading();

    CategoryService.getAllCategories().then(function(data){
      for(var i=0;i<data.length;i++){
        $scope.categories.push(data[i]);
        console.log($scope.categories[i].name)
        $scope.hideLoading();
      }
    }, function(err){
      console.dir("Error: "+err);
      $scope.hideLoading();
    });

  }

  $scope.delete = function(item){

    $scope.showLoading();

    ProductService.deleteProduct(item).then(function(resp){
      console.log("Successfully deleted product: "+resp);
      $scope.hideLoading();
    }, function(err){
      console.log("Could not delete product: "+JSON.stringify(err));
      $scope.hideLoading();
    });

  }

  $ionicModal.fromTemplateUrl('edit-product.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function(product) {
    console.log("Selected Product: "+JSON.stringify(product));
    $scope.product = product;
    var imageArray = $scope.product.image.split("/");
    var imageName = imageArray[imageArray.length-1];
    $scope.product.imageName = imageName;
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.addMedia = function(){
    $scope.hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '<span class="assertive">Take photo</span>' },
        { text: '<span class="assertive">Photo from library</span>' }
      ],
      titleText: '<b>Add Product Image</b>',
      cancelText: '<span class="button button-block button-assertive">Cancel</span>',
      buttonClicked: function(index) {
        $scope.takePicture(index);
      }
    });
  }

  $scope.takePicture = function(type) {

    var source;
    switch (type) {
      case 0:
        source = Camera.PictureSourceType.CAMERA;
        break;
      case 1:
        source = Camera.PictureSourceType.PHOTOLIBRARY;
        break;
    }

    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: source,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      correctOrientation:true
    };

    CameraService.getPicture(options).then(function(imageURI) {
      $scope.showLoading();
      console.log(imageURI);
      var base64pic = "data:image/jpeg;base64," + imageURI;
      $scope.product.image = base64pic;
      $scope.product.blob = imageURI;
      $scope.hideLoading();
    }, function(err) {
      console.dir(err);
      $scope.hideLoading();
    });
  };

  $scope.edit = function(item){

    $scope.showLoading();

    console.log("Going to edit item: "+JSON.stringify(item));

    ProductService.editProduct(item).then(function(resp){
      console.log("Product edited: "+JSON.stringify(resp));
      $scope.hideLoading();
      $scope.closeModal();
    }, function(err){
      console.log("Product not edited: "+JSON.stringify(err));
      $scope.hideLoading();
    });

  }

})

.controller('allCategoriesCtrl', function($scope, CategoryService, $ionicModal){

  $scope.listCanSwipe = true

  $scope.getAllCategories = function(){

    $scope.categories = [];

    $scope.showLoading();

    CategoryService.getAllCategories().then(function(resp){
      $scope.categories = resp;
      console.log(resp);
      $scope.hideLoading();
    }, function(err){
      console.log(err);
      $scope.hideLoading();
    });

  }

  $scope.delete = function(item){

    $scope.showLoading();

    CategoryService.deleteCategory(item).then(function(resp){
      console.log("Successfully deleted cateogry: "+resp);
      $scope.hideLoading();
    }, function(err){
      console.log("Could not delete cateogry: "+JSON.stringify(err));
      $scope.hideLoading();
    });

  }

  $ionicModal.fromTemplateUrl('edit-category.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function(category) {
    $scope.category = category;
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.edit = function(item){

    $scope.showLoading();

    CategoryService.editCategory(item).then(function(resp){
      console.log("Category edited: "+JSON.stringify(resp));
      $scope.hideLoading();
      $scope.closeModal();
    }, function(err){
      console.log("Category not edited: "+JSON.stringify(err));
      $scope.hideLoading();
    });

  }

})

.controller('allColorsCtrl', function($scope, ColorService, $ionicModal){

  $scope.listCanSwipe = true;

  $scope.getAllColors = function(){

    $scope.colors = [];

    $scope.showLoading();

    ColorService.getAllColors().then(function(resp){
      $scope.colors = resp;
      console.log(resp);
      $scope.hideLoading();
    }, function(err){
      console.log(err);
      $scope.hideLoading();
    });

  }

  $scope.delete = function(item){

    $scope.showLoading();

    ColorService.deleteColor(item).then(function(resp){
      console.log("Successfully deleted color: "+resp);
      $scope.hideLoading();
    }, function(err){
      console.log("Could not delete color: "+JSON.stringify(err));
      $scope.hideLoading();
    });

  }

  $ionicModal.fromTemplateUrl('edit-color.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function(color) {
    $scope.color = color;
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.edit = function(item){

    $scope.showLoading();

    ColorService.editColor(item).then(function(resp){
      console.log("Color edited: "+JSON.stringify(resp));
      $scope.hideLoading();
      $scope.closeModal();
    }, function(err){
      console.log("Color not edited: "+JSON.stringify(err));
      $scope.hideLoading();
    });

  }

})

;
