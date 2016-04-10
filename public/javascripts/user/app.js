var app = angular.module('app', [
  'ui.router', 'ngAnimate']);
app.config(function($stateProvider,$urlRouterProvider){
  // $urlRouterProvider.otherwise('/wellcome')
  $stateProvider
    .state('commoditAddPage',{
      url: '/commoditAddPage',
      templateUrl: '/user/tpls/commoditAddPage.html',
      resolve: {
        typeRootLists : function($http){
          return $http({
            'method' : 'get',
            'url' : '/c/typeRootLists'
          });          
        }
      },
      controller: function($scope, $state, typeRootLists){
        $scope.controllerName = "发布新商品";
        createTypeRootLists(typeRootLists.data.items);
      }
    })
    .state('commoditsList',{
      url: '/commoditsList',
      templateUrl: '/user/tpls/commoditsList.html',
      resolve: {
        commodits : function($http,$stateParams){
          return $http({
            'method' : 'get',
            'url' : '/u/commoditsInfoByPage'
          });          
        }
      },
      controller: function($scope, commodits){
        $scope.controllerName = "商品信息列表";
        $scope.commodits = commodits.data.items;
        // console.log(commodits)
        $scope.remove = function($event){
          var ID = $event.currentTarget.getAttribute("data-id");
          remove(ID)
        };
        $scope.publish = function($event){
          var ID = $event.currentTarget.getAttribute("data-id");
          publish(ID)
        };
        $scope.unPublish = function($event){
          console.log($event)
          var ID = $event.currentTarget.getAttribute("data-id");
          unPublish(ID)
        };
      }
    })
    .state('commoditEditPage',{
      url: '/commoditEditPage/:commoditId',
      templateUrl: '/user/tpls/commoditEditPage.html',
      resolve: {
        commodit : function($http,$stateParams){
          return $http({
            'method' : 'get',
            'url' : '/u/commodit/'+$stateParams.commoditId
          });          
        }
      },
      controller: function($scope, $state, commodit){
        $scope.controllerName = "修改商品信息";
        $scope.commodit = commodit.data.item;
        creatThumbnail($scope.commodit.thumbnail);
        creatDescribe($scope.commodit.describe);
        findTypeName($scope.commodit.typeId);
        // console.log($scope.commodit)
      }
    })
    .state('commodit',{
      url: '/commodit/:id',
      templateUrl: '/user/tpls/commodit.html',
      resolve: {
        commodit : function($http,$stateParams){
          return $http({
            'method' : 'get',
            'url' : '/c/commodit/'+$stateParams.id
          });          
        }
      },
      controller: function($scope, $state, $sce, commodit){
        $scope.controllerName = "商品预览";
        $scope.commodit = commodit.data.item;
        $scope.commodit.describe = $sce.trustAsHtml($scope.commodit.describe)
        $scope.publish = function($event){
          console.log($event)
          var ID = $event.currentTarget.getAttribute("data-id");
          publish(ID)
        };
      }
    })
    .state('commoditView',{
      url: '/commoditView/:id',
      templateUrl: '/user/tpls/commoditView.html',
      resolve: {
        commodit : function($http,$stateParams){
          return $http({
            'method' : 'get',
            'url' : '/c/commodit/'+$stateParams.id
          });          
        }
      },
      controller: function($scope, $state, $sce, $http, commodit){
        $scope.controllerName = "商品预览";
        $scope.commodit = commodit.data.item;
        $scope.commodit.describe = $sce.trustAsHtml($scope.commodit.describe)
        $scope.createSingleOrder = function($event){
          console.log($event)
          var ID = $event.currentTarget.getAttribute("data-id");
          console.log("ID : "+ID)
          $http({
            'method' : 'get',
            'url' : '/u/createSingleOrder?id='+ID
          }).success(function(data){
            //获取订单ID
            window.location.hash = '#/order/'+data.orderId;
          });    
        };
      }
    })
    .state('collectionsList',{
      url: '/collectionsList',
      templateUrl: '/user/tpls/collectionsList.html',
      resolve: {
        collections : function($http){
          return $http({
            'method' : 'get',
            'url' : '/u/collectionsList'
          });       
        }
      },
      controller: function($scope, $state, $http, collections){
        $scope.controllerName = "我的收藏";
        $scope.collections = collections.data.items;
        $scope.remove = function($event){
          var ID = $event.currentTarget.getAttribute("data-id");
          remove(ID)
        };
        $scope.createSingleOrder = function($event){
          var ID = $event.currentTarget.getAttribute("data-id");
          $http({
            'method' : 'get',
            'url' : '/u/createSingleOrder?id='+ID
          }).success(function(data){
            //获取订单ID
            if(data.orderId){
              window.location.hash = '#/order/'+data.orderId;
            }else{
              alert(data.message)
            }
          });     
        };
        $scope.createManyOrder = function($event){
          var ids = [];
          $('table').find('tr > td:first-child input:checkbox')
            .each(function(){
              if(this.checked){
                ids.push($(this).prop('value'));
              }
          });
          $http.post('/u/createManyOrder',{
            "ids" : JSON.stringify(ids)
          }).success(function(data){
              //获取订单ID
            if(data.orderId){
              window.location.hash = '#/order/'+data.orderId;
            }else{
              alert(data.message)
            }
          });     
        };
      }
    })
    .state('order',{
      url: '/order/:id',
      templateUrl: '/user/tpls/order.html',
      resolve: {
        order : function($http,$stateParams){
          return $http({
            'method' : 'get',
            'url' : '/u/order/'+$stateParams.id
          });          
        }
      },
      controller: function($scope, $http, $state, order){
        $scope.controllerName = "订单详情";
        $scope.order = order.data.item;
        // console.log($scope.order)
        $scope.changeOrderTotle = function(id){
          var total = 0;
          var index;
          var commoditsList = $scope.order.commoditsList;
          if(id){
            //如果id存在，代表是直接通过input框输入，所以要验证数值的有效性和合法性
            for(var i in commoditsList){
              index = i;
              if(commoditsList[i].id == id){
                break;
              }              
            }
            $http({
              'method' : 'get',
              'url' : '/u/orderChangeAmount/?amount='+(Math.abs(commoditsList[index].amount) || 0)+'&orderId='+$scope.order._id+'&commoditId='+id
            }).success(function(data){
              $scope.order.commoditsList[index].amount = data.amount;  
              console.log(data)              
              $scope.changeOrderTotle();
            });
          }else{            
            for(var i in commoditsList){
              total = total + commoditsList[i].price*commoditsList[i].amount;
            }
            $scope.order.total = total;
          }          
        };
        $scope.minusAmount = function(id){
          console.log('minusAmount : ') 
          var commoditsList = $scope.order.commoditsList;
          for(var i in commoditsList){
            if(commoditsList[i].id == id && commoditsList[i].amount>0){
              $http({
                'method' : 'get',
                'url' : '/u/orderMinusAmount/?orderId='+$scope.order._id+'&commoditId='+id
              }).success(function(data){
                $scope.order.commoditsList[i].amount--;  
                console.log(data)              
                $scope.changeOrderTotle();
              });
              break;
            }
          }
        };
        $scope.plusAmount = function(id){
          var commoditsList = $scope.order.commoditsList;
          for(var i in commoditsList){
            if(commoditsList[i].id == id){
              //发送请求做商品存货量判断
              $http({
                'method' : 'get',
                'url' : '/u/orderPlusAmount/?orderId='+$scope.order._id+'&commoditId='+id
              }).success(function(data){
                console.log(data)
                if($scope.order.commoditsList[i].amount < data.commoditSum){
                  $scope.order.commoditsList[i].amount++;               
                  $scope.changeOrderTotle();
                }
              });
              break;
            }
          } 
        };
      }
    })
    .state('orderList',{
      url: '/orderList',
      templateUrl: '/user/tpls/orderList.html',
      resolve: {
        orderList : function($http){
          return $http({
            'method' : 'get',
            'url' : '/u/orderList'
          });          
        }
      },
      controller: function($scope, $http, $state, orderList){
        $scope.controllerName = "未完成的订单";
        $scope.orderList = orderList.data.items;
        console.log($scope.orderList)
        $scope.delOrder = function(id){
          $http({
            'method' : 'get',
            'url' : '/u/delOrderById/'+id
          }).success(function(data){
            var ods = $scope.orderList;
            for(var i in ods){
              if(ods[i]._id == id){
                $("#"+id).hide(500,function(){$(this).remove(500)});
              }
            }
          });
        };
      }
    })
    .state('payOne',{
      //（router）payTwo中生成付款订单,添加加密验证字段(订单信息锁定)，payTwo之后是重定向，没有页面
      //payOne中展示订单，确认信息，不提供数据修改事件
      url: '/payOne/:id',
      templateUrl: '/user/tpls/payOne.html',
      resolve: {
        order : function($http, $stateParams){
          return $http({
            'method' : 'get',
            'url' : '/u/order/'+$stateParams.id
          });          
        }
      },
      controller: function($scope, $http, $state, order){
        $scope.controllerName = "订单支付";
        $scope.order = order.data.item;
        console.log($scope.order)
        $scope.payTwo = function(id){
          $http({
            'method' : 'get',
            'url' : '/u/payTwo/'+id
          }).success(function(data){
            //根具返回的数据做重定向到第三方付款页面
            console.log(data)
            console.log('根具返回的数据做重定向到第三方付款页面')
            alert("付款成功！")

            //模拟重定向后返回后台的请求,生成买家订单，减少商品库存（*商品库存在什么时候减少）
            // $http({
            //   'method' : 'get',

            // })

          })
        };
      }
    })
    .state('payList',{
      url: '/payList/:id',
      templateUrl: '/user/tpls/payList.html',
      // resolve: {
      //   collections : function($http){
      //     return $http({
      //       'method' : 'get',
      //       'url' : '/u/collectionsList'
      //     });          
      //   }
      // },
      controller: function($scope, $state){
        $scope.controllerName = "订单详情";
        // $scope.collections = collections.data.items;
        // $scope.remove = function($event){
        //   var ID = $event.currentTarget.getAttribute("data-id");
        //   remove(ID)
        // };
      }
    })
    .state('selfInfo',{
      url: '/selfInfo',
      templateUrl: '/user/tpls/selfInfo.html',
      resolve: {
        user : function($http){
          return $http({
            'method' : 'get',
            'url' : '/u/selfInfo'
          });          
        },
        address : function($http){
          return $http({
            'method' : 'get',
            'url' : '/u/address'
          });          
        }
      },
      controller: function($scope, $state, $http, user, address){
        $scope.controllerName = "个人资料";
        $scope.user = user.data.user;
        $scope.address = address.data.address;
        $scope.removeAddAddress = function($event){
          var ID = $event.currentTarget.getAttribute("data-id");
          //先做数据删除操作，再移除页面元素
          $http({
            'method' : 'get',
            'url' : '/u/delAddress/'+ID
          }).success(function(){            
            removeAddAddress(ID)
          });    
        };
        $scope.addAddress = function(){
          if($scope.newAddress){            
            $http.post('/u/addAddress',{
              "address" : JSON.stringify($scope.newAddress)
            }).success(function(data){
              $scope.address.push(data.address)
              hideAddAddress()
            });   
          }
        };
        $scope.setDefaultAddress = function($event){
          var ID = $event.currentTarget.getAttribute("data-id");
          $http({
            'method' : 'get',
            'url' : '/u/setDefaultAddress/'+ID
          }).success(function(){ 
            var a = $scope.address;           
            for(var i in a){
              if(a[i]._id == ID){
                a[i].isDefault = true;
              }else{
                a[i].isDefault = false;
              }
            }
          });    
        };
      }
    }).state('wellcome',{
      url: '/wellcome',
      templateUrl: '/user/tpls/wellcome.html'
    })
})