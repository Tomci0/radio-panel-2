$(() => {
    let searchedMusic = [];
    let player;
    let timeupdater;

    $('#music-query-inp').on('input propertychange', function() {
        let query = $(this).val();
        
        if (query.length > 0) {
            $(this).addClass('is-valid').removeClass('is-invalid');
        } else {
            $(this).addClass('is-invalid').removeClass('is-valid');
            $('#music-query-btn').prop('disabled', true);
        }
    });

    $('#find-query-btn').on('click', async () => {
        let query = $('#music-query-inp').val();
        
        if (query.length == 0) return false;
        
        await $('#results').fadeIn(200);
        await $('#request-results').fadeOut(200)
        $('#spinner').removeClass('d-none').addClass('d-flex');
        $('#request-results-list').empty();
        

        $.ajax({
            url: '/request/search?q=' + query,
            method: 'GET',
            success: async (data) => {
                if (data.data.length > 0) {
                    $('#search-results').empty();
                    searchedMusic = data.data;
                    for (const song of data.data) {
                        $('#request-results-list').append(`
                            <li class="list-group-item d-flex align-items-center" data-song-id="${song.id.videoId}">
                                <div class="thumbnail">
                                    <img src="${song.snippet.thumbnails.length && song.snippet.thumbnails[0].url || song.snippet.thumbnails.url}" style="height: 6vh; width: auto;" alt="Thumbnail" class="img-thumbnail">
                                </div>
                                <div class="song-info text-center d-flex justify-content-center align-items-center flex-grow-1 mt-2">
                                    <div class="name fs-09">
                                        ${song.title}
                                    </div>
                                </div>
                            </li>
                        `)
                    }

                    await $('#spinner').fadeOut(200).removeClass('d-flex').addClass('d-none');
                    $('#request-results').fadeIn(200);
                }
            }
        })
    });

    let currentSong = null;

    $('#request-results-list').on('click', 'li', async function() {
        let songId = $(this).data('song-id');
        $('#accept-music-modal').data('songId', songId);
        $('#accept-music-modal').modal('show');
        
    });

    $('#accept-music-modal').on('show.bs.modal', function() {
        let songId = $(this).data('songId');
        let song = searchedMusic.find((el) => el.id.videoId == songId);

        let title = song.title;
        let thumbnail = song.snippet.thumbnails.length && song.snippet.thumbnails[0].url || song.snippet.thumbnails.url;

        $('#accept-music-modal .modal-body #thumbnail').attr('src', thumbnail);
        $('#accept-music-modal .modal-body #title').text(title);
        $('#accept-music-modal .modal-body #length #duration').text(song.duration_raw);

        $('#accept-music-modal #play-btn .iconify').attr('data-icon', 'material-symbols:play-circle')
        $('#accept-music-modal #duration-bar').css('width', '0');
        $('#accept-music-modal #current-time').text('00:00');

        player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId: songId,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    });

    $('#accept-music-modal').on('hide.bs.modal', function() {
        $('#accept-music-modal .modal-body #thumbnail').attr('src', '');
        $('#accept-music-modal .modal-body #title').text('');
        $('#accept-music-modal .modal-body #length #duration').text('');
        $('#accept-music-modal').data('songId', '');

        player.stopVideo();
        player.destroy();
        player = null;
        clearInterval(timeupdater)

        $('#accept-music-modal #play-btn .iconify').attr('data-icon', 'material-symbols:play-circle')
        $('#accept-music-modal #duration-bar').css('width', '0');
        $('#accept-music-modal #current-time').text('00:00');
    });

    $('#accept-music-modal #send-request-btn').on('click', async function() {
        const songId = $('#accept-music-modal').data('songId');

        if (!songId) return false;

        const duration = $('#accept-music-modal .modal-body #length #duration').text()

        $.ajax({
            url: '/request/send',
            method: 'POST',
            data: { 
                songId,
                title: $('#accept-music-modal .modal-body #title').text(),
                thumbnail: $('#accept-music-modal .modal-body #thumbnail').attr('src'),
                duration: Number(duration.split(':')[0]*60) + Number(duration.split(':')[1])
            },
            withCredentials: true,
            success: async (data) => {
                if (data.status == 200) {
                    $('#accept-music-modal').modal('hide');
                    $('#music-query-inp').val('');
                    $('#results').fadeOut(200);
                    $('#request-results').fadeOut(200);
                    $('#request-results-list').empty();
                    $('#search-results').empty();
                    $('#spinner').removeClass('d-none').addClass('d-flex');
                    $('#request-results').fadeIn(200);
                    Notify.show('Prośba o dodanie utworu została wysłana.', 'success')
                }
            },
            error: (err) => {
                if (err.responseJSON.code == 'too_many_requests') {
                    Notify.show('Możesz wysłać prośbę o dodanie utworu co 5 minut.', 'warning')
                }
            }
        });
    });

    // YOUTUBE PLAYER FUNCTIONS

    function onPlayerReady(event) {
        $('#accept-music-modal #play-btn').on('click', togglePlay);
    }

    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.ENDED) {
            $('#accept-music-modal #play-btn .iconify').attr('data-icon', 'material-symbols:play-circle')
            clearInterval(timeupdater);
            $('#accept-music-modal #duration-bar').css('width', '0');
            $('#accept-music-modal #current-time').text('00:00');
            player.seekTo(0, true);
        }
    }

    let ui = {
        play: 'playAudio',
        audio: 'audio',
        percentage: 'percentage',
        seekObj: 'seekObj',
        currentTime: 'currentTime'
    };

    function togglePlay() {
        if (player.getPlayerState() === 1) {
            player.pauseVideo();
            $('#accept-music-modal #play-btn .iconify').attr('data-icon', 'material-symbols:play-circle')
        } else {
            timeupdater = setInterval(initProgressBar, 1000);
            player.playVideo();
            $('#accept-music-modal #play-btn .iconify').attr('data-icon', 'material-symbols:pause-circle')
        }
    }
        
    function calculatePercentPlayed() {
        let percentage = (player.getCurrentTime() / player.getDuration()) * 100;
        $('#accept-music-modal #duration-bar').css('width', `${percentage}%`);
    }

    function calculateCurrentValue(currentTime) {
        const currentMinute = parseInt(currentTime / 60) % 60;
        const currentSecondsLong = currentTime % 60;
        const currentSeconds = currentSecondsLong.toFixed();
        const currentTimeFormatted = `${currentMinute < 10 ? `0${currentMinute}` : currentMinute}:${currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds}`;
        
        return currentTimeFormatted;
    }

    function initProgressBar() {
        const currentTime = calculateCurrentValue(player.getCurrentTime());
        $('#accept-music-modal #current-time').text(currentTime);
        calculatePercentPlayed();
    }
});