import fetch from "node-fetch";

let player = {
  is_playing: false,
};

export const toggle = (req, res) => {
  if (player.is_playing) {
    const response = fetch(`${process.env.PlayerURL}/pause`, {
      method: "GET",
    });

    if (response.status != 200) {
      res.json({
        message: "error - pause",
        error: "Player is not playing",
      });
    }

    player.is_playing = false;

    res.json({
      message: "success - pause",
    });
  } else {
    const response = fetch(`${process.env.PlayerURL}/play`, {
      method: "GET",
    });

    if (response.status != 200) {
      res.json({
        message: "error - play",
        error: "Player is not playing",
      });
    } else {
      player.is_playing = true;
      res.json({
        message: "success - play",
      });
    }
  }
};
