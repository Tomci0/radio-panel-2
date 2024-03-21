$(() => {
  $.ajax({
    url: "/api/getQueue",
    method: "GET",
    success: async (data) => {
      if (data.queue.length > 0) {
        for (const el of data.queue) {
          $("#queue-list").append(
            generateNewItem(
              el.song.thumbnail,
              el.song.authors
                ? `${el.song.authors} - ${el.song.title}`
                : el.song.title,
              el.song.songId,
            ),
          );
        }

        $("#spinner").fadeOut(300);
        await wait(300);
        $("#spinner").removeClass("d-flex").addClass("d-none");
        $("#queue-list").fadeIn(300);
      }
    },
    error: (err) => {
      console.error(err);
      $("#spinner").fadeOut(200).removeClass("d-flex").addClass("d-none");
      $("#queue-error").fadeIn(200);
    },
  });
});

const generateNewItem = (thumbnail, song_name, song_id) => {
  return `
    <li class="list-group-item d-flex align-items-center">
        <div class="thumbnail">
            <img src="${thumbnail}" style="height: 6vh; width: auto;" alt="Thumbnail" class="img-thumbnail">
        </div>
        <div class="song-info text-center d-flex justify-content-center align-items-center flex-grow-1 mt-2">
            <div class="name fs-09">
                <a href="https://www.youtube.com/watch?v=${song_id}">${song_name}</a>
            </div>
        </div>
    </li>
  `;
};

wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
