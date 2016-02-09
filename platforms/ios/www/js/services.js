angular.module('app.services', [])

.factory('httpInterceptor', function (DSP_URL) {
  return {
    request: function (config) {
      // Prepend instance url before every api call
      if (config.url.indexOf('/api/v2') > -1) {
        config.url = DSP_URL + config.url;
      };
      return config;
    }
  }
})

.factory('BlankFactory', [function(){

}])

.factory('CameraService', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }

}])

.service('LoginService', ['$q','$http',function($q, $http){

  this.login = function(username, password) {

    var deferred = $q.defer();

    $http.get('/api/v2/mysql/_table/users',{params:{
      related: 'roles_by_role_id',
      filter: 'username='+username
    }}).then(function(resp) {
      console.log(resp.data);
      for(var i=0;i<resp.data.resource.length;i++){
        if(resp.data.resource[i].password == password){
          console.log("Authenticated");
          deferred.resolve(resp.data.resource[i]);
        }
        else{
          deferred.reject(resp.data);
        }
      }
    }, function(err) {
      console.error('ERR', err);
      deferred.reject(err);
    });

    return deferred.promise;

  }

  this.getUserRole = function(user){



  }

  this.logout = function() {
    var currentUser = Parse.User.current();
    if(currentUser)
    {
      return Parse.User.logOut();
    }
  }

  this.getUser = function() {
    return Parse.User.current();
  }

  this.getAllUsers = function(){
    var query = new Parse.Query(Parse.User);
    return query.find().then(function(response){
      if(typeof response === 'object'){
        return response;
      }
      else {
        return $q.reject(response);
      }
    },function(response){
      return $q.reject(response);
    });
  }

  this.getSpecificUser = function(username){
    var query = new Parse.Query(Parse.User);
    query.equalTo("username",username);
    return query.find().then(function(response){
      if(typeof response === 'object'){
        return response;
      }
      else {
        return $q.reject(response);
      }
    },function(response){
      return $q.reject(response);
    });
  }

  this.checkUserRole = function(userObject,roleName){
    var query = new Parse.Query(Parse.Role);
    query.equalTo("name", roleName);
    query.equalTo("users", userObject);
    return query.first().then(function(response) {
        console.log("Inner: "+response);
        return response;
    },function(response){
      return $q.reject(response);
    });
  }

}])

.service('RoleService', ['$q', '$http', function($q, $http){

  this.createRole = function(roleName){

    var deferred = $q.defer();

    var postData = {name:roleName};

    $http.post('/api/v2/mysql/_table/roles',postData).then(function(resp) {
      console.log("Success: "+resp.data);
      deferred.resolve(resp.data);
    }, function(err) {
      console.error('ERR', err);
      deferred.reject(err);
    });

    return deferred.promise;

  }

  this.getAllRoles = function(){
    var deferred = $q.defer();

    $http.get('/api/v2/mysql/_table/roles').then(function(resp) {
      console.log(resp.data);
      deferred.resolve(resp.data.resource);
    }, function(err) {
      console.error('ERR', err);
      deferred.reject(err);
    });

    return deferred.promise;

  }

  this.getSpecificRole = function(role){
    var query = new Parse.Query(Parse.Role);
    query.equalTo("name",role);
    return query.find().then(function(response){
      if(typeof response === 'object'){
        return response;
      }
      else {
        return $q.reject(response);
      }
    },function(response){
      return $q.reject(response);
    });
  }

 this.createUserWithRole = function(user){

   var deferred = $q.defer();

   var postData = {
     firstname: user.firstname,
     lastname: user.lastname,
     username: user.username,
     email: user.email,
     password: user.password,
     role_id: user.role};

   $http.post('/api/v2/mysql/_table/users',postData).then(function(resp) {
     console.log("Success: "+resp.data);
     deferred.resolve(resp.data);
   }, function(err) {
     console.error('ERR', err);
     deferred.reject(err);
   });

   return deferred.promise;

 }

  this.getUserRole = function(user){

  }

}])

.service('ColorService', ['$q', '$http',function($q,$http){

  this.createColor = function(colorName){

    var deferred = $q.defer();

    var postData = {name:colorName};

    $http.post('/api/v2/mysql/_table/colors',postData).then(function(resp) {
      console.log("Success: "+resp.data);
      deferred.resolve(resp.data);
    }, function(err) {
      console.error('ERR', err);
      deferred.reject(err);
    });

    return deferred.promise;

  }

  this.getAllColors = function(){

    var deferred = $q.defer();

    $http.get('/api/v2/mysql/_table/colors').then(function(resp) {
      console.log(resp.data);
      deferred.resolve(resp.data.resource);
    }, function(err) {
      console.error('ERR', err);
      deferred.reject(err);
    });

    return deferred.promise;

  }

  this.getSpecificProductColors = function(product){

    var deferred = $q.defer();

    $http.get('/api/v2/mysql/_table/products',{params:{
      filter: 'id='+product.id
    }}).then(function(resp) {
      console.log(resp.data);
      deferred.resolve(resp.data);
    }, function(err) {
      console.error('ERR', err);
      deferred.reject(err);
    });

    return deferred.promise;

  }

}])

.service('ProductService',['$q', '$http', 'S3Service', function($q, $http, S3Service){

  this.getAllProducts = function(){

    var deferred = $q.defer();

    $http.get('/api/v2/mysql/_table/products').then(function(resp) {
      console.log(resp.data);
      deferred.resolve(resp.data.resource);
    }, function(err) {
      console.error('ERR', err);
      deferred.reject(err);
    });

    return deferred.promise;

  }

  this.getSpecificRoleProduct = function(role){

    var deferred = $q.defer();

    $http.get('/api/v2/mysql/_table/products',{params:{
      related: 'category_by_category_id',
      filter: 'role_id='+role
    }}).then(function(resp) {
      console.log(resp.data);
          deferred.resolve(resp.data.resource);
    }, function(err) {
      console.error('ERR', err);
      deferred.reject(err);
    });

    return deferred.promise;

  }

  this.addProduct = function(product){

    console.log(product);

    var d = new Date();
    var n = d.getTime();
    var imageName = n+product.category+".jpg";

    var deferred = $q.defer();

    S3Service.uploadPicture("product-images",imageName,product.blob).then(function(resp){

      console.log("Picture uploaded");

      var postData = {name: product.name,
        role_id: product.role,
        category_id: product.category,
        image: "https://s3-ap-southeast-1.amazonaws.com/rn-app/product-images/"+imageName};

      $http.post('/api/v2/mysql/_table/products',postData).then(function(resp) {
        console.log("Success: "+resp.data);
        deferred.resolve(resp.data);
      }, function(err) {
        console.error('ERR', err);
        deferred.reject(err);
      });

      return deferred.promise;

    }, function(err){
      console.log("Error: "+err);
    });

    return deferred.promise;

  }

}])

.service('CategoryService',['$q', '$http', function($q, $http){

  this.createCategory = function(categoryName){
    var deferred = $q.defer();

    var postData = {name:categoryName};

    $http.post('/api/v2/mysql/_table/category',postData).then(function(resp) {
      console.log("Success: "+resp.data);
      deferred.resolve(resp.data);
    }, function(err) {
      console.error('ERR', err);
      deferred.reject(err);
    });

    return deferred.promise;
  }

  this.getAllCategories = function(){
    var deferred = $q.defer();

    $http.get('/api/v2/mysql/_table/category').then(function(resp) {
      console.log(resp.data);
      deferred.resolve(resp.data.resource);
    }, function(err) {
      console.error('ERR', err);
      deferred.reject(err);
    });

    return deferred.promise;
  }

}])

.service('OrderService', ['$q','RoleService', '$http',function($q, RoleService, $http){

  this.getSpecificRoleRepeatOrder = function(role){

    var deferred = $q.defer();

    $http.get('/api/v2/mysql/_table/orders',{params:{
      related: 'roles_by_role_id, users_by_user_id, category_by_category_id',
      filter: 'role_id='+role
    }}).then(function(resp) {
      console.log(resp.data)
          deferred.resolve(resp.data.resource);
    }, function(err) {
      console.error('ERR', JSON.stringify(err));
      deferred.reject(err);
    });

    return deferred.promise;
  }

  this.setViewed = function(id){

    var deferred = $q.defer();

    var putData = {
      resource: [
        {
          id:id,
          viewed:true
        }
      ]
    }

    $http.put('/api/v2/mysql/_table/orders',putData).then(function(resp) {
      console.log("Success: "+resp.data);
      deferred.resolve(resp.data.resource);
    }, function(err) {
      console.error('ERR', JSON.stringify(err));
      deferred.reject(err);
    });

    return deferred.promise;

  }

  this.getViewed = function(id){



  }

}])

.service('S3Service', ['$q', '$http', function($q, $http){

  this.uploadPicture = function(folder,imageName,image){

    var contentType = 'image/jpeg';
    var b64Data = image;

    var blob = base64toBlob(b64Data, contentType);
    //var blobUrl = URL.createObjectURL(blob);
    //
    //var img = document.createElement('img');
    //img.src = blobUrl;
    //document.body.appendChild(img);

    function base64toBlob(base64Data, contentType) {
      contentType = contentType || '';
      var sliceSize = 1024;
      var byteCharacters = atob(base64Data);
      var bytesLength = byteCharacters.length;
      var slicesCount = Math.ceil(bytesLength / sliceSize);
      var byteArrays = new Array(slicesCount);

      for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
      }
      return new Blob(byteArrays, { type: contentType });
    }

    var deferred = $q.defer();

    var postData = blob;

    $http.post('/api/v2/s3/'+folder+'/'+imageName,postData).then(function(resp) {
      console.log("Success: "+resp.data);
      deferred.resolve(resp);
    }, function(err) {
      console.error('ERR', err);
      deferred.reject(err);
    });

    return deferred.promise;

  }

}])

.service('BuyerOrderService', ['$q', '$http', function($q, $http){

  this.createOrder = function(createdBy, product){

    console.log(product);

    var deferred = $q.defer();

      var postData = {product_name: product.name,
        image:product.image,
        color_quantity: JSON.stringify(product.colorAndQuantity),
        category_id: product.category.id,
        role_id: product.role,
        user_id: createdBy
        }

    console.log(postData);

      $http.post('/api/v2/mysql/_table/orders',postData).then(function(resp) {
        console.log("Success: "+resp.data);
        deferred.resolve(resp.data);
      }, function(err) {
        console.error('ERR', JSON.stringify(err));
        deferred.reject(err);
      });

      return deferred.promise;
  }

}])

;


