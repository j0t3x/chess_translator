import {
  algebraic_chessboard,
  descriptive_chessboard,
  pretty_print,
  pretty_print_pieces,
  representational_board,
  starting_pieces_states
} from './texchess.js'
document.getElementById("descriptive").value = ""
document.getElementById("curated").value = ""
const replace_linebreaks = /(\r\n|\r|\n)/g;
const get_moves = /\d{1,2}\s?(?:\w{1,3}[-xX]{1}\w{1,3}[+?!()=]{0,2}|[oO0-]{3,5})\s?(?:\w{1,3}[-xX]{1}\w{1,3}[+?!()=]{0,2}|[o0O-]{3,5})/gm;

const recognize = async ({ target: { files } }) => {
  document.getElementById("descriptive").value = ""
  document.getElementById("imgInput").src = URL.createObjectURL(files[0]);
  const worker = await Tesseract.createWorker("eng");
  const ret = await worker.recognize(files[0]);
  // if (ret.data.text)
  //   document.getElementById("descriptive").value = ret.data.text
  await worker.terminate();

  recognize_vision()
}

const recognize_vision = async () => {

  const img = document.getElementById("imgInput");
  const canvasElmt = document.getElementById("canvasElement");
  const ctx = canvasElmt.getContext("2d");
  ctx.drawImage(img, 0, 0, 500, 500 * img.height / img.width);

  const response = await fetch('https://vision.googleapis.com/v1/images:annotate', {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      "x-goog-user-project": process.env.PROJECT_ID,
      "Authorization": `Bearer ${process.env.TOKEN}`
    },
    body: JSON.stringify({
      "requests": [
        {
          "image": {
            "content": canvasElmt.toDataURL().replace('data:image/png;base64,', '')

          },
          "features": [
            {
              "maxResults": 50,
              "model": "builtin/latest",
              "type": "DOCUMENT_TEXT_DETECTION"
            }
          ]
        }
      ]
    }) // body data type must match "Content-Type" header
  });
  const res = await response.json()
  let text = (res.responses.length > 0) ? res.responses[0].fullTextAnnotation.text : undefined
  if (text) {
    text = text.replaceAll(replace_linebreaks, '')
    document.getElementById("descriptive").value = text
  }
}

const update_curated = (event) => {
  const text = event.target.value
  const matches = text.matchAll(get_moves)
  let res = ''
  for (const match of matches) {
    res += `${match[0]}\n`
  }
  document.getElementById('curated').value = res
}

const start = () => {
  const elm = document.getElementById('uploader');
  elm.addEventListener('change', recognize);

  const descriptive_textarea = document.getElementById('descriptive');
  descriptive_textarea.addEventListener('change', update_curated);

  const board = Chessboard2('board1', 'start')
  // console.log(board.position())
}

console.log(pretty_print(algebraic_chessboard))
console.log(pretty_print(descriptive_chessboard))
console.log(pretty_print_pieces(representational_board))
console.log(starting_pieces_states)

start()
