const dotenv = require("dotenv");
const { Connection } = require("./utils/db");
const app = require("./index");
// const io = require("./socket");
// const documentController = require("./controllers/documentController");

dotenv.config();

Connection();

// io.on("connection", (socket) => {
//   socket.on("get-document", async (documentData) => {
//     const document = await documentController.getDocument(documentData);
//     socket.join(documentData.id);
//     socket.emit("load-document", document);

//     socket.on("send-changes", (delta) => {
//       socket.broadcast.to(documentData.id).emit("receive-changes", delta);
//     });

//     socket.on("save-document", async (data) => {
//       await documentController.updateDocument(documentData.id, data);
//     });
//   });
// });

//Server port setup
const BACKEND_PORT = process.env.PORT || 8000;

app.listen(BACKEND_PORT, () => {
  console.log(`server started on port ${BACKEND_PORT}`);
});
