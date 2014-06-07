var myApp = angular.module('myApp', ['ngRoute', 'ui.bootstrap']);

myApp.factory('EventService', function() {
  var events =  [{
    "id" : 123,
    "name" : "Sesame Street Live - Elmo Makes Music",
    "date" : "2014-01-15T10:30:00",
    "venue" : {
      "id" : 111,
      "name" : "Broome County Forum",
      "city" : "Binghamton",
      "state" : "NY"
    }
  }, {
    "id" : 124,
    "name" : "2014 Australian Open",
    "date" : "2014-01-15T11:00:00",
    "venue" : {
      "name" : "Rod Laver Arena",
      "city" : "Melbourne"
    }
  }, {
    "id" : 125,
    "name" : "Mac King Comedy Magic Show",
    "date" : "2014-01-15T13:00:00",
    "venue" : {
      "id" : 300,
      "name" : "Harrah's Las Vegas Casino",
      "city" : "Las Vegas",
      "state" : "NV"
    }
  }, {
    "id" : 126,
    "name" : "42nd Street",
    "date" : "2014-01-15T13:30:00",
    "venue" : {
      "id" : 1200,
      "name" : "Paramount Theatre - IL",
      "city" : "Aurora",
      "state" : "IL"
    }
  }, {
    "id" : 127,
    "name" : "Million Dollar Quartet",
    "date" : "2014-01-15T14:00:00",
    "venue" : {
      "id" : 712,
      "name" : "Apollo Theater-IL",
      
      "city" : "Chicago",
      "state" : "IL"
      
    }
  }, {
    "id" : 128,
    "name" : "Twelfth Night",
    "date" : "2014-01-15T14:00:00",
    "venue" : {
      "id" : 1665,
      "name" : "Belasco Theatre",
      "city" : "New York",
      "state" : "NY"
    }
  }, {
    "id" : 129,
    "name" : "The Glass Menagerie",
    "date" : "2014-01-15T14:00:00",
    "venue" : {
      "id" : 2411,
      "name" : "Booth Theatre",
      "city" : "New York",
      "state" : "NY"
    }
  }, {
    "id" : 130,
    "name" : "Cinderella - The Musical",
    "date" : "2014-01-16T14:00:00",
    "venue" : {
      "id" : 2332,
      "name" : "Broadway Theatre-New York",
      "city" : "New York",
      "state" : "NY"
      
    }
    
  }, {
    "id" : 131,
    "name" : "After Midnight",
    "date" : "2014-01-16T14:00:00",
    "venue" : {
      "id" : 2372,
      "name" : "Brooks Atkinson Theatre",
      "city" : "New York",
      "state" : "NY"
    }
  }, {
    "id" : 132,
    "name" : "Die Fledermaus",
    "date" : "2014-07-16T14:00:00",
    "venue" : {
      "id" : 3244,
      "name" : "Civic Opera House",
      "city" : "Chicago",
      "state" : "IL"
    }
  } ];
  
  return {
    all: function() { 
      return events;
    },
    
    update: function(event) {
      events.forEach(function(item){
        if(item.id === event.id)
        {
          Object.getOwnPropertyNames(event).forEach(function(name){
            var desc = Object.getOwnPropertyDescriptor(event,name);
            Object.defineProperty(item, name, desc);
          });
        }
      });
    },
    
    add: function(event) {
      events.push(event);
    },
    
    remove: function(event) {
      events = events.filter(function(item){return item.id !== event.id});
    },
    
    getUpcoming: function() {
      var upcomingEvents = [];
      var now = new Date();
      var nowISO = now.toISOString();
      var nowDate = nowISO.replace(/\D/g,'');
      $.each(events, function(i, v) {
         var eventDate = v.date.replace(/\D/g,'');
         if(eventDate > nowDate)
            upcomingEvents.push(v);
      });
      return upcomingEvents;
    }
  
  }
});

myApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
          controller: 'SimpleController',
          templateUrl: 'templates/all.html'
        })
        .when('/step2', {
          controller: 'SimpleController',
          templateUrl: 'templates/upcoming.html'
        })
        .when('/step3', {
          controller: 'SimpleController',
          templateUrl: 'templates/local.html'
        })
        .otherwise({ redirectTo: '/' });
});




myApp.controller('SimpleController', function ($scope, $location, EventService) {

  $scope.editorEnabled = false;

  $scope.events = [];
  $scope.upcomingEvents = [];
  var indexedEvents = [];


  init();

  function init() {
    $scope.events = EventService.all();
    $scope.upcomingEvents = EventService.getUpcoming();
  }

  $scope.addEvent = function () {
    var index = $scope.events.length;
    var index = index - 1;
    var newID = $scope.events[index].id;
    newID++;
    var newEventDate = $scope.dt.toDateString().substring(4,10) + " " + $scope.mytime.toLocaleTimeString();
    var newEvent = { 
      id: newID,
      name: $scope.inputData.name, 
      date: newEventDate, 
      venue: {
        name: $scope.inputData.venue.name, 
        city: $scope.inputData.venue.city, 
        state: $scope.inputData.venue.state
      } 
    };
    //console.log($scope);
    EventService.add(newEvent);
    $('#myModal').modal('hide');
  }

  $scope.removeEvent = function(index){
    $scope.events.splice(index, 1);
  }

  $scope.enableEditor = function(field) {
    //console.log(field);
    $scope.editorEnabled = true;

  };

  $scope.eventsToFilter = function() {
    indexedEvents = [];
    return $scope.events;
  }

  $scope.filterEvents = function(event) {
    var cityIsNew = indexedEvents.indexOf(event.venue.city) == -1;
    if (cityIsNew) {
        indexedEvents.push(event.venue.city);
    }
    return cityIsNew;
  }

  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };


  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.initDate = new Date('2016-15-20');
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

    $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 15;

  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    console.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };

}); 


