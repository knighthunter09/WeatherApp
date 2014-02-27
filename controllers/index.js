'use strict';


var IndexModel = require('../models/index');
var http = require("http");
var urls = ["http://api.wunderground.com/api/251b0334ab33a1db/conditions/q/CA/Campbell.json", 
			"http://api.wunderground.com/api/251b0334ab33a1db/conditions/q/NE/Omaha.json", 
			"http://api.wunderground.com/api/251b0334ab33a1db/conditions/q/TX/Austin.json",
			"http://api.wunderground.com/api/251b0334ab33a1db/conditions/q/MD/Timonium.json"];
var dataList = [];

function getData(res) {
	for (var i = 0; i < urls.length ; i++) {
			http.get(urls[i], function (response) {
			// data is streamed in chunks from the server
			// so we have to handle the "data" event    
			var buffer = "", 
			data,
			route;

			response.on("data", function (chunk) {
				buffer += chunk;
			}); 

			response.on("end", function (err) {
				// finished transferring data
				// dump the raw data
				console.log(buffer);
				console.log("\n");
				data = JSON.parse(buffer);
        
				dataList.push(data);
		
				if (dataList.length == urls.length) {
					var model = new IndexModel();
					var cities = [];
					for (var i = 0; i < dataList.length; i++) {
					if (dataList[i]) {
						cities.push(
						{
							state:dataList[i].current_observation.display_location["state"],
							city:dataList[i].current_observation.display_location["city"],
							temparature:dataList[i].current_observation["temp_c"],
							weather:dataList[i].current_observation["weather"],
						});
					}	
			}
			dataList.length = 0;
			model.cities = cities;
			res.render('index', model);
		}
    }); 
}); 

	}	
}

module.exports = function (app) {
    app.get('/', function (req, res) {
			getData(res);	        
    });

};
