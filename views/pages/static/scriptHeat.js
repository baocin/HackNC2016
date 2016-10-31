//global map variable
var map;
//AMD require statement to all in the classes that we be used from the API.  More info at: https://dojotoolkit.org/documentation/tutorials/1.10/modules/
require([
    "esri/map",
    "esri/InfoTemplate",
    "esri/layers/FeatureLayer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/Color",
    "dojo/parser",
    "dojo/domReady!"
  ],
  //The following are the class names that you will use when each object is created in the function.  The order of the class names must be in the same order as the require statements.  More info at: https://developers.arcgis.com/javascript/jshelp/intro_firstmap_amd.html#step3
  function(
    Map,
    InfoTemplate,
    FeatureLayer,
    SimpleMarkerSymbol,
    SimpleLineSymbol,
    SimpleRenderer,
    Color,
    parser
  ) {
    // To parse out dijits: https://dojotoolkit.org/reference-guide/1.10/dojo/parser.html
    parser.parse();
    //Create a new map. To see all the map constructors go to: https://developers.arcgis.com/javascript/jsapi/map-amd.html#map1
    map = new Map("mapDiv", {
      //set basemap to topo.  All the ArcGIS basemap options: "streets" , "satellite" , "hybrid", "topo", "gray", "dark-gray", "oceans", "national-geographic", "terrain", "osm", "terrain" and "dark-gray".  
      basemap: "topo",
      //Center the map at a Lat Long coordinate.  To find a lat long, type in "<City Name of your choice> lat long" into a browser search.
      center: [-78.9072, 35.9886],
      //Zoom level to start at, based on the basemap.
      zoom: 4 
    });

    //Symbol used to draw farmers market points.  Default style is circle. 
    var pointSymbol = new SimpleMarkerSymbol(); 
    //set circle size to 14 point
    pointSymbol.setSize(14);
    //create outline and set it to green
    pointSymbol.setOutline(new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([50, 255, 50]), 1));
    //set circle color to purple
    pointSymbol.setColor(new Color([207, 34, 171]));

    //Create the info window using HTML to reference the field values and construct the output
    var infoTemplate = new InfoTemplate("${name}", "Date:  ${startDate} <br> Site: <a href=\"${url}\">${url}</a> <br> <img src=\"${iconUrl}\">");
    //Create a new feature layer. More info at: https://developers.arcgis.com/javascript/jshelp/inside_feature_layers.html
    var featureLayer = new FeatureLayer
      //set the url to the rest endpoint of your data
      ("https://services7.arcgis.com/9FC4Dk51iODnloBr/arcgis/rest/services/Hackathonsheatmap/FeatureServer/0", {
        //See all the constructor options at: https://developers.arcgis.com/javascript/jsapi/featurelayer-amd.html#featurelayer1
        //Requests only the points from the server that are within the current map extent
        mode: FeatureLayer.MODE_ONDEMAND,
        //Returns all the fields in the JSON object coming back from the server.  Limit unwanted fields for better performance
        outFields: ["*"],
        //Sets the infotemplate that was create above.  https://developers.arcgis.com/javascript/jsapi/infotemplate-amd.html
        infoTemplate: infoTemplate
      });
    //Set render property of the feature Layer to a new simple renderer, applying the point symbol created above. https://developers.arcgis.com/javascript/jsapi/simplerenderer-amd.html
    //featureLayer.setRenderer(new SimpleRenderer(pointSymbol));
    //add the feature layer to the map
    map.addLayer(featureLayer);
    //Re-size the info window to properly hold the Name field value

    map.infoWindow.resize(250, 225);



});
