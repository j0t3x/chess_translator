const recognize = async ({ target: { files } }) => {
  document.getElementById("imgInput").src = URL.createObjectURL(files[0]);
  const worker = await Tesseract.createWorker("eng");
  const ret = await worker.recognize(files[0]);
  console.log(ret.data.text);
  await worker.terminate();

}
const elm = document.getElementById('uploader');
elm.addEventListener('change', recognize);

const board = Chessboard2('board1', 'start')
console.log(board.position())
