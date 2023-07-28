const express = require("express");
const app = express();

app.use(express.static("videos")); // Diretório onde seus vídeos estão armazenados

// app.get('/video', (req, res) => {
//   const videoUrl = 'apresentacao.mp4'; // Substitua pelo URL do vídeo em seu banco de dados
//   const videoPath = `videos/${videoUrl}`; // Path para o diretório onde os vídeos estão armazenados

//   res.setHeader('Content-Type', 'video/mp4');
//   res.setHeader('Content-Disposition', `inline; filename="${videoUrl}"`);

//   const fs = require('fs');
//   const videoStream = fs.createReadStream(videoPath);
//   videoStream.pipe(res);
// });
app.get("/video", (req, res) => {
  const videoUrl = "jogada_mvp.mp4";
  const videoPath = `videos/${videoUrl}`;

  const fs = require('fs'); // Módulo para manipular arquivos
  const stat = fs.statSync(videoPath); // Tamanho do vídeo
  const fileSize = stat.size; // Tamanho do vídeo em bytes
  const range = req.headers.range; // Range de bytes do vídeo que o navegador quer

  if (range) { // Se o navegador pediu um range de bytes do vídeo
    const parts = range.replace(/bytes=/, "").split("-"); // Separa o range em duas partes
    const start = parseInt(parts[0], 10); // Início do range
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1; // Fim do range
    const chunksize = end - start + 1; // Tamanho do range
    const file = fs.createReadStream(videoPath, { start, end }); // Cria um stream do vídeo com o range solicitado
    const head = { // Cabeçalho da resposta
      "Content-Range": `bytes ${start}-${end}/${fileSize}`, // Informa o range do vídeo no cabeçalho Content-Range
      "Accept-Ranges": "bytes", // Informa que aceita ranges no cabeçalho Accept-Ranges
      "Content-Length": chunksize, // Informa o tamanho do range no cabeçalho Content-Length
      "Content-Type": "video/mp4", // Informa o tipo do conteúdo no cabeçalho Content-Type
    };

    res.writeHead(206, head); // Envia o cabeçalho 206 Partial Content
    file.pipe(res); //  Envia o vídeo
  } else { // Se o navegador não pediu um range de bytes do vídeo
    const head = { // Cabeçalho da resposta
      "Content-Length": fileSize, // Informa o tamanho do vídeo no cabeçalho Content-Length
      "Content-Type": "video/mp4", // Informa o tipo do conteúdo no cabeçalho Content-Type
    };
    res.writeHead(200, head); // Envia o cabeçalho 200 OK
    fs.createReadStream(videoPath).pipe(res); // Envia o vídeo
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
