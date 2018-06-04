
//test if browser supports webGL

if(Modernizr.webgl) {
	
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
		
		
		//get column name	
//		for (var column in data[0]) {
//			if (column == 'AREACD') continue;
//			if (column == 'AREANM') continue;
//			dvc.varname = column;
//		
//		}	
		
		//set title of page
		//Need to test that this shows up in GA
		document.title = dvc.maptitle;
		
		//Fire design functions
		//selectlist(data);
		createLegend(dvc);
		
		//Set up number formats
		displayformat = d3.format("." + dvc.displaydecimals + "f");
		legendformat = d3.format("." + dvc.legenddecimals + "f");


		//styles
   //   "tiles": ["..../documents/boundary/onekmsquares/tiles/onekm/{z}/{x}/{y}.pbf"]
//   var style = {
//  "version": 8,
//  "sources": {
//    "countries": {
//      "type": "vector",
//      // "url": "mapbox://map-id"
//      // "url": "http://tileserver.com/layer.json", 
//      "tiles": ["http://127.0.0.1/documents/boundary/onekmsquares/tiles/countries/{z}/{x}/{y}.pbf"],
//      "maxzoom": 6
//    }
//  },
//  "layers": [{
//    "id": "background",
//    "type": "background",
//    "paint": {
//      "background-color": "#ddeeff"
//    }
//  },{
//    "id": "country-glow-outer",
//    "type": "line",
//    "source": "countries",
//    "source-layer": "country",
//    "layout": {
//      "line-join":"round"
//    },
//    "paint": {
//      "line-color": "#226688",
//      "line-width": 5,
//      "line-opacity": {
//        "stops": [[0,0],[1,0.1]]
//      }
//    }
//  },{
//    "id": "country-glow-inner",
//    "type": "line",
//    "source": "countries",
//    "source-layer": "country",
//    "layout": {
//      "line-join":"round"
//    },
//    "paint": {
//      "line-color": "#226688",
//      "line-width": {
//        "stops": [[0,1.2],[1,1.6],[2,2],[3,2.4]]
//      },
//      "line-opacity":0.8,
//    }
//  // rainbow start
//  },{
//    "id": "area-white",
//    "type": "fill",
//    "source": "countries",
//    "filter":["in","ADM0_A3",'ATA'],
//    "source-layer": "country",
//    "paint": {
//      "fill-color": "#F0F8FF"
//    }
//  },{
//    "id": "area-red",
//    "type": "fill",
//    "source": "countries",
//    "filter":["in","ADM0_A3",'AFG','ALD','BEN','BLR','BWA','COK','COL','DNK','DOM','ERI','FIN','FRA','FRO','GIB','GNB','GNQ','GRC','GTM','JPN','KIR','LKA','MHL','MMR','MWI','NCL','OMN','RWA','SMR','SVK','SYR','TCD','TON','URY','WLF'],
//    "source-layer": "country",
//    "paint": {
//      "fill-color": "#fdaf6b"
//    }
//  },{
//    "id": "area-orange",
//    "type": "fill",
//    "source": "countries",
//    "filter":["in","ADM0_A3",'AZE','BGD','CHL','CMR','CSI','DEU','DJI','GUY','HUN','IOA','JAM','LBN','LBY','LSO','MDG','MKD','MNG','MRT','NIU','NZL','PCN','PYF','SAU','SHN','STP','TTO','UGA','UZB','ZMB'],
//    "source-layer": "country",
//    "paint": {
//      "fill-color": "#fdc663"
//    }
//  },{
//    "id": "area-yellow",
//    "type": "fill",
//    "source": "countries",
//    "filter":["in","ADM0_A3",'AGO','ASM','ATF','BDI','BFA','BGR','BLZ','BRA','CHN','CRI','ESP','HKG','HRV','IDN','IRN','ISR','KNA','LBR','LCA','MAC','MUS','NOR','PLW','POL','PRI','SDN','TUN','UMI','USA','USG','VIR','VUT'],
//    "source-layer": "country",
//    "paint": {
//      "fill-color": "#fae364"
//    }
//  },{
//    "id": "area-green",
//    "type": "fill",
//    "source": "countries",
//    "filter":["in","ADM0_A3",'ARE','ARG','BHS','CIV','CLP','DMA','ETH','GAB','GRD','GRL','HMD','IND','IOT','IRL','IRQ','ITA','KOS','LUX','MEX','NAM','NER','PHL','PRT','RUS','SEN','SUR','TZA','VAT'],
//    "source-layer": "country",
//    "paint": {
//      "fill-color": "#d3e46f"
//    }
//  },{
//    "id": "area-turquoise",
//    "type": "fill",
//    "source": "countries",
//    "filter":["in","ADM0_A3",'AUT','BEL','BHR','BMU','BRB','CYN','DZA','EST','FLK','GMB','GUM','HND','JEY','KGZ','LIE','MAF','MDA','NGA','NRU','SLB','SOL','SRB','SWZ','THA','TUR','VEN','VGB'],
//    "source-layer": "country",
//    "paint": {
//      "fill-color": "#aadb78"
//    }
//  },{
//    "id": "area-blue",
//    "type": "fill",
//    "source": "countries",
//    "filter":["in","ADM0_A3",'AIA','BIH','BLM','BRN','CAF','CHE','COM','CPV','CUB','ECU','ESB','FSM','GAZ','GBR','GEO','KEN','LTU','MAR','MCO','MDV','NFK','NPL','PNG','PRY','QAT','SLE','SPM','SYC','TCA','TKM','TLS','VNM','WEB','WSB','YEM','ZWE'],
//    "source-layer": "country",
//    "paint": {
//      "fill-color": "#a3cec5"
//    }
//  },{
//    "id": "area-purple",
//    "type": "fill",
//    "source": "countries",
//    "filter":["in","ADM0_A3",'ABW','ALB','AND','ATC','BOL','COD','CUW','CYM','CYP','EGY','FJI','GGY','IMN','KAB','KAZ','KWT','LAO','MLI','MNP','MSR','MYS','NIC','NLD','PAK','PAN','PRK','ROU','SGS','SVN','SWE','TGO','TWN','VCT','ZAF'],
//    "source-layer": "country",
//    "paint": {
//      "fill-color": "#ceb5cf"
//    }
//  },{
//    "id": "area-pink",
//    "type": "fill",
//    "source": "countries",
//    "filter":["in","ADM0_A3",'ARM','ATG','AUS','BTN','CAN','COG','CZE','GHA','GIN','HTI','ISL','JOR','KHM','KOR','LVA','MLT','MNE','MOZ','PER','SAH','SGP','SLV','SOM','TJK','TUV','UKR','WSM'],
//    "source-layer": "country",
//    "paint": {
//      "fill-color": "#f3c1d3"
//    }
//  // rainbow end
//  },{
//    "id": "geo-lines",
//    "type": "line",
//    "source": "countries",
//    "source-layer": "geo-lines",
//    "paint": {
//      "line-color": "#226688",
//      "line-width": {
//        "stops": [[0,0.2],[4,1]]
//      },
//      "line-dasharray":[6,2]
//    }
//  },{
//    "id": "land-border-country",
//    "type": "line",
//    "source": "countries",
//    "source-layer": "land-border-country",
//    "paint": {
//      "line-color": "#fff",
//      "line-width": {
//        "base":1.5,
//        "stops": [[0,0],[1,0.8],[2,1]]
//      }
//    }
//  },{
//    "id": "state",
//    "type": "line",
//    "source": "countries",
//    "source-layer": "state",
//    "minzoom": 3,
//    "filter": ["in","ADM0_A3",'USA','CAN','AUS'],
//    "paint": {
//      "line-color": "#226688",
//      "line-opacity": 0.25,
//      "line-dasharray":[6,2,2,2],
//      "line-width": 1.2
//    }
//  }]
//};

		//set up basemap
		map = new mapboxgl.Map({
		  container: 'map', // container id
		 // style: style,
		  style: "data/style.json", //stylesheet location
		  center: [-2.5, 54], // starting position
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
		

		
		//addFullscreen();
		
		//set up d3 color scales
				
//		rateById = {};
//		areaById = {};
//
//		data.forEach(function(d) { rateById[d.AREACD] = +eval("d." + dvc.varname); areaById[d.AREACD] = d.AREANM});	
//		
//		
//		//Flatten data values and work out breaks
//		var values =  data.map(function(d) { return +eval("d." + dvc.varname); }).filter(function(d) {return !isNaN(d)}).sort(d3.ascending);
//		
//		if(config.ons.breaks =="jenks") {
//			breaks = [];
//			
//			ss.ckmeans(values, (dvc.numberBreaks)).map(function(cluster,i) {
//				if(i<dvc.numberBreaks-1) {
//					breaks.push(cluster[0]);
//				} else {
//					breaks.push(cluster[0])
//					//if the last cluster take the last max value
//					breaks.push(cluster[cluster.length-1]);
//				}
//			});
//		}
//		else if (config.ons.breaks == "equal") {
//			breaks = ss.equalIntervalBreaks(values, dvc.numberBreaks);
//		}
//		else {breaks = config.ons.breaks;};
//		
//		
//		//round breaks to specified decimal places
//		breaks = breaks.map(function(each_element){
//			return Number(each_element.toFixed(dvc.legenddecimals));
//		});
//		
//		//work out halfway point (for no data position)
//		midpoint = breaks[0] + ((breaks[dvc.numberBreaks] - breaks[0])/2)
//		
//		//Load colours
//		if(typeof dvc.varcolour === 'string') {
//			colour = colorbrewer[dvc.varcolour][dvc.numberBreaks];
//		} else {
//			colour = dvc.varcolour;
//		}
//		
//		//set up d3 color scales
//		color = d3.scaleThreshold()
//				.domain(breaks.slice(1))
//				.range(colour);
		
		//now ranges are set we can call draw the key
		//createKey(config);
		
		
		map.on('load', function() {
			
				
			zoomThreshold = 10;
			
			map.addLayer({
				"id": "OAbounds",
				"type": "fill",
				"source": {
					"type": "vector",
					
					"tiles": ["https://maps.tilehosting.com/c/9b29dd2c-248e-459d-9dc5-28f4e358657d/data/OAethnicity/{z}/{x}/{y}.pbf.pict?key=7rA0yA362pBi9PZxyYlY"],
					//"tiles": ["http://localhost/documents/boundary/onekmsquares/tiles/countries/{z}/{x}/{y}.pbf"],
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
			
//"tiles": ["http://localhost/documents/boundary/onekmsquares/tiles/countries/{z}/{x}/{y}.pbf"],
//http://localhost/documents/fryford.github.io/mapdev/dotmapping/tiles/{z}/{x}/{y}.pbf
//https://maps.tilehosting.com/c/9b29dd2c-248e-459d-9dc5-28f4e358657d/data/ethnicitydots.json?key=7rA0yA362pBi9PZxyYlY
			
			// Add Mapillary sequence layer.
			// https://www.mapillary.com/developer/tiles-documentation/#sequence-layer
			map.addLayer({
				"id": "OApoints",
				'type': 'circle',
				"source": {
					"type": "vector",
					"tiles": ["https://maps.tilehosting.com/c/9b29dd2c-248e-459d-9dc5-28f4e358657d/data/ethnicitydots/{z}/{x}/{y}.pbf.pict?key=7rA0yA362pBi9PZxyYlY"],
					"minzoom": 1,
					"maxzoom": 14
				},
				"source-layer": "OA_All",
				'paint': {
					'circle-radius': {
						'base': 1.75,
						'stops': [[12, 2], [18, 30], [22, 180]]
					},
					'circle-color': [
						'match',
						['get', 'ethnicity'],
						'white', '#66c2a5',
						'black', '#fc8d62',
						'asian', '#8da0cb',
						'mixed', '#e78ac3',
						/* other */ '#a6d854'
					]
				}
			}, 'place_suburb');
		
			
			map.addLayer({
				"id": "OAboundshover",
				"type": "line",
				"source": {
					"type": "vector",
					"tiles": ["https://maps.tilehosting.com/c/9b29dd2c-248e-459d-9dc5-28f4e358657d/data/OAethnicity/{z}/{x}/{y}.pbf.pict?key=7rA0yA362pBi9PZxyYlY"],
					//"tiles": ["http://localhost/documents/boundary/onekmsquares/tiles/countries/{z}/{x}/{y}.pbf"],
					"minzoom": 1,
					"maxzoom": 14
				},
				"source-layer": "OA_bound_ethnicity",
				"minzoom": zoomThreshold,
				"layout": {
					"visibility": "visible"	
				},
				"paint": {
					"line-color": "#000",
					"line-width": 2
				},
				"filter": ["==", "oa11cd", ""]
			}, 'place_suburb');
			
		});
		
		
		//convert topojson to geojson
		//for(key in geog.objects){
//			var areas = topojson.feature(geog, geog.objects[key])
//		}
//		
//		//Work out extend of loaded geography file so we can set map to fit total extent
//		bounds = turf.extent(areas);
//		
//		//set map to total extent
//		setTimeout(function(){
//			map.fitBounds([[bounds[0],bounds[1]], [bounds[2], bounds[3]]])
//		},1000);
//		
//		//and add properties to the geojson based on the csv file we've read in
//		areas.features.map(function(d,i) {
//			
//		  d.properties.fill = color(rateById[d.properties.AREACD]) 
//		});
//
//		
//		map.on('load', function() {
//		  
//			map.addSource('area', { 'type': 'geojson', 'data': areas });
//		
//			  map.addLayer({
//				  'id': 'area',
//				  'type': 'fill',
//				  'source': 'area',
//				  'layout': {},
//				  'paint': {
//					  'fill-color': {
//							type: 'identity',
//							property: 'fill',
//					   },
//					  'fill-opacity': 0.7,
//					  'fill-outline-color': '#fff'
//				  }
//			  });
//			
//			//Get current year for copyright
//			today = new Date();
//			copyYear = today.getFullYear();
//			map.style.sourceCaches['area']._source.attribution = "Contains OS data &copy; Crown copyright and database right " + copyYear;
//			
//			map.addLayer({
//				"id": "state-fills-hover",
//				"type": "line",
//				"source": "area",
//				"layout": {},
//				"paint": {
//					"line-color": "#000",
//					"line-width": 2
//				},
//				"filter": ["==", "AREACD", ""]
//			});
//			
//			map.addLayer({
//				"id": "mapillary",
//				"type": "line",
//				"source": {
//					"type": "vector",
//					"tiles": ["...../documents/boundary/onekmsquares/tilesonekm/{z}/{x}/{y}.pbf"],
//					"minzoom": 6,
//					"maxzoom": 14
//				}
//			});
//					
//			  map.addLayer({
//				  'id': 'area_labels',
//				  'type': 'symbol',
//				  'source': 'area',
//				  'minzoom': 10,
//				  'layout': {
//					  "text-field": '{AREANM}',
//					  "text-font": ["Open Sans","Arial Unicode MS Regular"],
//					  "text-size": 14
//				  },
//				  'paint': {
//					  "text-color": "#666",
//					  "text-halo-color": "#fff",
//					  "text-halo-width": 1,
//					  "text-halo-blur": 1
//				  }
//			  });
//		  
//			 
//			//test whether ie or not
//			function detectIE() {
//			  var ua = window.navigator.userAgent;
//			
//			  // Test values; Uncomment to check result …
//			
//			  // IE 10
//			  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
//			
//			  // IE 11
//			  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
//			
//			  // Edge 12 (Spartan)
//			  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
//			
//			  // Edge 13
//			  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';
//			
//			  var msie = ua.indexOf('MSIE ');
//			  if (msie > 0) {
//				// IE 10 or older => return version number
//				return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
//			  }
//			
//			  var trident = ua.indexOf('Trident/');
//			  if (trident > 0) {
//				// IE 11 => return version number
//				var rv = ua.indexOf('rv:');
//				return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
//			  }
//			
//			  var edge = ua.indexOf('Edge/');
//			  if (edge > 0) {
//				// Edge (IE 12+) => return version number
//				return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
//			  }
//			
//			  // other browser
//			  return false;
//			}
//			
//			
//			if(detectIE()){
//				onMove = onMove.debounce(100);
//				onLeave = onLeave.debounce(100);
//				console.log("ie");
//			};
//			
			//Highlight stroke on mouseover (and show area information)
			map.on("mousemove", "OAbounds", onMove);
//	
//			// Reset the state-fills-hover layer's filter when the mouse leaves the layer.
//			map.on("mouseleave", "area", onLeave);
//			
//			//Add click event
//			map.on("click", "area", onClick);
//			
//			//get location on click
//			d3.select(".mapboxgl-ctrl-geolocate").on("click",geolocate);
//	
//		});
		
		function onMove(e) {
				newAREACD = e.features[0].properties.oa11cd;
				
				if(newAREACD != oldAREACD) {
					oldAREACD = e.features[0].properties.oa11cd;
					map.setFilter("OAboundshover", ["==", "oa11cd", e.features[0].properties.oa11cd]);
					
					console.log(e.features[0].properties);
					
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
					
	
					


					console.log(asian);
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
				newAREACD = e.features[0].properties.AREACD;
				
				if(newAREACD != oldAREACD) {
					oldAREACD = e.features[0].properties.AREACD;
					map.setFilter("state-fills-hover", ["==", "AREACD", e.features[0].properties.AREACD]);
					
					selectArea(e.features[0].properties.AREACD);
					setAxisVal(e.features[0].properties.AREACD);
				}
		};	
	
		function disableMouseEvents() {
				map.off("mousemove", "area", onMove);
				map.off("mouseleave", "area", onLeave);
		}
		
		function enableMouseEvents() {
				map.on("mousemove", "area", onMove);
				map.on("click", "area", onClick);
				map.on("mouseleave", "area", onLeave);	
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
			
			legend = d3.select('#keydiv')
				.append('ul')
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
	
	function success(pos) {
	  crd = pos.coords;
	  
	  //go on to filter
	  //Translate lng lat coords to point on screen
	  point = map.project([crd.longitude,crd.latitude]);
	  
	  //then check what features are underneath
	  var features = map.queryRenderedFeatures(point);
	  
	  //then select area
	  disableMouseEvents();
							
	  map.setFilter("state-fills-hover", ["==", "AREACD", features[0].properties.AREACD]);
	
	  selectArea(features[0].properties.AREACD);
	  setAxisVal(features[0].properties.AREACD);
	  
	  
	};
		
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