let $window = $(window);
let garden;

$(function () {
    let $loveHeart = $('#loveHeart');
    let offsetX = $loveHeart.width() / 2;
    let offsetY = $loveHeart.height() / 2 - 55;
    let $garden = $('#garden');
    let gardenCanvas = $garden[0];
    let gardenCtx = gardenCanvas.getContext('2d');
    garden = new Garden(gardenCtx, gardenCanvas);
    gardenCanvas.width = $('#loveHeart').width();
    gardenCanvas.height = $('#loveHeart').height();
    gardenCtx.globalCompositeOperation = 'lighter'; // 显示源图像 + 目标图像

    $("#content").css("width", $loveHeart.width() + $("#code").width());
    $("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
    $("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10)); // 垂直居中
    $("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));  // 水平居中

    // render loop
    setInterval(function () {
        garden.render();
    }, Garden.options.growSpeed);
});

// 返回爱心点坐标
function getHeartPoint(angle) {
    let t = angle / Math.PI;
    let x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
    let y = - 20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return new Array(offsetX + x, offsetY + y);
}

function startHeartAnimation() {
    let angle = 10; // 度数
    let heart = new Array();
    let animationTimer = setInterval(function () {
        let bloom = getHeartPoint(angle);
        let draw = true;
        for (let i = 0; i < heart.length; i++) { // 防止首位的颜色过度叠加(具体的还没弄懂)
            let p = heart[i];
            let distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
            if (distance < Garden.options.bloomRadius.max * 1.3) {
                draw = false;
                break;
            }
        }
        if (draw) {
            heart.push(bloom);
            garden.createRandomBloom(bloom[0], bloom[1]);   // 根据具体位置创建随机花朵;
        }
        if (angle >= 30) {
            clearInterval(animationTimer);
            showMessages();
        } else {
            angle += 0.2;
        }
    }, 75);
}

function adjustCodePosition() {
    $('#code').css('margin-top', ($('#garden').height() - $('#code').height()) / 2);
}

(function($) {
    $.fn.typewriter = function() {
        this.each(function() {
            let $ele = $(this);
            let str = $ele.html();
            let progress = 0;
            $ele.html('');
            let timer = setInterval(function() {
                let current = str.substr(progress, 1);
                if (current === '<') {
                    progress = str.indexOf('>', progress) + 1;
                } else {
                    progress++
                }
                $ele.html(str.substring(0, progress) + (progress & 1 ? '_' : ''))
            }, 75);
        });
        return this;
    }
})(jQuery);

function timeElapse(date) {
    let current = Date();
    let seconds = (Date.parse(current) - date) / 1000;
    let days = Math.floor(seconds / (3600 * 24));
    seconds = seconds % (3600 * 24);
    let hours = Math.floor(seconds / 3600);
    if (hours < 10) {
        hours = "0" + hours;
    }
    seconds = seconds % 3600;
    let minutes = Math.floor(seconds / 60);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    seconds = seconds % 60;
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    let result = "<span class=\"digit\">" + days + "</span> days <span class=\"digit\">" + hours + "</span> hours <span class=\"digit\">" + minutes + "</span> minutes <span class=\"digit\">" + seconds + "</span> seconds";
    $('#elapseClock').html(result);
}

function showMessages() {
    adjustWordsPosition();
    $('#messages').fadeIn(5000, function() {
        showLoveU();
    });
}

function adjustWordsPosition() {
    $('#words').css("position", "absolute");
    $('#words').css("top", $("#garden").position().top + 195);
    $('#words').css("left", $("#garden").position().left + 70);
}

function showLoveU() {
    $('#loveu').fadeIn(3000);
}
