var input_chart; // Highcharts wants this to be global.

(function($) {

    var chart_me = function(chart_id, options) {
        $(document).ready(function() {
            options = options || {}
            var chart_div = $('#' + chart_id);
            if (!chart_div.length) return;

            var chart_data = JSON.parse(chart_div.attr('data-chart-config'));
            var colors = {Praise: '#72B53E', Issue: '#BD5653', Ideas: '#EDD860'};
            var final_colors = [];
            // Store the previous x-axis label to prevent duplicates
            var previous_label;
            var tooltip_fmt = chart_div.attr('data-tooltip');
            var time_fmt = chart_div.attr('data-timeformat');
            var time_fmt_short = chart_div.attr('data-timeformat-short');
            var x_categories = chart_div.attr('data-categories');
            if (x_categories) {
                options.xAxis = {categories: JSON.parse(x_categories)};
            }
            // Build an array of colors depending of what graphs will be shown
            $.each(chart_data.series, function(k, v) {
                final_colors.push(colors[v.name]);
            });

            input_chart = new Highcharts.Chart({
                colors: options.colors || final_colors,
                chart: {
                    renderTo: chart_id,
                    defaultSeriesType: options.type || 'line',
                    margin: options.margin || [25, 25, 60, 45]
                },
                legend: options.legend || { y: 5 },
                title: {text: null},
                tooltip: options.tooltip || {
                    formatter: function() {
                        d = Highcharts.dateFormat(time_fmt, this.x * 1000)
                        return format(tooltip_fmt,
                                      {day: '<strong>' + d + '</strong>',
                                       num: '<strong>' + this.y + '</strong>'});
                    }
                },
                xAxis: options.xAxis || {
                    title: { text: null },
                    type: 'datetime',
                    labels: {
                        formatter: function() {
                            var label = Highcharts.dateFormat(time_fmt_short,
                                                        this.value * 1000);
                            if (previous_label == label) {
                                return null;
                            } else {
                                return previous_label = label;
                            }
                        }
                    },
                    lineColor: options.xLineColor || '#C0D0E0'
                },
                yAxis: options.yAxis || {
                    title: { text: null },
                    min: 0,
                    tickPixelInterval: 40,
                    minorTickInterval: 500,
                    minorGridLineColor: "rgba(0, 0, 0, .1)"
                },
                plotOptions: options.plotOptions || {},
                series: chart_data.series,
                credits: { enabled: false }
            }); // input_chart


        });
    }

    chart_me('feedback-chart');

    /** Show "welcome" block on first visit */
    $(document).ready(function() {
        if (!$.cookie('intro_seen')) {
            $('#welcome').show();
            $.cookie('intro_seen', true, {path: '/'});
        }
    });

})(jQuery);

