'use strict';
var flux = require('scripts/core/flux');
var CustomFluxMixin = require('scripts/common/mixins/CustomFluxMixin');
var d3Chart = require('./d3Chart');

var ChartExplorerSummary = React.createClass({
    getDefaultProps: function() {
        return {
            width: '100%',
            height: '300px'
        };
    },

    componentWillMount() {},

    componentWillReceiveProps() {},

    componentDidMount: function() {
        var el = this.getDOMNode();
        var state = this.prepareGraphState(this.props)
        d3Chart.create(el, state);
    },

    componentDidUpdate: function(prevProps, prevState) {
        var el = this.getDOMNode();
        console.log('================================== componentDidUpdate props', prevProps);
        console.log('================================== componentDidUpdate props', this.props);
        var state = this.prepareGraphState(this.props)
        console.log('================================== componentDidUpdate state', state);
        d3Chart.update(el, state);
    },

    prepareGraphState(props) {
        var allData = props.data;
        var data = allData.map(function(d) {
            return {
                x: [{
                    key: 'date-time',
                    value: moment(d.date).toDate(),
                    displayName: 'Date'
                }],
                y: [{
                    key: 'unfiltered_impressions',
                    value: d.unfiltered_impressions,
                    displayName: 'Total impression'
                }, {
                    key: 'filtered_impressions',
                    value: d.filtered_impressions,
                    displayName: 'Filter impression'
                }],
                id: _.uniqueId()
            }
        });
        var range = {
            x: [0, 1000],
            y: [0, 300]
        };

        var dataTest = [
              { x: [{ key: 'date-time', value: moment('2015-07-4').endOf('day').toDate(), displayName: 'Date' }], y: [{ key: 'unfiltered_impressions', value: 300, displayName: 'Total impression' }], id: _.uniqueId() }
            , { x: [{ key: 'date-time', value: moment('2015-07-3').endOf('day').toDate(), displayName: 'Date' }], y: [{ key: 'unfiltered_impressions', value: 0, displayName: 'Total impression' }], id: _.uniqueId() }
            , { x: [{ key: 'date-time', value: moment('2015-07-2').endOf('day').toDate(), displayName: 'Date' }], y: [{ key: 'unfiltered_impressions', value: 200, displayName: 'Total impression' }], id: _.uniqueId() }
            , { x: [{ key: 'date-time', value: moment('2015-07-1').endOf('day').toDate(), displayName: 'Date' }], y: [{ key: 'unfiltered_impressions', value: 100, displayName: 'Total impression' }], id: _.uniqueId() }
        ];

        var state = {};
        _.extend(state, { data: data }, { range: range });
        // _.extend(state, { data: dataTest }, { range: range });

        var tt = []
        data.forEach(function(i){
            var t = i.x[0].value;
            console.log('4444444444444444444444444444444444', t )
            })

        // var s = [];
        // var r = _.reduce( data, function(total, nextItem ){
        //     var t = parseInt(total)
        //     // console.log('pppppppppppppppppppppppppppppppppppppp : ', nextItem.y[0].value)
        //     var n = parseInt(nextItem.y[0].value)
        //     s.push(n)
        //     console.log('pppppppppppppppppppppppppppppppppppppp : ', t, n)
        //     return t + n;
        // }, 0 )
        //     console.log('pppppppppppppppppppppppppppppppppppppp REDUCE: ', r)
        //     console.log('pppppppppppppppppppppppppppppppppppppp SSSSSS: ', s)
        return state;
    },

    render: function() {
        return ( < div className = "Chart" > explorere summary chart goes here < /div>);
    }

});

module.exports = ChartExplorerSummary;
