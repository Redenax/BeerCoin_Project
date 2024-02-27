var mugHeight;
var beerHeight;
var percentFilled;
var roundedPercent;


function getHeights() {
    mugHeight = $('#mug').height();
    beerHeight = $('#beer').height();
    percentFilled = (beerHeight / mugHeight) * 100;
    roundedPercent = Math.round(percentFilled);

    return roundedPercent;
}


function verify(intervalID) {
    var height = 0;
    height = getHeights();
    if (height === 100) {
        $('#beer').css('animation-play-state', 'paused');
        $('#pour').removeClass('pouring');

        $('#handle').removeClass('hover');

        setTimeout(() => {
            $('#beer').removeClass('fill');
        }, 2000);
        clearInterval(intervalID)
    }
}


