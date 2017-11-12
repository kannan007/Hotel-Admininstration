var app=angular.module('MyApp');
app.controller('LoginandLogoutController', ['$scope','$http','$location',function($scope,$http,$location)
{
	$scope.EmailID="";
	$scope.Password="";
	$scope.SignupEmailID="";
	$scope.SignupPassword="";
	$scope.Login=function() {
		$http({
	        url: "/users/login",
	        method: "POST",
	        data: {mailid: $scope.EmailID, password:$scope.Password}
	    })
	    .then(function(response) {
	    	console.log(response);
	    	console.log(response.data);
	    	$scope.EmailID="";
			$scope.Password="";
			if(response.data=="verify") {
				alert("Make sure you have verified your mail");
			}
			else {
				let answer=JSON.parse(JSON.stringify(response.data));
			    localStorage.setItem("username", $scope.EmailID);
			    localStorage.setItem("id", answer.userdetails._id);
			    $location.path("posts");
			}
			$scope.LoginForm.$setPristine();
	    },
	    function(response) {
	    	let errormessage=response.data.substr(response.data.indexOf("<h1>")+4,31);
	    	console.log(errormessage);
	    	alert("Error while Login" + errormessage);
	    	console.log(response.statusText);
	    	console.log(response.status);
	    });
	};
	$scope.Signup=function() {
		$http({
	        url: "/users/register",
	        method: "POST",
	        data: {mailid: $scope.SignupEmailID, password: $scope.SignupPassword}
	    })
	    .then(function(response) {
	    	$scope.SignupEmailID="";
			$scope.SignupPassword="";
			$scope.SignupForm.$setPristine();
			alert("An email is sent check your mail");
			console.log(response.data);
			//$location.path("posts");
	    },
	    function(response) {
	    	console.log(response.data);
	    	//let answer=JSON.stringify(response);
	    	//console.log(answer);
	    	alert("Error while Registering check console log for more details" + response.status);
	    	console.log(response.statusText);
	    	console.log(response.status);
	    });
	};
}])
app.controller('PostsController', ['$scope','$http','$location',function($scope,$http,$location)
{
	function myMap() {
		var myCenter = new google.maps.LatLng($scope.Posts[0].restaurantdetails.latlng.lat,$scope.Posts[0].restaurantdetails.latlng.lng);
		var mapCanvas = document.getElementById("map");
		var mapOptions = {center: myCenter, zoom: 10};
		var map = new google.maps.Map(mapCanvas, mapOptions);
		var marker = new google.maps.Marker({position:myCenter});
		marker.setMap(map);
	}
	let postsprototype = function(data) {
		this.id = data._id;
		this.dishes =data.dishdetails;
		this.restaurantdetails = data.restaurantdetails;
		this.emailid = data.emailid;
	};
	$scope.Posts=[];
	$scope.SearchContent="";
	$scope.SearchTitle="";
	//google.maps.event.addDomListener(window, "load", myMap);
	$scope.GetPosts=function() {
		let userid=localStorage.getItem("id");
		$http({
	        url: "http://localhost:3000/users/"+userid,
	        method: "GET"
	    })
	    .then(function(response) {
	    	$scope.Posts=[];
	    	console.log($scope.Posts);
	    	let temp=response.data;
	    	$scope.Posts.push(new postsprototype(temp));
	    	//myMap();
	    	setTimeout(myMap, 5000);
	    },
	    function(response) {
	    	alert("Error while Getting the posts make sure you are loggedin" + response.status);
	    	console.log(response.statusText);
	    	console.log(response.status);
	    });
	};
	$scope.GetPosts();
	$scope.saveid=function(event) {
		localStorage.setItem("dishid", event.target.id);
	};
	$scope.EditDish=function() {
		$scope.EditDishName;
		$scope.EditDishPrice;
		let userid=localStorage.getItem("id");
		let dishid=localStorage.getItem("dishid");
		$http({
	        url: "http://localhost:3000/users/"+userid+"/dishes/"+dishid,
	        method: "PUT",
	        data: {name: $scope.EditDishName, price: $scope.EditDishPrice}
	    })
	    .then(function(response) {
			for(let i=0;i<$scope.Posts[0].dishes.length;i++) {
				if($scope.Posts[0].dishes[i]._id==dishid) {
					$scope.Posts[0].dishes[i].name=$scope.EditDishName;
					$scope.Posts[0].dishes[i].price=$scope.EditDishPrice;
				}
			}
			$scope.EditDishName="";
			$scope.EditDishPrice="";
			$scope.EditDishForm.$setPristine();
			console.log(response.data);
			$location.path("posts");
	    },
	    function(response) {
	    	console.log(response.data);
	    	alert("Error while Editing" + response.status);
	    	console.log(response.statusText);
	    	console.log(response.status);
	    });
	}
	$scope.Logout=function() {
		$http({
	        url: "/users/logout",
	        method: "GET"
	    })
	    .then(function(response) {
	    	localStorage.removeItem("username");
	    	localStorage.removeItem("id");
	    	localStorage.removeItem("dishid");
	    	$location.path("/");
	    },
	    function(response) {
	    	alert("Error while Logout" + response.status);
	    	console.log(response.statusText);
	    	console.log(response.status);
	    });
	};
}])
app.controller('EditPostsController', ['$scope','$http','$location',function($scope,$http,$location)
{
	$scope.RestaurantName="";
	$scope.Restaurantaddress="";
	$scope.RestaurantLatitude="";
	$scope.RestaurantLongtitude="";
	$scope.EditPosts=function() {
		let userid=localStorage.getItem("id");
		let temp={"restaurantdetails":{name: $scope.RestaurantName, address: $scope.Restaurantaddress, latlng:{lat:$scope.RestaurantLatitude,lng:$scope.RestaurantLongtitude}} }
		$http({
	        url: "http://localhost:3000/users/"+userid,
	        method: "PUT",
	        data: temp
	    })
	    .then(function(response) {
	    	$scope.RestaurantName="";
			$scope.Restaurantaddress="";
			$scope.RestaurantLatitude="";
			$scope.RestaurantLongtitude="";
			$scope.UploadPostsForm.$setPristine();
			console.log(response.data);
			$location.path("posts");
	    },
	    function(response) {
	    	console.log(response.data);
	    	alert("Error while Editing" + response.status);
	    	console.log(response.statusText);
	    	console.log(response.status);
	    });
	};
}]);
app.controller('AddDishController', ['$scope','$http','$location',function($scope,$http,$location)
{
	$scope.DishName="";
	$scope.AddDish=function() {
		let userid=localStorage.getItem("id");
		$http({
	        url: "http://localhost:3000/users/"+userid+"/dishes",
	        method: "POST",
	        data: {name: $scope.DishName, price: $scope.DishPrice}
	    })
	    .then(function(response) {
	    	$scope.DishName="";
			$scope.DishPrice="";
			$scope.UploadDishForm.$setPristine();
			console.log(response.data);
			$location.path("posts");
	    },
	    function(response) {
	    	console.log(response.data);
	    	alert("Error while Editing" + response.status);
	    	console.log(response.statusText);
	    	console.log(response.status);
	    });
	};
}]);