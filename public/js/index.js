$(() => {

    /*
    *
    *   PLAYER
    * 
    */ 

    var lastSong = null;
    $('#playButton').on('click', () => {
        if (cache['currentPlayerData'].playing) {
            $.ajax({
                url: playerUrl + '/player/pause',
                method: 'POST',
                success: (data) => {
                    $('#playButton i').removeClass('fa-stop').addClass('fa-play')
                }
            })
        } else {
            $.ajax({
                url: playerUrl + '/player/play',
                method: 'POST',
                success: (data) => {
                    $('#playButton i').removeClass('fa-play').addClass('fa-stop')
                },
                error: (err) => {
                    if (err.responseJSON.code == 'queue_empty') {
                        showNotify('info', 'Kolejka jest pusta!')
                    }
                }
            })
        }
    })

    $('#currentTime-bar').on('change', (e) => {
        if (!cache['currentPlayerData'].initialized) return
        
        $.ajax({
            url: playerUrl + 'player/seek',
            method: 'POST',
            data: {
                time: e.target.value
            },
            success: (data) => {
                // $('#playButton i').removeClass('fa-stop').addClass('fa-play')
            }
        })
    })

    $('#nextButton').on('click', () => {
        if (!cache['currentPlayerData'].initialized) return

        $.ajax({
            url: playerUrl + '/player/skip',
            method: 'POST',
            success: (data) => {
                $('#playButton i').removeClass('fa-stop').addClass('fa-play')
            },
            error: (err) => {
                console.log(err)
                if (err.responseJSON.code == 'queue_empty') {
                    showNotify('info', 'Kolejka jest pusta!');
                }
            }
        })
    })

    if (!loadedSitesJS['/admin/pages/dashboard.html']) {
        loadedSitesJS['/admin/pages/dashboard.html'] = true
        cache['currentPlayerData'] = {
            playing: false,
            currentTime: 0,
            length: 0,
            initialized: true
        }

        setInterval(() => {
            $.ajax({
                url: playerUrl + '/player/current',
                method: 'GET',
                success: (data) => {
                    cache['currentPlayerData'].playing = data.current?.playing || false
                    cache['currentPlayerData'].currentTime = data.current?.currentTime || 0
                    cache['currentPlayerData'].length = data.current?.length || 0
                    if (data.current?.playing) {
                        if ($('#currentTime-bar').attr('max') !== data.current?.length) {
                            $('#currentTime-bar').attr('max', data.current?.length)
                        }

                        // cache['currentPlayerData'].initialized = true
                        $('#playButton i').removeClass('fa-play').addClass('fa-stop')
                        $('#currentTime-bar').val(data.current?.currentTime)
                        $('#currentPlaying-text').text(`${secondsToMinutes(data.current?.currentTime)}/${secondsToMinutes(data.current?.length)}`)
                    } else {
                        $('#playButton i').removeClass('fa-stop').addClass('fa-play')
                    }

                    if (lastSong !== data.song?._id) {
                        refreshQueue()
                        $('#currentTime-bar').attr('max', data.current?.length)
                        $('#current-playing #thumbnail').attr('src', data.song?.song.thumbnail)
                        $('#current-playing #title').text(`${data.song?.song.title}`)
                        $('#current-playing #authors').text(`${data.song?.song.authors}`)
                        lastSong = data.song?._id || undefined
                    }
                },
                error: (jqXHR, textStatus, errorThrown) => {

                    if (jqXHR.status == 0) {
                        cache['currentPlayerData'].initialized = false
                        $('#playButton i').removeClass('fa-play').addClass('fa-stop')
                    }
                },
            })
        }, 1000)

        function secondsToMinutes(seconds) {
            const seconds2 = (seconds%60) < 10 ? `0${seconds%60}` : seconds%60
            const minutes = Math.floor(seconds / 60) < 10 ? `0${Math.floor(seconds / 60)}` : Math.floor(seconds / 60)
            return `${minutes}:${seconds2}`
        }
    }

    /*
    *
    *   SHORT QUEUE
    * 
    */ 

    function refreshQueue() {
        $('')
        $('#songsQueue-short').empty()
        $.ajax({
            url: '/api/queue/get',
            method: 'GET',
            success: (data) => {
                $('#songsInQueueCount').text(data.queue.length - 1)
                data.queue.forEach((song, index) => {
                    if (index > 6 || index == 0) return
                    $('#songsQueue-short').append(`
                        <li class="list-group-item">
                            <div class="container">
                                <div class="row d-flex justify-content-center align-items-center text-center">
                                    <div class="col-12 col-xl-4">
                                        <img src="${song.song.thumbnail}" class="rounded" alt="...">
                                    </div>
                                    <div class="col-12 col-xl-8 mt-3">
                                        <div class="row d-flex justify-content-center fw-bold">
                                            ${song.song.authors} - ${song.song.title}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    `)
                });

                if ($('#songsQueue-short li').length == 0) {                             
                    $('.border-bottom').removeClass('border-bottom')
                    $('#loading-element-queue-short').fadeOut(500).remove()
                    $('#songsQueue-short').fadeIn(500)
                    $('#songsQueue-short').append(`
                        <div class="alert alert-primary text-center" role="alert">
                            Brak piosenek w kolejce
                        </div>
                    `)
                    return
                }

                if (data.queue.length === 0) {
                    $('#current-playing #thumbnail').attr('src', 'https://cdn1.iconfinder.com/data/icons/pixel-perfect-at-16px-volume-1/16/5082-512.png')
                    $('#current-playing #title').text(`Brak piosenek w kolejce`)
                    $('#current-playing #authors').text(``)
                }

                setTimeout(() => {
                    $('#loading-element-queue-short').fadeOut(500).remove()
                    $('#songsQueue-short').fadeIn(500)
                }, 500)
            }
        })
    }

    refreshQueue()
})