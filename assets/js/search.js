function $(selector) {
    return document.querySelector(selector)
}

function get(url, callback) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText);
        }
    }
    request.open("GET", url, true);
    request.send();
}

document.addEventListener("DOMContentLoaded", function() {
    var autocomplete_list = $('.form-autocomplete ul.menu');
    var data = JSON.parse(localStorage.getItem('logotyp.data')) || [];

    if (!data.length || ((new Date() - parseInt(localStorage.getItem('logotyp.time'))) / 1000 > 3)) {
        get('/data.html', function(d) {
            data = JSON.parse(d);
            localStorage.setItem('logotyp.data', d)
            localStorage.setItem('logotyp.time', +new Date);
        });
    }

    var goto_menu_item = function(item) {
        document.location.href = '/logo/' + item.getAttribute('content').toLowerCase();
    }

    var handler = function(e) {

        if ('keyCode' in e && e.keyCode == 13) {
            goto_menu_item($('ul#autocomplete li'));
            return
        }

        if (e.target.value.length == 0) {
            $('#autocomplete').style.display = "none";
            return
        }
        $('#autocomplete').style.display = "block";

        if (e.target.value.length == 1) {
            autocomplete_list.innerHTML = '<li class="toast">Please enter at least 2 letters to search.</li>';
            return
        };

        var html = [];

        for (i in data) {
            if (data[i].toLowerCase().indexOf(e.target.value.toLowerCase()) >= 0) {
                html.push('<li class="menu-item" content="' + data[i].split('.')[0] + '" image="' + data[i] + '">' +
                    '<a href="#">' +
                    '<div class="chip">' +
                    '<div class="chip-content">' + data[i].replace(/-/g, ' ') + '</div>' +
                    '<div class="chip-icon">' +
                    '<img src="/logo/' + data[i].toLowerCase() + '.svg" class="avatar" />' +
                    '</div>' +
                    '</div>' +
                    '</a>' +
                    '</li>')
            }
        }

        if (!html.length) {
            $('#autocomplete').style.display = "none";
        } else {
            autocomplete_list.innerHTML = html.join('\n');
        }
        return false;

    }

    $('.form-input').addEventListener('keyup', handler);
    $('.form-input').addEventListener('focus', handler);

    $('body').addEventListener('click', function(e) {
        var parent = e.target.closest('li');

        if (parent && parent.className == 'menu-item') {
            goto_menu_item(parent);
        } else if (e.target.className.indexOf('form-input') >= 0 && e.target.value.length > 0) {
            $('#autocomplete').style.display = "block";
        } else {
            $('#autocomplete').style.display = "none";
        }
        return false;
    });
})