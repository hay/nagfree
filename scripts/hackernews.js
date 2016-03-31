(() => {
// Based on https://github.com/niyazpk/Collapsible-comments-for-Hacker-News
var current_level_width = 0;
var inner_level_width = 1000;
if (!$('body').hasClass('collapsible-comments')) {

  $('body').addClass('collapsible-comments');
  var span_html = '<span style=\'cursor:pointer;\' class=\'expand-handle\'>[-]</span>';

  if (window.location.href.indexOf('item?id=') != -1) {
    $('center > table > tbody > tr:eq(2) > td > table:eq(1) span.comhead').prepend(span_html);
  } else if (window.location.href.indexOf('threads?id=') != -1) {
    $('center > table > tbody > tr > td > table span.comhead').prepend(span_html);
  }

  $('body').on('click', '.expand-handle', function() {

    current_level_width = parseInt($(this).closest('tr').find('td:eq(0) > img').attr('width'), 10);

    $(this).closest('table').closest('tr').nextAll().each(function(index, el) {
      var elWidth = parseInt($('tbody > tr > td > img', this).attr('width'), 10);
      if (elWidth > current_level_width) {
        if (elWidth <= inner_level_width) {
          inner_level_width = 1000;
          $(this).hide();
        }
        if (inner_level_width == 1000 && $('.comment', this).css('display') == 'none') {
          inner_level_width = elWidth;
        }
      } else {
        return false;
      }
    });

    inner_level_width = 1000;
    $(this).text('[+]').addClass('expand-handle-collapsed').removeClass('expand-handle');
    $(this).closest('div').nextAll().hide();
    $(this).closest('div').parent().prev().hide();
    $(this).closest('div').css({
      'margin-left': '18px',
      'margin-bottom': '5px'
    });
  });

  $('body').on('click', '.expand-handle-collapsed', function() {

    current_level_width = parseInt($(this).closest('tr').find('td > img').attr('width'), 10);

    $(this).closest('table').closest('tr').nextAll().each(function(index, el) {
      var elWidth = parseInt($('tbody > tr > td > img', this).attr('width'), 10);
      if (elWidth > current_level_width) {
        if (elWidth <= inner_level_width) {
          inner_level_width = 1000;
          $(this).show();
        }
        if (inner_level_width == 1000 && $('.comment', this).css('display') == 'none') {
          inner_level_width = elWidth;
        }
      } else {
        return false;
      }
    });

    inner_level_width = 1000;
    $(this).text('[-]').addClass('expand-handle').removeClass('expand-handle-collapsed');
    $(this).closest('div').nextAll().show();
    $(this).closest('div').parent().prev().show();
    $(this).closest('div').css({
      'margin-left': '0',
      'margin-bottom': '-10px'
    });
  });
}
})();