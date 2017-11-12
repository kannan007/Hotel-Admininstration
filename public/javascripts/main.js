var app=angular.module('MyApp', ['ui.router']);
app.config(function($stateProvider,$urlRouterProvider)
{
  $stateProvider
    .state('home',
    {
      url:'/',
      views:
      {
        'content':
        {
          templateUrl:"loginlogout.html",
          controller:"LoginandLogoutController"
        }
      }
    })
    .state('Posts', {
      url: "/posts",
      views:
      {
        'header' : {
          templateUrl:"header.html",
          controller:"PostsController"
        },
        'content':
        {
          templateUrl:"posts.html",
          controller:"PostsController"
        }
      }
    })
    .state('Uploadposts', {
      url: "/uploadposts",
      views:
      {
        'header' : {
          templateUrl:"header.html",
          controller:"PostsController"
        },
        'content':
        {
          templateUrl:"restaurantedits.html",
          controller:"EditPostsController"
        }
      }
    })
    .state('Uploaddishes', {
      url: "/adddish",
      views:
      {
        'header' : {
          templateUrl:"header.html",
          controller:"PostsController"
        },
        'content':
        {
          templateUrl:"adddish.html",
          controller:"AddDishController"
        }
      }
    });
  $urlRouterProvider.otherwise('/');
})