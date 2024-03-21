$(() => {
  $.ajax({
    url: "/api/verification/get",
    type: "GET",
    success: async (data) => {
      for (const el of data.verifications) {
        $("#song-verification").append(
          generateNewItem(
            el.song.thumbnail,
            el.song.authors
              ? el.song.authors + " - " + el.song.title
              : el.song.title,
            el.author.mail + " (" + el.author.given_name + ")",
            el.song.songId,
          ),
        );
      }

      $("#verification-spinner").fadeOut(300);
      await wait(300);
      $("#verification-spinner").removeClass("d-flex").addClass("d-none");

      $("#song-verification").fadeIn(300);
    },
  });

  const generateNewItem = (thumbnail, song_name, author, song_id) => {
    return `
        <li class="item">
            <div class="row w-100">
                <div class="col">
                    <div class="item-content">
                        <div class="image">
                            <img src="${thumbnail}" alt="Song Image">
                        </div>
                        <div class="text d-flex">
                            <a class="title" href="https://www.youtube.com/watch?v=${song_id}">${song_name}</a>
                            <span class="author">Dodał: ${author}</span>
                        </div>
                        <div class="buttons">
                            <button class="btn btn-success">
                                <span class="iconify" data-icon="mdi:check" data-inline="false"></span>
                            </button>
                            <button class="btn btn-danger">
                                <span class="iconify" data-icon="mdi:close" data-inline="false"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </li>
      `;
  };
});
