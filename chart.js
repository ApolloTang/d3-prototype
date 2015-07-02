var d3Chart = {};

d3Chart.init = function() {
    window.d = this;
    var margin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        },
        padding = {
            top: 30,
            right: 30,
            bottom: 30,
            left: 30
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
};

d3Chart.create = function(el, state) {
    this.init();
    var wrap = d3.select(el).append('svg')
        .attr('class', 'd3')
        .attr('style', 'border:1px lightgray solid;')
        .attr('width', '100%').attr('height', '100%')
        // .attr('width', this._conf.w_svg).attr('height', this._conf.h_svg)
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

    point.attr('transform', function(d){
            var x = scales.x(d.x[0].value);
            var dataY = parseInt(scales.y(d.y[0].value))
            var y = that._conf.height - dataY;//range.y[1]// - dataY;
            // var y = 0;
            // console.log('dataY: ', dataY, 'x: ',x, 'y: ', y )
            console.log('x: ',x, 'y: ', y )
            // return "translate("+x+","+y+")"
            return "translate("+x+","+0+")"
        })
        .append('rect')
        .attr( 'fill', 'red')
        .attr( 'stroke', 'gray')
        .attr( 'width', barWidth  )
        .attr( 'height', function(d){
            var o = parseInt(scales.y(d.y[0].value));
            return o
        })

    point.exit().remove();
}


d3Chart._scales = function(data, range, type) {
    range = null;

    var barWidth = parseInt(this._conf.width/(data.length));

    type = type || { x:'date', y:'linear' }
    // range = range || { x:[0,1000], y:[0,300] }
    range = range || { x:[0, this._conf.width-barWidth ], y:[0, this._conf.height] }

    var dataX = data.map(function(d){ return d.x[0].value; });
    var dataY = data.map(function(d){ return d.y[0].value; });

    var maxY = d3.max(dataY, function(d){ return d; });
    var startEndX = d3.extent(dataX, function(d){ return d; });//.reverse();
    var startEndY = [0, maxY];

    var x,y;

    switch (type.x) {
        case 'date':
            x = d3.time.scale().domain(startEndX).range(range.x);
            break;
    }

    switch (type.y) {
        case 'linear':
            y = d3.scale.linear().domain(startEndY).range(range.y);
            break;
    }

    return {x:x, y:y}
}
