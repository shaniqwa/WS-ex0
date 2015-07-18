

var homiApp = angular.module("homiApp",[]);

var model = {

};


homiApp.controller("Ctrl", function ($scope, $http){
	$scope.homiApp = model;


	//get current country by location
	$http.get("http://ip-api.com/json").success(function (data){
		model.currentCountry = data.country;
		model.rate = data.rate;
		model.city = data.regionName;
		model.lat = data.lat;
		model.lon = data.lon;

		//get homicide data by country
		var url = "https://homicidemonitor.herokuapp.com/country/" + model.currentCountry;
		$http.get(url).success(function (data){
			model.items = data;
		});

		//get all homicide data 
		var url = "https://homicidemonitor.herokuapp.com/all";
		$http.get(url).success(function (data){
			model.allData = data;
		});


		//get weather data by city
		var url = "https://homicidemonitor.herokuapp.com/weather/" + model.lat + "/" + model.lon; 
		$http.get(url).success(function (data){
			model.weather = data;
			model.temp = parseInt(model.weather[0].temperature);
			window.onload.call();
		});
	});

	$scope.commaSeparateNumber = function(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
  }

	$scope.gender = function(){
		var res;
		angular.forEach($scope.homiApp.items, function (item){
			res = Math.max(item.male, item.female);
		});
		return res;
	};


	$scope.genderIcon = function(){
		var res;
		angular.forEach($scope.homiApp.items, function (item){
				if(item.male > item.female){
					res =  "male.png";
				}
				else{
					res =  "female.png";
				}
		});
		return res;
	};

	
	$scope.weapon = function(){
		var res;
		angular.forEach($scope.homiApp.items, function (item){
			res = Math.max(item.firearm, item.sharp, item.other);
		});
		return res;
	};

	$scope.weaponIcon = function(){
		var res;

		angular.forEach($scope.homiApp.items, function (item){
				if(item.firearm > item.sharp && item.firearm > item.other){
					res =  "gun.png";
				}
				else if(item.sharp > item.firearm && item.sharp > item.other){
					res =  "knife.png";
				}else{
					res = "other.png";
				}
		});
		return res;
	};


	$scope.getTime = function(){

		var time = [];

		angular.forEach($scope.homiApp.weather, function (data){
			time.push(data.time);
		});

		time.shift();

		return time;

	};

	$scope.getTmp = function(){

		var temperature = [];

		angular.forEach($scope.homiApp.weather, function (data){
			temperature.push(data.temperature);
		});

		temperature.shift();
		
		return temperature;
	};

	$scope.nextCountery = function(){
		var count = Math.floor((Math.random() * 4) + 1);

		$scope.homiApp.currentCountry = $scope.homiApp.allData[count].id;

		var url = "https://homicidemonitor.herokuapp.com/country/" +$scope.homiApp.allData[count].id;
		$http.get(url).success(function (data){
			model.items = data;
			window.onload.call();
		});

		//get weather data by city
		var url = "https://homicidemonitor.herokuapp.com/weather/"+$scope.homiApp.allData[count].lat + "/" + $scope.homiApp.allData[count].lon;
		$http.get(url).success(function (data){
			model.weather = data;
			model.temp = parseInt(model.weather[count].temperature);
			window.onload.call();
			
		});
	};


	$scope.preCountery = function(){
		var count = Math.floor((Math.random() * 4) + 1);
		$scope.homiApp.currentCountry = $scope.homiApp.allData[count].id;

		var url = "https://homicidemonitor.herokuapp.com/country/" +$scope.homiApp.allData[count].id;
		$http.get(url).success(function (data){
			model.items = data;
			window.onload.call();
		});

		//get weather data by city
		var url = "https://homicidemonitor.herokuapp.com/weather/" +$scope.homiApp.allData[count].lat + "/" + $scope.homiApp.allData[count].lon;
		$http.get(url).success(function (data){
			model.weather = data;
			model.temp = parseInt(model.weather[count].temperature);
			window.onload.call();
		});

	};


});//close controller


//***********// GRAPH //***********//
			window.onload = function() {

			$('#load').on('click', function(){
				$(this).css("display", "none");
				$('#wrapper').css("display","block");
				window.onload.call();
			});
			$('#search').focus(function(){
				$(".list").css("display", "block");
			});
			$('#search').blur(function(){
				$(".list").css("display", "none");
				 $(this).val('');
			});
			var time = [], tmp = [];

			//SET DELAY: wait until all http requests are finished!! before calling a scope-function. very important...
			setTimeout(function() {
				time = 	angular.element($('#controller')).scope().getTime(); 
				tmp = 	angular.element($('#controller')).scope().getTmp(); 
			// Get context with jQuery - using jQuery's .get() method.
			var ctx = $("#myChart").get(0).getContext("2d");

			/*** Gradient ***/
			var gradient = ctx.createLinearGradient(0, 0, 0, 400);
			    gradient.addColorStop(0.2, 'rgba(67,86,121,1)');   
			    gradient.addColorStop(0.6, 'rgba(43,161,151,1)');


			var data = {
			    labels: time,//X-Axis
			    datasets: [

			        {
			            label: "Temperature",
			            fillColor: gradient,
			            strokeColor: "rgba(151,187,205,1)",
			            pointColor: "rgba(230,0,0,1)",
			            pointStrokeColor: "rgba(0,0,0,0.2)",
			            pointHighlightFill: "rgba(230,0,0,1)",
			            pointHighlightStroke: "rgba(0,0,0,0.2)",
			            data: tmp//Y-Axis
			        }
			    ]
			};


			var myLineChart = new Chart(ctx).Line(data, {
				responsive: true,
			    maintainAspectRatio: false,
			    barShowLables: false,
			    bezierCurve : true,
			    bezierCurveTension : 0.4,
			    
			    //points
			    pointDot : true,
			    pointDotRadius : 8,
			    pointDotStrokeWidth : 10,
			    // Boolean - Whether to animate the chart
			    animation: true,

			    // Number - Number of animation steps
			    animationSteps: 60,
			    showXLabels: 0,

			    // String - Animation easing effect
			    // Possible effects are:
			    // [easeInOutQuart, linear, easeOutBounce, easeInBack, easeInOutQuad,
			    //  easeOutQuart, easeOutQuad, easeInOutBounce, easeOutSine, easeInOutCubic,
			    //  easeInExpo, easeInOutBack, easeInCirc, easeInOutElastic, easeOutBack,
			    //  easeInQuad, easeInOutExpo, easeInQuart, easeOutQuint, easeInOutCirc,
			    //  easeInSine, easeOutExpo, easeOutCirc, easeOutCubic, easeInQuint,
			    //  easeInElastic, easeInOutSine, easeInOutQuint, easeInBounce,
			    //  easeOutElastic, easeInCubic]
			    animationEasing: "easeInSine",

			    // Boolean - If we should show the scale at all
			    showScale: false,

			    // Boolean - If we want to override with a hard coded scale
			    scaleOverride: false,

			    // ** Required if scaleOverride is true **
			    // Number - The number of steps in a hard coded scale
			    scaleSteps: null,
			    // Number - The value jump in the hard coded scale
			    scaleStepWidth: null,
			    // Number - The scale starting value
			    scaleStartValue: null,

			    // String - Colour of the scale line
			    scaleLineColor: "rgba(0,0,0,0)",

			    // Number - Pixel width of the scale line
			    scaleLineWidth: 0,

			    // Boolean - Whether to show labels on the scale
			    scaleShowLabels: false,


			    // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
			    scaleIntegersOnly: true,

			    // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
			    scaleBeginAtZero: false,

			    // String - Scale label font declaration for the scale label
			    scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

			    // Number - Scale label font size in pixels
			    scaleFontSize: 12,

			    // String - Scale label font weight style
			    scaleFontStyle: "normal",

			    // String - Scale label font colour
			    scaleFontColor: "#666",

			    // Boolean - Determines whether to draw tooltips on the canvas or not
			    showTooltips: true,

			    // Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
			    customTooltips: false,

			    // Array - Array of string names to attach tooltip events
			    tooltipEvents: ["mousemove", "touchstart", "touchmove"],

			    // String - Tooltip background colour
			    tooltipFillColor: " rgba(20,37,83,1)",

			    // String - Tooltip label font declaration for the scale label
			    tooltipFontFamily: "'DIN-Light', 'Helvetica', 'Arial', sans-serif",

			    // Number - Tooltip label font size in pixels
			    tooltipFontSize: 14,

			    // String - Tooltip font weight style
			    tooltipFontStyle: "normal",

			    // String - Tooltip label font colour
			    tooltipFontColor: "#fff",

			    // String - Tooltip title font declaration for the scale label
			    tooltipTitleFontFamily: "'DIN-Light', 'Helvetica', 'Arial', sans-serif",

			    // Number - Tooltip title font size in pixels
			    tooltipTitleFontSize: 14,

			    // String - Tooltip title font colour
			    tooltipTitleFontColor: "#fff",

			    // Number - pixel width of padding around tooltip text
			    tooltipYPadding: 13,

			    // Number - pixel width of padding around tooltip text
			    tooltipXPadding: 13,

			    // Number - Size of the caret on the tooltip
			    tooltipCaretSize: 5,

			    // Number - Pixel radius of the tooltip border
			    tooltipCornerRadius: 19,

			    // Number - Pixel offset from point x to tooltip edge
			    tooltipXOffset: 20,

			    // String - Template string for single tooltips
			    tooltipTemplate: "<%= label %>",

			    // Function - Will fire on animation progression.
			    onAnimationProgress: function(){},

			    // Function - Will fire on animation completion.
			    onAnimationComplete: function(){
			    	// for (i in this.datasets[0].points)
			        var tempArr = [];
			        this.datasets[0].points.forEach(function(point){
			         if(point.value == 32){
			             tempArr.push(point);
			         }
			     });
			        this.showTooltip(tempArr, true);     
			    },

			}); //end Chart
},500); //end setTimeOut

		}//end window on load




