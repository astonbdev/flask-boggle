"use strict";

const $playedWords = $("#words");
const $form = $("#newWordForm");
const $wordInput = $("#wordInput");
const $message = $(".msg");
const $table = $("table");

let gameId;


/** Start */

async function start() {
  let response = await axios.post("/api/new-game");
  gameId = response.data.game_id;
  let board = response.data.board;

  displayBoard(board);
}

/** Display board */

function displayBoard(board) {
  // $table.empty();
  // loop over board and create the DOM tr/td structure
  const $htmlBoard = $(".board");
  $htmlBoard.empty();

  for (let row of board) {
    const $newRow = $("<tr>");

    $htmlBoard.append($newRow);

    for (let cell of row) {
      $newRow.append(
        $("<td>").text(cell)
      );
    }

    $htmlBoard.append($newRow);
  }
}

async function submitWord(e) {
  e.preventDefault();

  const json = JSON.stringify({ "gameId": gameId , "word": $("#wordInput").val().toUpperCase() });
  console.log(JSON.stringify({"gameId" : gameId}));
  console.log(gameId)
  console.log(json);

  let response = await axios.post("/api/score-word", json);

  console.log(response.data);
}

$form.on("submit", submitWord);


start();