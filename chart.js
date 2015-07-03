
var d3Chart = {};

d3Chart.init = function(el, data) {
    window.d = this;

    var margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        padding = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        }

    this._conf = {};
    this._conf.margin = margin;
    this._conf.padding = padding;
    this._conf.w_svg = 1000;
    this._conf.h_svg = 300;
    this._conf.w_wrap = this._conf.w_svg - margin.left - margin.right;
    this._conf.h_wrap = this._conf.h_svg - margin.top - margin.bottom;
    this._conf.width =  this._conf.w_wrap - padding.left - padding.right;
    this._conf.height = this._conf.h_wrap - padding.top - padding.bottom;

    this._cache = {};
    this.refreshCached(data);
};

d3Chart.refreshCached = function(data) {
    var dataX = data.map(function(d){ return d.x[0].value; });
    var dataY = data.map(function(d){ return d.y[0].value; });

    var maxDataY = d3.max(dataY, function(d){ return d; });
    var minDataY = d3.min(dataY, function(d){ return d; });
    var maxDataX = d3.max(dataX, function(d){ return d; });
    var minDataX = d3.min(dataX, function(d){ return d; });

    this._cache.maxDataY = maxDataY;
    this._cache.minDataY = minDataY;
    this._cache.maxDataX = maxDataX;
    this._cache.minDataX = minDataX;

    var M_maxDataX = moment(d3.max(dataX, function(d){ return d; }));
    var M_minDataX = moment(d3.min(dataX, function(d){ return d; }));
    var dayBetweetTwoDates = M_maxDataX.diff(M_minDataX, 'days') + 1; // include end point
    var w_dataResolution =parseInt( this._conf.width/dayBetweetTwoDates);

    this._cache.w_dataResolution = w_dataResolution;
    this._cache.dataResolutionOnXAxis = dayBetweetTwoDates;
};

d3Chart._daysBetweenTwoDates = function(day){
    var maxDataY = this._cache.maxDataY;
    var minDataY = this._cache.minDataY;
    var M_maxDataX = moment(d3.max(dataX, function(d){ return d; }));
    var M_minDataX = moment(d3.min(dataX, function(d){ return d; }));
    var daysBetweetTwoDates = M_maxDataX.diff(M_minDataX, 'days');
    return daysBetweetTwoDates;
};

d3Chart.create = function(el, state) {
    var data = state.data;
    this.init(el, data);

    var svgContainer = d3.select(el).append('svg')
        .attr('class', 'd3')
        .attr('style', 'border:1px lightgray solid;')
        .attr('width', '100%').attr('height', '100%')

    var wrap = svgContainer
        .append('g').classed('wrap', true)
        .attr("transform", "translate(" + this._conf.margin.left + "," + this._conf.margin.top + ")")

        wrap.append("rect")
            .attr("class", "wrap-background")
            .attr("width", this._conf.w_wrap)
            .attr("height", this._conf.h_wrap)
            .attr("fill", '#eeeeee')

        var plotArea = wrap.append('g').classed('data-points', true)
            .attr("transform", "translate(" + this._conf.padding.left + "," + this._conf.padding.top + ")");

        plotArea.append("rect")
            .attr("class", "plotArea-background")
            .attr("width", this._conf.width)
            .attr("height", this._conf.height)
            .attr("fill", '#aaeeee')
};

d3Chart.update = function(el, state) {
    var range = state.range;
    var data = state.data;
    this.refreshCached(data);
    var scales = this._scales(data);
    this._drawPoints(el, scales, data, range);
    this._drawXAxis();
};

d3Chart._drawPoints = function(el, scales, data, range) {
    var that = this;

    var viewBoxMaxX = this._conf.w_svg;
    var viewBoxMaxY = this._conf.h_svg;

    var svgContainer = d3.select(el).select('svg')
        .attr('viewBox', '0 0 ' + viewBoxMaxX + ' ' + viewBoxMaxY)

    var points = d3.select(el).select('.data-points');

    var point = points.selectAll('g').classed('data-point', true)
        .data(data, function(d) {return d.id})

    point.enter()
        .append('g').classed('data-point', true)

    var dataContainer = point.attr('transform', function(d){
            var x = scales.x(d.x[0].value);
            var dataY = parseInt(scales.y(d.y[0].value))
            var y = that._conf.height - dataY;//range.y[1]// - dataY;
            // var y = 0;
            // console.log('dataY: ', dataY, 'x: ',x, 'y: ', y )
            // console.log('x: ',x, 'y: ', y )
            // return "translate("+x+","+y+")"
            return "translate("+x+","+0+")"
        })

    dataContainer.append("circle")
            .attr("class", "origin")
            .attr("r", 4.5);

    dataContainer.append('rect')
        .attr( 'fill', 'none')
        .attr( 'x', -1*parseInt(this._cache.w_dataResolution/2) )
        .attr( 'stroke', 'red')
        .attr( 'width', this._cache.w_dataResolution  )
        .attr( 'height', function(d){
            var o = parseInt(scales.y(d.y[0].value));
            return o
        })
    point.exit().remove();

}

d3Chart._drawXAxis = function(){
    var maxDataY = this._cache.maxDataY;
    var minDataY = this._cache.minDataY;
    var maxDataX = this._cache.maxDataX;
    var minDataX = this._cache.minDataX;

    tS= minDataX;
    tE= maxDataX;

    rS= 0 + parseInt(this._cache.w_dataResolution/2);
    rE= this._conf.width - parseInt(this._cache.w_dataResolution/2);

    var AxisScale = d3.time.scale().domain([tS,tE]).range([rS,rE])
    var xAxis = d3.svg.axis()
        .scale(AxisScale)
        .orient("bottom").ticks(this._cache.dataResolutionOnXAxis)
        .tickSize(10)
        .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });
        //http://stackoverflow.com/questions/19459687/understanding-nvd3-x-axis-date-format

    var axisLocationY = this._conf.height;
    d3.select('.data-points').append('g')// Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0, "+ axisLocationY +")")
        .call(xAxis);
};

d3Chart._scales = function(data) {
    var dataX = data.map(function(d){ return d.x[0].value; });
    var dataY = data.map(function(d){ return d.y[0].value; });

    var maxDataY = this._cache.maxDataY;
    var minDataY = this._cache.minDataY;
    var maxDataX = this._cache.maxDataX;
    var minDataX = this._cache.minDataX;

    var pointDistance = this._cache.w_dataResolution;

    var startRangeX = 0 + pointDistance/2;
    var endRangeX   = this._conf.width - pointDistance/2;

    x = d3.time.scale()
        .domain([minDataX, maxDataX])
        .range([startRangeX, endRangeX]);

    y = d3.scale.linear()
        .domain([ 0, maxDataY])
        .range([ 0, 300]);

    return {x:x, y:y}
}

