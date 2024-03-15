$(() => {
    $.ajax({
        url: playerUrl + '/queue/list',
        method: 'GET',
        success: async (data) => {
            if (data.status == 200) {
                if (data.data.length > 0) {
                    data.data.forEach((el) => {
                        const song = el.song;
                        $('#queue-list').append(`
                            <li class="list-group-item d-flex align-items-center">
                                <div class="thumbnail">
                                    <img src="${song.thumbnail}" style="height: 6vh; width: auto;" alt="Thumbnail" class="img-thumbnail">
                                </div>
                                <div class="song-info text-center d-flex justify-content-center align-items-center flex-grow-1 mt-2">
                                    <div class="name fs-09">
                                        <span class="author fw-semibold">${song.authors}</span> - <span class="name">${song.title}</span>
                                    </div>
                                </div>
                            </li>
                        `);
                    });

                    await wait(500);
                    await $('#spinner').fadeOut(200).removeClass('d-flex').addClass('d-none');
                    $('#queue-list').fadeIn(200);
                } else {
                    await wait(500);
                    await $('#spinner').fadeOut(200).removeClass('d-flex').addClass('d-none');
                    $('#queue-empty').fadeIn(200);
                }
            } else {
                console.error(data);
                await wait(500);
                await $('#spinner').fadeOut(200).removeClass('d-flex').addClass('d-none');
                $('#queue-error').fadeIn(200);
            }
        },
        error: (err) => {
            console.error(err);
            $('#spinner').fadeOut(200).removeClass('d-flex').addClass('d-none');
            $('#queue-error').fadeIn(200);
        }
    });
});

wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));