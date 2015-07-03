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

    this._conf.barWidth2 = this._barWidth2(data);
    // console.log('barWidth2: ', this._conf.barWidth2)
    this._conf.w_dataResolution = this._w_dataResolution(data);
    // console.log('w_dataResolution: ', this._conf.w_dataResolution)
};

d3Chart._w_dataResolution = function(data) {

    var dataX = data.map(function(d){ return d.x[0].value; });
    var dataY = data.map(function(d){ return d.y[0].value; });
    var maxDataY = d3.max(dataY, function(d){ return d; });
    var minDataY = d3.min(dataY, function(d){ return d; });

    var M_maxDataX = moment(d3.max(dataX, function(d){ return d; }));
    var M_minDataX = moment(d3.min(dataX, function(d){ return d; }));
    var dayBetweetTwoDates = M_maxDataX.diff(M_minDataX, 'd') + 1;
    var w_dataResolution =parseInt( this._conf.width/dayBetweetTwoDates);
    return w_dataResolution;
};

d3Chart._barWidth2 = function(data) {
    var dataX = data.map(function(d){ return d.x[0].value; });
    var dataY = data.map(function(d){ return d.y[0].value; });
    var maxDataY = d3.max(dataY, function(d){ return d; });
    var minDataY = d3.min(dataY, function(d){ return d; });
    var maxDataX = d3.max(dataX, function(d){ return d; });
    var minDataX = d3.min(dataX, function(d){ return d; });

    this._scales(data).x(maxDataX);
    var barWidth2 = parseInt((this._scales(data).x(maxDataX)-this._scales(data).x(minDataX))/data.length);
    return barWidth2;
}


d3Chart.create = function(el, state) {
    var data = state.data;
    this.init(el, data);

    var svgContainer = d3.select(el).append('svg')
        .attr('class', 'd3')
        .attr('style', 'border:1px lightgray solid;')
        .attr('width', '100%').attr('height', '100%')
        // .attr('width', this._conf.w_svg).attr('height', this._conf.h_svg)

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
    var scales = this._scales( data, { x:range.x, y:range.y}, { x:'date', y:'linear' });
    this._drawPoints(el, scales, data, range);
};

d3Chart._drawPoints = function(el, scales, data, range) {
    var that = this;

    var barWidth = parseInt(this._conf.width/(data.length));
    var barWidth2 = this._conf.barWidth2;

    console.log('xxxxxxxxxxxxxxxx: ', barWidth, barWidth2 )

    // var viewBoxMaxX = range.x[1] + barWidth;
    var viewBoxMaxX = this._conf.w_svg;
    var viewBoxMaxY = this._conf.h_svg;
    var svgContainer = d3.select(el).select('svg')
        // .attr('viewBox', '0 0 ' + viewBoxMaxX + ' 300')
        .attr('viewBox', '0 0 ' + viewBoxMaxX + ' ' + viewBoxMaxY)

    var points = d3.select(el).select('.data-points');

    var point = points.selectAll('g').classed('data-point', true)
        .data(data, function(d) {return d.id})

    point.enter()
        .append('g').classed('data-point', true)

    var dataContainer = point.attr('transform', function(d){
            // var x = scales.x(d.x[0].value)+barWidth/2;
            var x = scales.x(d.x[0].value)// + barWidth2/2;
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
        .attr( 'x', -1*parseInt(this._conf.w_dataResolution/2) )
        .attr( 'stroke', 'red')
        .attr( 'width', this._conf.w_dataResolution  )
        .attr( 'height', function(d){
            var o = parseInt(scales.y(d.y[0].value));
            return o
        })
    point.exit().remove();

    var dataX = data.map(function(d){ return d.x[0].value; });
    var dataY = data.map(function(d){ return d.y[0].value; });
    var maxDataY = d3.max(dataY, function(d){ return d; });
    var minDataY = d3.min(dataY, function(d){ return d; });
    var maxDataX = d3.max(dataX, function(d){ return d; });
    var minDataX = d3.min(dataX, function(d){ return d; });

    tS= minDataX;//moment('2015-06-27' ).toDate()
    tE= maxDataX;//moment('2015-07-04' ).toDate()
    // rS= this._conf.margin.left+this._conf.padding.left+barWidth/2;
    // rE= this._conf.width;//+barWidth;//-this._conf.margin.right-this._conf.padding.right;

    rS= 0 + this._conf.w_dataResolution/2;// //this._conf.margin.left+this._conf.padding.left//;+barWidth/2;
    rE= this._conf.width - this._conf.w_dataResolution/2;
    console.log('barWidth: ', barWidth);
    console.log('_conf.width: ', this._conf.width);

    console.log('rS, rE: ', rS, rE);
    console.log('tS, tE: ', tS, tE);

    var AxisScale = d3.time.scale().domain([tS,tE]).range([rS,rE])
    var xAxis = d3.svg.axis()
        .scale(AxisScale)
        .orient("bottom").ticks(data.length)
        .tickSize(10)
        .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });

        //http://stackoverflow.com/questions/19459687/understanding-nvd3-x-axis-date-format

    var axisLocationY = this._conf.height;
    d3.select('.data-points').append('g')// Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0, "+ axisLocationY +")")
        .call(xAxis);

}


d3Chart._scales = function(data) {

    // var range;

    var barWidth = parseInt(this._conf.width/(data.length));

    // range = range || { x:[0,1000], y:[0,300] }
    // range = range || { x:[0, this._conf.width-barWidth ], y:[0, this._conf.height] }

    var dataX = data.map(function(d){ return d.x[0].value; });
    var dataY = data.map(function(d){ return d.y[0].value; });

    // var maxY = d3.max(dataY, function(d){ return d; });
    // var startEndX = d3.extent(dataX, function(d){ return d; });//.reverse();
    // var startEndY = [0, maxY];
    // var x,y;

    var maxDataY = d3.max(dataY, function(d){ return d; });
    var minDataY = d3.min(dataY, function(d){ return d; });
    var maxDataX = d3.max(dataX, function(d){ return d; });
    var minDataX = d3.min(dataX, function(d){ return d; });

    var pointDistance = this._conf.w_dataResolution;
    var startRangeX = 0 + pointDistance/2;
    var endRangeX   = this._conf.width - pointDistance/2;

    x = d3.time.scale().domain([minDataX, maxDataX]).range([startRangeX,endRangeX]);
    y = d3.scale.linear().domain([0, maxDataY]).range([0,300]);

    // x = d3.time.scale().domain([minDataX, maxDataX]).range([0,1000]);
    // y = d3.scale.linear().domain([0, maxDataY]).range([0,300]);

    // x = d3.time.scale().domain(startEndX).range(range.x);
    // y = d3.scale.linear().domain(startEndY).range(range.y);

    return {x:x, y:y}
}

