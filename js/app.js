/**
 * @author fda
 */
var kayakodashboard = angular.module("kayakodashboard", ["ngRoute", "ngAnimate"]);


/* Configuration*/
kayakodashboard.config(function($routeProvider/*, $httpProvider*/) {
	$routeProvider
		.when("/main", {
			templateUrl: "views/mainpage.html",
			controller: "KayakoMainPageController"
		})
		.when("/reports", {
			templateUrl: "views/reports.html",
			controller: "KayakoReportsPageController"
		})
		.otherwise({
			redirectTo: "/main"
		});
});


/* Controllers */
kayakodashboard.controller("NavigationController", function($scope, $location) {
	
	$scope.nav = {};
	$scope.nav.isActive = function(path) {
		if ($location.path().indexOf(path) > -1) {
			return true;
		}
		
		return false;
	};
});
