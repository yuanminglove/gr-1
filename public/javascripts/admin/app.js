var app = angular.module('app', [
  'ui.router', 'ngAnimate']);
app.config(function($stateProvider,$urlRouterProvider){
  // $urlRouterProvider.otherwise('/wellcome')
  $stateProvider
    .state('typeLists',{
      url: '/typeLists',
      templateUrl: '/admin/tpls/typeLists.html',
      resolve: {
        list : function($http){
          return $http({
            'method' : 'get',
            'url' : '/a/typeRootLists'
          });          
        }
      },
      controller: function($scope, $state,list){
        if(list.status == 200){
          // console.log(list)
          creatTree(list.data.items);
        }else{
          console.log('获取失败！')
        }
        
      }
    }).state('typeAddPage',{
      url: '/typeAddPage/:ParentTypeId',
      templateUrl: '/admin/tpls/typeAddPage.html',
      resolve: {
        type : function($http,$stateParams){
          if($stateParams.ParentTypeId == 0){
            return null;
          }else{            
            return $http({
              'method' : 'get',
              'url' : '/a/type/'+$stateParams.ParentTypeId
            })
          }
        }
      },
      controller: function($scope, $state, type){
        if(type){
          // console.log(type)
          $scope.type = type.data.item;
        }

      }
    }).state('typeEdit',{
      url: '/typeEdit/:id',
      templateUrl: '/admin/tpls/typeEditPage.html',
      resolve: {
        type : function($http,$stateParams){
          if($stateParams.ParentTypeId == 0){
            return null;
          }else{            
            return $http({
              'method' : 'get',
              'url' : '/a/type/'+$stateParams.id
            })
          }
        }
      },
      controller: function($scope, $state, type){
        if(type){
          // console.log(type.data)
          var t = type.data.item;
          if(t.isLast){
            for(var i in t.keys){
              keys[t.keys[i].keyName] = true;
              // console.log("i : "+t.keys[i].keyName)
            }
            keys[0] = t.keys.length;
          }else{
            $('#addKeyVlue').hide();
          }
          $scope.type = t;
          $scope.remove = function($event){
            var ID = $event.target.getAttribute("data-id");
            remove(ID)
          }
        }

      }
    }).state('wellcome',{
      url: '/wellcome',
      templateUrl: '/admin/tpls/wellcome.html'
    })
})