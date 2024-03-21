$(() => {
  $("#sidebar .nav .nav-link").on("click", (e) => {
    if ($(e.currentTarget).hasClass("active")) return;

    $("#sidebar .nav .nav-link").removeClass("active");
    $(e.currentTarget).addClass("active");

    console.log($(e.currentTarget));
  });

  $(".accodin-sidebar").on("click", async (e) => {
    if ($("#sidebar").hasClass("hidden")) {
      $(".accodin-sidebar.no-sidebar").animate(
        {
          left: "-3em",
        },
        400,
        () => {
          $("#sidebar")
            .css("right", "7rem")
            .removeClass("hidden d-none")
            .addClass("d-flex toggle toggled")
            .animate(
              {
                right: "0",
              },
              400,
            );
        },
      );
    } else if ($("#sidebar").hasClass("toggle")) {
      if ($(window).width() <= 1024) {
        $("#sidebar").animate(
          {
            right: "7rem",
          },
          400,
          () => {
            $("#sidebar").addClass("hidden d-none").removeClass("d-flex");

            $(".accodin-sidebar.no-sidebar").animate(
              {
                left: "0.5rem",
              },
              400,
            );
          },
        );
      } else {
        $("#sidebar").removeClass("toggle");
        await wait(400);
        $("#sidebar").removeClass("toggled");
      }
    } else {
      $("#sidebar").addClass("toggle toggled");
    }
  });

  $("#change-size-sidebar").on("click", async (e) => {
    if ($("#sidebar").hasClass("toggle")) {
      $("#sidebar").removeClass("toggle");
      await wait(400);
      $("#sidebar").removeClass("toggled");
    } else {
      $("#sidebar").addClass("toggle toggled");
      await wait(400);
    }
  });

  if ($(window).width() < 768) {
    $(".accodin-sidebar.no-sidebar").removeClass("d-none").addClass("d-flex");
    $("#sidebar").removeClass("d-flex").addClass("d-none hidden");
  } else if ($(window).width() > 768 && $(window).width() <= 1024) {
    $(".accodin-sidebar.no-sidebar").removeClass("d-none").addClass("d-flex");
    $("#sidebar")
      .removeClass("d-none hidden")
      .addClass("d-flex toggle toggled");
  } else {
    $(".accodin-sidebar").removeClass("d-flex").addClass("d-none");
    $("#sidebar").removeClass("d-none hidden").addClass("d-flex");
  }

  $("body").on("click", "[data-redirect]", (e) => {
    // DYNAMIC REDIRECT
    setURL($(e.currentTarget).attr("data-redirect"), true);
  });

  window.onpopstate = function () {
    var currentURL = window.location.href.split(window.location.origin)[1];
    setPage(currentURL, false);
  };

  let currentUrl;

  if (
    window.location.pathname.split("/")[2] == "" ||
    window.location.pathname.split("/")[2] == "index"
  ) {
    currentUrl = "/";
  } else {
    currentUrl = window.location.pathname.split("/")[2];
  }

  setPage(currentUrl, false);
  $("#sidebar .nav .nav-link").removeClass("active");
  $(`[data-redirect="/${currentUrl == "/" ? "" : currentUrl}"]`).addClass(
    "active",
  );
});

// wait function

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

async function setURL(url, loadContent = false) {
  if (loadContent) {
    setPage(url);
  } else {
    window.history.pushState(
      "data",
      "ZS14",
      "/admin" + url.startsWith("/") ? url : "/" + url,
    );
  }
}

async function setPage(url, setUrl = true) {
  const startTime = new Date().getTime();

  $("#page-content").fadeOut(300);
  await wait(300);
  $("#page-content").html(`
        <div id="spinner" class="d-flex justify-content-center align-items-center h-100">
            <div class="spinner-border" style="color: #019232 !important;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `);
  $("#page-content").fadeIn(300);
  await wait(300);

  $("#page-content > *").off();
  $("[data-page]").remove();

  if (url == "/") {
    url = "index";
  }

  const fileLocation = "/admin/pages/" + url + ".html";
  // check if file exists

  $.ajax({
    url: fileLocation,
    type: "HEAD",
    error: async function () {
      $("#page-content").fadeOut(300);
      await wait(300);
      $("#page-content").load("/admin/pages/404.html");
      $("#page-content").fadeIn(300);
      window.history.pushState("data", "ZS14", "/404");
    },
    success: async function () {
      const css = document.createElement("link");
      css.setAttribute("data-page", url);
      css.rel = "stylesheet";
      css.href = "/admin/css/" + url + ".css";
      document.head.appendChild(css);

      $("#page-content").fadeOut(300);
      await wait(300);
      $("#page-content").load(
        fileLocation,
        async function (response, status, xhr) {
          // LOAD JS

          const js = document.createElement("script");
          js.setAttribute("data-page", url);
          js.src = "/admin/js/" + url + ".js";
          document.head.appendChild(js);

          if (status == "error") {
            $("#page-content").load("/admin/pages/404.html");
            $("#page-content").fadeIn(300);
            window.history.pushState("data", "ZS14", "/admin/404");
          } else {
            $("#page-content").fadeIn(300);
            if (setUrl) {
              if (url == "index") url = "/";
              window.history.pushState(
                "data",
                "ZS14",
                `/admin${url.startsWith("/") ? url : "/" + url}`,
              );
            }
          }
        },
      );
    },
  });
}
