/**
 * Created by Leonardo on 16/06/2015.
 */
angular.module("githubSpa",[]);
angular.module("githubSpa").controller("headerCtrl", function($scope, $http){

    $scope.getRepos = function(){
        delete $scope.favoriteRepos;
        delete $scope.selectedRepo;
        var username = $('.username').val();
        
        $http.get( "https://api.github.com/users/" + username).success(function(data){
            $scope.user = data;
        });

        $http.get( "https://api.github.com/users/" + username + "/repos").success(function(data) {
            $scope.allRepos = data;
            $scope.repos = $scope.allRepos;
        })
    },

    $scope.updateRepos = function(){
        var searchTerm = $('.search')[0].value;
        if($scope.repos){
            $scope.repos = $scope.allRepos.filter(function(value){
                return value.name.indexOf(searchTerm) > -1;
            });
        } else {
            $scope.showFavoriteRepos();
            $scope.favoriteRepos = $scope.allFavoriteRepos.filter(function(value){
                return value.name.indexOf(searchTerm) > -1;
            });
        }
    },

    $scope.deleteSession = function(){
        delete $scope.user;
        delete $scope.repos;
        delete $scope.selectedRepo;
        delete $scope.allRepos;
    },

    $scope.getContribuitors = function(repo){
        $http.get( repo.contributors_url ).success(function(data){
            $scope.contribuitors = data;
        });
    },

    $scope.insertRepoLocalStorage = function(repo){

        favoriteRepos = localStorage["favoriteRepos"] ? JSON.parse(localStorage["favoriteRepos"]) : [];
        $scope.message = "";

        if($scope.verifyFavoriteRepo(repo)){
            favoriteRepos.push(repo);
            localStorage["favoriteRepos"] = JSON.stringify(favoriteRepos);
        }else {
            $scope.message = "This repo was favorited before";
        }

    },

    $scope.verifyFavoriteRepo = function(repo){

        var favoriteRepos = localStorage["favoriteRepos"] ? JSON.parse(localStorage["favoriteRepos"]) : [];
        
        for(position in favoriteRepos){
            if(favoriteRepos[position].name == repo.name){
                return false;
            }
        }
        return true;
    },

    $scope.showFavoriteRepos = function(){
        $scope.favoriteRepos = localStorage["favoriteRepos"] ? JSON.parse(localStorage["favoriteRepos"]) : [];
        $scope.allFavoriteRepos = $scope.favoriteRepos;
        delete $scope.repos;
        delete $scope.selectedRepo;
    },


    $scope.getRepoDetails = function(repo, reposGroup){
        $scope.reposToTemplate = reposGroup;
        $scope.selectedRepo = repo;
        delete $scope.contribuitors;
        $scope.getContribuitors(repo);
    }
});

