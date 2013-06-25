function formatSeconds(sec_num) {
	var hours   = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	var seconds = sec_num - (hours * 3600) - (minutes * 60);

	if (hours < 10) {hours   = "0"+hours;}
	if (minutes < 10) {minutes = "0"+minutes;}
	if (seconds < 10) {seconds = "0"+seconds;}

	return hours + ':' + minutes + ':' + seconds;
}

function round(x, n) {
	var a = Math.pow(10, n);
	return (Math.round(x * a) / a);
}

function hasOffset($element) {
	var id = parseInt($element.attr('data-id'), 10);
	var startElement = $('input[data-id="' + (id - 1) + '"]');

	var startReal = new Date(parseInt($(startElement).attr('data-date'), 10) * 1000);
	var startOffset = new Date(parseInt($element.attr('data-date'), 10) * 1000);

	if ((startReal.getTime() - startOffset.getTime()) > maxIdleDuration) {
		return true;
	} else {
		return false;
	}
}

function getStart($element) {
	var id = parseInt($element.attr('data-id'), 10);
	var startElement = $('input[data-id="' + (id - 1) + '"]');

	var startReal = new Date(parseInt($(startElement).attr('data-date'), 10) * 1000);
	var startOffset = new Date(parseInt($element.attr('data-date'), 10) * 1000);

	if ((startReal.getTime() - startOffset.getTime()) > maxIdleDuration) {
		start = new Date(startReal.getTime() - maxIdleDuration);
	} else {
		start = startOffset;
	}

	return start;
}

$(function () {
	console.log('Init javascript.');

	$('#calculate').on('click', function() {
		console.log('Calculate...');

		var $billing = $('#billing');

		var start = null;
		var end = null;
		var duration = 0;
		var set = [];
		var sets = [];
		var html = '';
		var time = 0;

		$('#commits input').each(function() {
			if ($(this).prop('checked') === true) {

				if (end === null) {
					set = [];
					end = new Date(parseInt($(this).attr('data-date'), 10) * 1000);
				} else if (hasOffset($(this))) {
					start = getStart($(this));

					sets.push({
						messages: set,
						duration: ((end.getTime() - start.getTime()) / 1000)
					});

					end = null;
				}

				set.push($(this).attr('data-message'));
			} else {
				if (end !== null) {
					start = getStart($(this));

					sets.push({
						messages: set,
						duration: ((end.getTime() - start.getTime()) / 1000)
					});

					end = null;
				}
			}
		});

		html = '<table class="table table-striped">';
		html += '<thead>';
		html += '<tr>';
		html += '<th>Tasks</th>';
		html += '<th>Time</th>';
		html += '<th>Money</th>';
		html += '</tr>';
		html += '</thead>';
		html += '<tbody>';
		for (var i = 0; i < sets.length; i++) {
			html += '<tr>';
			html += '<td>';
			html += '<ul>';
			for (var j = 0; j < sets[i].messages.length; j++) {
				html += '<li>' + sets[i].messages[j] + '</li>';
			}
			html += '</ul>';
			html += '</td>';
			html += '<td>';
			html += formatSeconds(sets[i].duration);
			html += '</td>';
			html += '<td>';
			html += round(moneyPerSecond * sets[i].duration, 2) + ' ' + currencySymbol;
			html += '</td>';
			html += '</tr>';

			time += sets[i].duration;
		}
		html += '</tbody>';
		html += '<tfoot>';
		html += '<tr>';
		html += '<td></td>';
		html += '<td>' + formatSeconds(time) + '</td>';
		html += '<td>' + round(time * moneyPerSecond, 2) + ' ' + currencySymbol + '</td>';
		html += '</tr>';
		html += '</tfoot>';
		html += '</table>';

		$billing.html(html);
	});
});