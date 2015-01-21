/* global ArucoMarker, $ */

'use strict';

(function() {

    var $marker_count = $('#marker-count');
    var $marker_random = $('#marker-random:checkbox');
    var $marker_ids = $('#marker-ids');
    var $ids = $('#ids');
    var $markers = $('#markers');
    var $marker_width = $('#marker-width');
    var $marker_spacing = $('#marker-spacing');

    var width = '2cm';
    var spacing = '0.2cm';

    var MAX_CODES = 1024;

    var rand_num = function(max) {
        var r = Math.random();
        return Math.floor(r * max);
    };

    var parse = function(text) {

        var values = text.replace(' ', '')
            .split(',')
            .filter(function(d) {
                return d.length !== 0;
            })
            .map(function(d) {
                return Number(d, 10);
            })
            .filter(function(d) {
                return d === 0 || d;
            });

        return values;
    };

    var create_and_append_markers = function(ids) {
        $markers.html('');
        ids.forEach(function(id) {
            var marker = new ArucoMarker(id);
            var $marker = $('<div></div>')
                .addClass('marker')
                .css('width', width)
                .css('padding-bottom', spacing)
                .css('padding-left', spacing);
            $marker.html(marker.toSVG());
            $markers.append($marker);
        });
    };

    var marker_count_callback = function() {
        var num = Number($marker_count.val());
        var random = $marker_random.is(':checked');

        var ids = [];
        if (num) {
            for (var i = 0; i < num; i++) {
                if (random) {
                    ids.push(rand_num(MAX_CODES));
                } else {
                    ids.push(i);
                }
            }
        }
        $marker_ids.val(ids.join(','));
        create_and_append_markers(ids);
    };

    var marker_ids_callback = function() {

        // try to parse the input
        var text = $marker_ids.val();

        var values = parse(text);
        $ids.html(values.join(', '));
        create_and_append_markers(values);
        marker_width_callback();
        marker_spacing_callback();

    };

    var marker_width_callback = function() {
        var num = Number($marker_width.val()) + 'cm';
        if (num) {
            width = num;
            $('.marker').css('width', num);
        }
    };

    var marker_spacing_callback = function() {
        var num = Number($marker_spacing.val()) + 'cm';
        if (num) {
            spacing = num;
            $('.marker').css('padding-bottom', num).css('padding-left', num);
        }
    };

    $marker_count.on('keyup', marker_count_callback);
    $marker_random.change(marker_count_callback);
    $marker_ids.on('keyup', marker_ids_callback);
    $marker_width.on('keyup', marker_width_callback);
    $marker_spacing.on('keyup', marker_spacing_callback);

    // when the page loads
    marker_count_callback();
    marker_width_callback();
    marker_spacing_callback();

})();
