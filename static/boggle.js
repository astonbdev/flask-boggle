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
  const $word = $("#wordInput").val().toUpperCase() 
  const json = JSON.stringify({ "game_id": gameId ,  "word": $word });
  console.log(json);

  let response = await axios.post("/api/score-word", json, {headers: {
    // Overwrite Axios's automatically set Content-Type
    'Content-Type': 'application/json'
  }});

  console.log(response.data);
  const msg   = response.data.result;
  if(msg == "not-word"){
    $message.text(msg);
  }
  else if(msg == "not-on-board"){
    $message.text(msg);
  }
  else{
    $message.text(msg);
    $playedWords.append($word);
  }
}

$form.on("submit", submitWord);


start();