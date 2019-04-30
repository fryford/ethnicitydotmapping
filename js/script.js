
//test if browser supports webGL

if(Modernizr.webgl) {

	function tog(v){return v?'addClass':'removeClass';}
	$(document).on('input', '.clearable', function(){
	    $(this)[tog(this.value)]('x');
	}).on('mousemove', '.x', function( e ){
	    $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('onX');
	}).on('touchstart click', '.onX', function( ev ){
	    ev.preventDefault();
	    $(this).removeClass('x onX').val('').change();
	});

	//setup pymjs
	var pymChild = new pym.Child();

	//Load data and config file
	d3.queue()
		//.defer(d3.csv, "data/chnglem.csv")
		.defer(d3.json, "data/config.json")
		//.defer(d3.json, "data/geog.json")
		.await(ready);


	function ready (error, config){

		//Set up global variables
		dvc = config.ons;
		oldAREACD = "";


		//set title of page
		//Need to test that this shows up in GA
		document.title = dvc.maptitle;

		//Fire design functions
		//selectlist(data);
		createLegend(dvc);

		//Set up number formats
		displayformat = d3.format("." + dvc.displaydecimals + "f");
		legendformat = d3.format("." + dvc.legenddecimals + "f");

		//set up basemap
		map = new mapboxgl.Map({
		  container: 'map', // container id
		 // style: style,
		  style: "data/style.json", //stylesheet location
		  center: [0.12, 51.50], // starting position
		  zoom: 8, // starting zoom
		  maxZoom: 20, //
		  attributionControl: false
		});
		//add fullscreen option
		map.addControl(new mapboxgl.FullscreenControl());

		// Add zoom and rotation controls to the map.
		map.addControl(new mapboxgl.NavigationControl());

		// Disable map rotation using right click + drag
		map.dragRotate.disable();

		// Disable map rotation using touch rotation gesture
		map.touchZoomRotate.disableRotation();


		// Add geolocation controls to the map.
		map.addControl(new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true
			}
		}));

		//add compact attribution
		map.addControl(new mapboxgl.AttributionControl({
			compact: true
		}));

		map.getCanvasContainer().style.cursor = 'pointer';

		//addFullscreen();



		map.on('load', function() {


			zoomThreshold = 11;

			map.addLayer({
				"id": "OAbounds",
				"type": "fill",
				"source": {
					"type": "vector",
					//"tiles": ["https://maps.tilehosting.com/c/9b29dd2c-248e-459d-9dc5-28f4e358657d/data/OAethnicity/{z}/{x}/{y}.pbf.pict?key=7rA0yA362pBi9PZxyYlY"],
					"tiles": ["https://cdn.ons.gov.uk/maptiles/t9/{z}/{x}/{y}.pbf"],
					"minzoom": 1,
					"maxzoom": 14
				},
				"minzoom": zoomThreshold,
				"source-layer": "OA_bound_ethnicity",
				"layout": {
					"visibility": "visible"
				},
				"paint": {
					"fill-outline-color": "rgb(0,0,0)",
					"fill-opacity": 0,
					"fill-color": "#fff"
				}
			}, 'place_suburb');

			// Add Mapillary sequence layer.
			// https://www.mapillary.com/developer/tiles-documentation/#sequence-layer
			map.addLayer({
				"id": "OApoints",
				'type': 'circle',
				"source": {
					"type": "vector",
					"tiles": ["https://cdn.ons.gov.uk/maptiles/t8/{z}/{x}/{y}.pbf"],
					"minzoom": 1,
					"maxzoom": 14
				},
				"source-layer": "OA_all",
				'paint': {
					'circle-radius': {
						'base': 4,
						'stops': [[11, 1], [12, 1.5], [13, 2], [14, 2.5], [16, 10], [22, 180]]
					},
					'circle-opacity': 0.8,
					'circle-color': [
						'match',
						['get', 'ethnicity'],
						'white', '#2bafdb',
						'black', '#ea38b3',
						'asian', '#2be1b3',
						'mixed', '#e8f12f',
						/* other */ '#f75d2b'
					]
				}
			}, 'place_suburb');


			map.addLayer({
				"id": "OAboundshover",
				"type": "line",
				"source": {
					"type": "vector",
					"tiles": ["https://cdn.ons.gov.uk/maptiles/t9/{z}/{x}/{y}.pbf"],
					//"tiles": ["https://maps.tilehosting.com/c/9b29dd2c-248e-459d-9dc5-28f4e358657d/data/OAethnicity/{z}/{x}/{y}.pbf.pict?key=7rA0yA362pBi9PZxyYlY"],
					"minzoom": 1,
					"maxzoom": 14
				},
				"source-layer": "OA_bound_ethnicity",
				"minzoom": zoomThreshold,
				"layout": {
					"visibility": "visible"
				},
				"paint": {
					"line-color": "#fff",
					"line-width": 2
				},
				"filter": ["==", "oa11cd", ""]
			}, 'place_suburb');

		});

		$("#submitPost").click(function( event ) {
						event.preventDefault();
						event.stopPropagation();
						myValue=$(".search-control").val();

						getCodes(myValue);
		});


			//Highlight stroke on mouseover (and show area information)
			map.on("mousemove", "OAbounds", onMove);
			map.on("click", "OAbounds", onClick);


			//Work out zoom level and update
			map.on("moveend", function (e) {
				zoom = parseInt(map.getZoom());

				baselevel = 13;
				numberperdotlowest = 10;
				dropdensity = 2;

				if(zoom < baselevel) {
					thepowerof = (baselevel - zoom);
					numberperdot = numberperdotlowest * Math.pow(dropdensity,thepowerof);

					d3.select("#people").text("1 dot = ~" +  (numberperdot).toLocaleString('en-GB') + " people")
				} else {
					d3.select("#people").text("1 dot = ~10 people")
				}
			});

			function getCodes(myPC)	{

				//first show the remove cross
				d3.select(".search-control").append("abbr").attr("class","postcode");

				console.log(myPC);

					var myURIstring=encodeURI("https://api.postcodes.io/postcodes/"+myPC);
					$.support.cors = true;
					$.ajax({
						type: "GET",
						crossDomain: true,
						dataType: "jsonp",
						url: myURIstring,
						error: function (xhr, ajaxOptions, thrownError) {
							console.log(thrownError);
								//$("#pcError").text("couldn't process this request").show();

							},
						success: function(data1){
							if(data1.status == 200 ){
								console.log(data1);
								//$("#pcError").hide();
								lat =data1.result.latitude;
								lng = data1.result.longitude;

								success(lat,lng)
								//$("#successMessage").text("The postcode " + myPC + " is situated in " + areaName + " which has an area code of " + area).show();
							} else {
			          //$("#successMessage").hide();
								//$("#pcError").text("Not a valid postcode I'm afraid").show();
							}
						}

					});

				}

		// function success(lat,lng) {
		//
		//   //go on to filter
		//
		// 	map.flyTo({center:[lng,lat], zoom:13, speed:0.7})
		//
		// 	map.on('flystart', function(){
		// 		flying=true;
		// 	});
		//
		// 	map.on('flyend', function(){
		// 		flying=false;
		// 	});
		//
		// 	map.on('moveend',function(e){
		//
		// 				setTimeout(function() {
		// 				//Translate lng lat coords to point on screen
		// 				point = map.project([lng,lat]);
		// 				//then check what features are underneath
		// 				var features = map.queryRenderedFeatures(point);
		//
		// 				console.log(features)
		//
		// 				//then select area
		// 				//disableMouseEvents();
		//
		// 				map.setFilter("OAboundshover", ["==", "oa11cd", features[0].properties.oa11cd]);
		// 			},500)
		//
		// 	});
		//
		//
		// };


		function success(lat,lng) {



	//console.log(point);

	map.flyTo({center:[lng,lat], zoom:13, speed:0.7})


	map.on('moveend', filterArea);

	function filterArea(e){
	point = map.project([lng,lat]);
	setTimeout(function(){

	var tilechecker = setInterval(function(){
		 features=null
		var features = map.queryRenderedFeatures(point,{layers: ['OAbounds']});
		console.log("I'm trying",features)
		if(features.length != 0){
			console.log(features)
			 //onrender(),
			map.setFilter("OAboundshover", ["==", "oa11cd", features[0].properties.oa11cd]);
			//var features = map.queryRenderedFeatures(point);
			disableMouseEvents();
			clearInterval(tilechecker);
			map.off('moveend',filterArea)
		}
	 },500)
	},500);
};


};


		function onMove(e) {
				newAREACD = e.features[0].properties.oa11cd;

				if(newAREACD != oldAREACD) {
					oldAREACD = e.features[0].properties.oa11cd;
					map.setFilter("OAboundshover", ["==", "oa11cd", e.features[0].properties.oa11cd]);

				//	console.log(e.features[0].properties);

					totalpop = +e.features[0].properties["ethnicityOA_Asian / Asian British: Bangladeshi"] +
							+e.features[0].properties["ethnicityOA_Asian / Asian British: Chinese"] +
							+e.features[0].properties["ethnicityOA_Asian / Asian British: Indian"] +
							+e.features[0].properties["ethnicityOA_Asian / Asian British: Other Asian"] +
							+e.features[0].properties["ethnicityOA_Asian / Asian British: Pakistani"] +
							+e.features[0].properties["ethnicityOA_White"] +
							+e.features[0].properties["ethnicityOA_Black / African / Caribbean / Black British"] +
							+e.features[0].properties["ethnicityOA_Mixed / Multiple ethnic group"] +
							+e.features[0].properties["ethnicityOA_Other Ethnic Group"];

					asian = displayformat(((+e.features[0].properties["ethnicityOA_Asian / Asian British: Bangladeshi"] +
							+e.features[0].properties["ethnicityOA_Asian / Asian British: Chinese"] +
							+e.features[0].properties["ethnicityOA_Asian / Asian British: Indian"] +
							+e.features[0].properties["ethnicityOA_Asian / Asian British: Other Asian"] +
							+e.features[0].properties["ethnicityOA_Asian / Asian British: Pakistani"])/totalpop)*100);

					white = displayformat((+e.features[0].properties["ethnicityOA_White"]/totalpop)*100);

					black = displayformat((+e.features[0].properties["ethnicityOA_Black / African / Caribbean / Black British"]/totalpop)*100);
					mixed = displayformat((+e.features[0].properties["ethnicityOA_Mixed / Multiple ethnic group"]/totalpop)*100);
					other = displayformat((+e.features[0].properties["ethnicityOA_Other Ethnic Group"]/totalpop)*100);


					percentages = [white,black,asian,mixed,other];

					d3.selectAll(".percentlabel").remove();

					legend.insert("label",".legendBlocks").attr('class','percentlabel').text(function(d,i) {
						return percentages[i] + "%";
					});

					percentages.forEach(function(d,i) {
						d3.select("#legendRect" + i).transition().duration(300).style("width", (percentages[i]/3.3333333) + "px");
					});





//					selectArea(e.features[0].properties.oa11cd);
//					setAxisVal(e.features[0].properties.oa11cd);
				}
		};


		function onLeave() {
				map.setFilter("state-fills-hover", ["==", "AREACD", ""]);
				oldAREACD = "";
				$("#areaselect").val("").trigger("chosen:updated");
				hideaxisVal();
		};

		function onClick(e) {
				disableMouseEvents();
				newAREACD = e.features[0].properties.oa11cd;

				if(newAREACD != oldAREACD) {
					oldAREACD = e.features[0].properties.oa11cd;
					map.setFilter("OAboundshover", ["==", "oa11cd", e.features[0].properties.oa11cd]);

				}
		};

		function disableMouseEvents() {
				map.off("mousemove", "OAbounds", onMove);
				map.off("mouseleave", "OAbounds", onLeave);
		}

		function enableMouseEvents() {
				map.on("mousemove", "OAbounds", onMove);
				map.on("click", "OAbounds", onClick);
				map.on("mouseleave", "OAbounds", onLeave);
		}

		function selectArea(code) {
			$("#areaselect").val(code).trigger("chosen:updated");
		}

		function zoomToArea(code) {

			specificpolygon = areas.features.filter(function(d) {return d.properties.AREACD == code})

			specific = turf.extent(specificpolygon[0].geometry);

			map.fitBounds([[specific[0],specific[1]], [specific[2], specific[3]]], {
  				padding: {top: 150, bottom:150, left: 100, right: 100}
			});

		}

		function resetZoom() {

			map.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]]);

		}


		function setAxisVal(code) {
			d3.select("#currLine")
				.style("opacity", function(){if(!isNaN(rateById[code])) {return 1} else{return 0}})
				.transition()
				.duration(400)
				.attr("x1", function(){if(!isNaN(rateById[code])) {return x(rateById[code])} else{return x(midpoint)}})
				.attr("x2", function(){if(!isNaN(rateById[code])) {return x(rateById[code])} else{return x(midpoint)}});


			d3.select("#currVal")
				.text(function(){if(!isNaN(rateById[code]))  {return displayformat(rateById[code])} else {return "Data unavailable"}})
				.style("opacity",1)
				.transition()
				.duration(400)
				.attr("x", function(){if(!isNaN(rateById[code])) {return x(rateById[code])} else{return x(midpoint)}});

		}

		function hideaxisVal() {
			d3.select("#currLine")
				.style("opacity",0)

			d3.select("#currVal").text("")
				.style("opacity",0)
		}

		function createLegend(keydata) {

			//d3.select("#keydiv")
			console.log(keydata);


			d3.select("#people").text("1 dot = ~320 people");

			legend = d3.select("#details-content-3").append('ul')
				.attr('class', 'key')
				.selectAll('g')
				.data(keydata.groups)
				.enter()
				.append('li')
				//.style("background-color", function(d , i) { return dvc.essential.colour_palette[i]; })
				.attr('class', function(d, i) { return 'key-item key-' + i + ' b '+ d.replace(' ', '-').toLowerCase(); })
				.on("mouseover",function(d, i){
					d3.selectAll(".key-item").style("opacity",0.2);
					d3.selectAll(".key-" + i).style("opacity",1);
				})
				.on("mouseout",function(d, i){
					d3.selectAll(".key-item").style("opacity",1);
				})

			legend.append('label').attr('class','legendlabel').text(function(d,i) {
				var value = parseFloat(d).toFixed(1);
				return d;
			});

			legend.append('div').style("width","40px").style("float","right").append("div").attr("class", "legendRect").attr("id",function(d,i){return "legendRect" + i}).style("width","0px");

			legend.append('b').attr("class", "legendBlocks")
				.style("background-color", function(d , i) { return keydata.colours[i]; });





		}

		function createKey(config){

			keywidth = d3.select("#keydiv").node().getBoundingClientRect().width;

			var svgkey = d3.select("#keydiv")
				.append("svg")
				.attr("id", "key")
				.attr("width", keywidth)
				.attr("height",65);


			var color = d3.scaleThreshold()
			   .domain(breaks)
			   .range(colour);

			// Set up scales for legend
			x = d3.scaleLinear()
				.domain([breaks[0], breaks[dvc.numberBreaks]]) /*range for data*/
				.range([0,keywidth-30]); /*range for pixels*/


			var xAxis = d3.axisBottom(x)
				.tickSize(15)
				.tickValues(color.domain())
				.tickFormat(legendformat);

			var g2 = svgkey.append("g").attr("id","horiz")
				.attr("transform", "translate(15,30)");


			keyhor = d3.select("#horiz");

			g2.selectAll("rect")
				.data(color.range().map(function(d,i) {

				  return {
					x0: i ? x(color.domain()[i+1]) : x.range()[0],
					x1: i < color.domain().length ? x(color.domain()[i+1]) : x.range()[1],
					z: d
				  };
				}))
			  .enter().append("rect")
				.attr("class", "blocks")
				.attr("height", 8)
				.attr("x", function(d) {
					 return d.x0; })
				.attr("width", function(d) {return d.x1 - d.x0; })
				.style("opacity",0.8)
				.style("fill", function(d) { return d.z; });


			g2.append("line")
				.attr("id", "currLine")
				.attr("x1", x(10))
				.attr("x2", x(10))
				.attr("y1", -10)
				.attr("y2", 8)
				.attr("stroke-width","2px")
				.attr("stroke","#000")
				.attr("opacity",0);

			g2.append("text")
				.attr("id", "currVal")
				.attr("x", x(10))
				.attr("y", -15)
				.attr("fill","#000")
				.text("");



			keyhor.selectAll("rect")
				.data(color.range().map(function(d, i) {
				  return {
					x0: i ? x(color.domain()[i]) : x.range()[0],
					x1: i < color.domain().length ? x(color.domain()[i+1]) : x.range()[1],
					z: d
				  };
				}))
				.attr("x", function(d) { return d.x0; })
				.attr("width", function(d) { return d.x1 - d.x0; })
				.style("fill", function(d) { return d.z; });

			keyhor.call(xAxis).append("text")
				.attr("id", "caption")
				.attr("x", -63)
				.attr("y", -20)
				.text("");

			keyhor.append("rect")
				.attr("id","keybar")
				.attr("width",8)
				.attr("height",0)
				.attr("transform","translate(15,0)")
				.style("fill", "#ccc")
				.attr("x",x(0));


			if(dvc.dropticks) {
				d3.select("#horiz").selectAll("text").attr("transform",function(d,i){
						// if there are more that 4 breaks, so > 5 ticks, then drop every other.
						if(i % 2){return "translate(0,10)"} }
				);
			}
			//Temporary	hardcode unit text
			dvc.unittext = "change in life expectancy";

			d3.select("#keydiv").append("p").attr("id","keyunit").style("margin-top","-10px").style("margin-left","10px").text(dvc.varunit);

	} // Ends create key

	function addFullscreen() {

		currentBody = d3.select("#map").style("height");
		d3.select(".mapboxgl-ctrl-fullscreen").on("click", setbodyheight)

	}

	function setbodyheight() {
		d3.select("#map").style("height","100%");

		document.addEventListener('webkitfullscreenchange', exitHandler, false);
		document.addEventListener('mozfullscreenchange', exitHandler, false);
		document.addEventListener('fullscreenchange', exitHandler, false);
		document.addEventListener('MSFullscreenChange', exitHandler, false);

	}


	function exitHandler() {

		console.log("shrink");
			if (document.webkitIsFullScreen === false)
			{
				shrinkbody();
			}
			else if (document.mozFullScreen === false)
			{
				shrinkbody();
			}
			else if (document.msFullscreenElement === false)
			{
				shrinkbody();
			}
		}

	function shrinkbody() {
		d3.select("#map").style("height",currentBody);
		pymChild.sendHeight();
	}

	function geolocate() {

		var options = {
		  enableHighAccuracy: true,
		  timeout: 5000,
		  maximumAge: 0
		};

		navigator.geolocation.getCurrentPosition(success, error, options);
	}



		function selectlist(datacsv) {

			var areacodes =  datacsv.map(function(d) { return d.AREACD; });
			var areanames =  datacsv.map(function(d) { return d.AREANM; });
			var menuarea = d3.zip(areanames,areacodes).sort(function(a, b){ return d3.ascending(a[0], b[0]); });

			// Build option menu for occupations
			var optns = d3.select("#selectNav").append("div").attr("id","sel").append("select")
				.attr("id","areaselect")
				.attr("style","width:98%")
				.attr("class","chosen-select");


			optns.append("option")
				.attr("value","first")
				.text("");

			optns.selectAll("p").data(menuarea).enter().append("option")
				.attr("value", function(d){ return d[1]})
				.text(function(d){ return d[0]});

			myId=null;

			$('#areaselect').chosen({width: "98%", allow_single_deselect:true}).on('change',function(evt,params){

					if(typeof params != 'undefined') {

							disableMouseEvents();

							map.setFilter("state-fills-hover", ["==", "AREACD", params.selected]);

							selectArea(params.selected);
							setAxisVal(params.selected);

							zoomToArea(params.selected);

					}
					else {
							enableMouseEvents();
							hideaxisVal();
							onLeave();
							resetZoom();
					}

			});

	};

	}

} else {

	//provide fallback for browsers that don't support webGL
	d3.select('#map').remove();
	d3.select('body').append('p').html("Unfortunately your browser does not support WebGL. <a href='https://www.gov.uk/help/browsers' target='_blank>'>If you're able to please upgrade to a modern browser</a>")

}
