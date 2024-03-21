$(() => {
  $.ajax({
    url: "/api/getQueue",
    type: "GET",
    success: async (data) => {
      let i = 0;
      for (const el of data.queue) {
        $("#queue").append(
          generateNewItem(
            el.song.thumbnail,
            el.song.authors
              ? el.song.authors + " - " + el.song.title
              : el.song.title,
            el.author.mail + " (" + el.author.given_name + ")",
            el.song.songId,
            i === 0 ? true : false,
          ),
        );
        i++;
      }

      $("#queue-spinner").fadeOut(300);
      await wait(300);
      $("#queue-spinner").removeClass("d-flex").addClass("d-none");

      $("#queue").fadeIn(300);
    },
    error: (err) => {
      console.log(err);
    },
  });

  $("#queue").sortable({
    easing: "cubic-bezier(1, 0, 0, 1)",
    filter: ".ignore-element",
    handle: ".move",
    forceFallback: true,
    onMove: function (/**Event*/ evt, /**Event*/ originalEvent) {
      if ($(evt.dragged).index() === 0) return false;
      const relatedIndex = $(evt.related).index();
      if (relatedIndex === 0) {
        return false;
      }
    },
    onEnd: function (/**Event*/ evt) {
      // $.ajax({
      //     url: playerUrl + '/queue/changeIndex',
      //     method: 'POST',
      //     data: {
      //         index: evt.oldIndex,
      //         newIndex: evt.newIndex
      //     },
      //     success: (data) => {
      //     },
      //     error: (err) => {
      //         console.log(err)
      //     }
      // })
    },
  });

  const generateNewItem = (thumbnail, song_name, author, song_id, is_first) => {
    return `
      <li class="item">
          <div class="row w-100">
              ${
                !is_first
                  ? `
                  <div class="col-auto d-flex justify-content-center align-items-center">
                    <div class="move ">
                      <span class="iconify" data-icon="mdi:arrow-up-down" data-inline="true"></span>
                    </div>
                  </div>`
                  : ""
              }
              <div class="col">
                <div class="item-content">
                  <div class="image">
                    <img src="${thumbnail}" alt="Song Image">
                  </div>
                  <div class="text d-flex ">
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
