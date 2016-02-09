angular.module('app.controllers')

.controller('buyerHomeCtrl', function($q, $scope, $rootScope, $state, LoginService, RoleService, ProductService, $ionicModal, $sessionStorage) {

        $scope.buyer = {};
        $scope.products = [];

        $scope.getBuyerName = function(){
            $scope.showLoading();
            $scope.buyer.name = $sessionStorage.currentUser.firstname;
            $scope.hideLoading();

        };

        $scope.getBuyerRole = function(){
            $scope.showLoading();
            $scope.hideLoading();
            $scope.buyer.role = $sessionStorage.currentUser.role;
        }

        $scope.getBuyerProducts = function(){
            $scope.showLoading();

            ProductService.getSpecificRoleProduct($scope.buyer.role.id).then(function(result){
                for(var i=0;i<result.length;i++)
                {
                    $scope.products.push({image:result[i].image,name:result[i].name, category: result[i].category_by_category_id,colors: JSON.parse(result[i].colors_pictures)});
                }
                $rootScope.presentBuyerProducts = $scope.products;
                //$rootScope.presentBuyerProducts.colors = JSON.parse("[" + $rootScope.presentBuyerProducts.colors + "]");;
                console.dir($scope.buyer);
                console.dir($rootScope.presentBuyerProducts);
                $scope.hideLoading();
            }, function(err){
                console.log(err.message);
                $scope.hideLoading();
            });

        }

        $scope.productOrderPage = function(product){
            $rootScope.selectedProduct = product;
            $state.go("buyer.tab.createOrder");
        }

        $ionicModal.fromTemplateUrl('image-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function() {
            $scope.modal.show();
        };

        $scope.closeModal = function() {
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

        $scope.showImage = function(color){
            if(color.hasOwnProperty('image')){
                console.dir("Selected Color: "+JSON.stringify(color));
                try{
                    $scope.imageSrc = color.image.url();
                }
                catch(err){
                    $scope.imageSrc = color.image;
                }

                $scope.openModal();
            }
        }

    })

.controller('buyerCreateOrderCtrl', function($scope, $rootScope, RoleService, $ionicModal, $sessionStorage, BuyerOrderService) {
        $scope.showRepeatForm = false;
        $scope.showCustomForm = false;

        $scope.productSelected = [];
        $scope.productSelected.colorsAndQuantity = [];

        $scope.initProduct = function(){
            $scope.productSelected = $rootScope.selectedProduct;
            $scope.products = $rootScope.presentBuyerProducts;
            for(var i=0;i<$scope.products.length;i++){
                $scope.products[i].colorsAndQuantity = [];
                for(var j=0;j<$rootScope.presentBuyerProducts[i].colors.length;j++){
                    if($rootScope.presentBuyerProducts[i].colors[j].hasOwnProperty('image')){
                        $scope.products[i].colorsAndQuantity.push({name: $rootScope.presentBuyerProducts[i].colors[j].name,image:$rootScope.presentBuyerProducts[i].colors[j].image});
                    }
                    else {
                        $scope.products[i].colorsAndQuantity.push({name: $rootScope.presentBuyerProducts[i].colors[j].name});
                    }
                }
            }
        }

        $scope.selectedProductName = {};

        $scope.productNameSelected = function(){
            $scope.productSelected = $.grep($scope.products, function(e){ return e.name == $scope.selectedProductName.name; })[0];
            console.dir("Product: "+scope.productSelected);
        }

        $scope.createOrderRepeat = function(productSelected){

            $scope.showLoading();

            $scope.productSelected = productSelected;

            console.log("root: "+$rootScope.selectedProduct);

            $scope.createdBy = $sessionStorage.currentUser.id;

            $scope.productSelected.colorAndQuantity = [];

            console.dir("Selected Product: "+JSON.stringify($scope.productSelected));

            for(var i=0;i<$scope.productSelected.colorsAndQuantity.length;i++){
                if($scope.productSelected.colorsAndQuantity[i].checked == true){
                    console.dir("YES: "+JSON.stringify($scope.productSelected.colorsAndQuantity[i]));
                    $scope.productSelected.colorAndQuantity.push({name:$scope.productSelected.colorsAndQuantity[i].name,qty:$scope.productSelected.colorsAndQuantity[i].qty});
                    console.dir("YES: "+JSON.stringify($scope.productSelected.colorAndQuantity));
                }
            }

            $scope.productSelected.role = $sessionStorage.currentUser.role.id;

            BuyerOrderService.createOrder($scope.createdBy, $scope.productSelected).then(function(resp){
                console.log("Order Successfully Placed");
                $scope.hideLoading();
            }, function(err){
                console.log("Error: "+err);
                $scope.hideLoading();
            });

        }

        $ionicModal.fromTemplateUrl('image-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function() {
            $scope.modal.show();
        };

        $scope.closeModal = function() {
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

        $scope.showImage = function(color){
            if(color.hasOwnProperty('image')){
                console.dir("Selected Color: "+JSON.stringify(color));
                $scope.imageSrc = color.image;
                $scope.openModal();
            }
        }

    })

;