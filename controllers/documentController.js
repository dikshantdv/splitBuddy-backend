// const Document = require("../models/documentModel");
// exports.getDocument = async (documentData) => {
//   if (documentData.id === null) return;

//   const document = await Document.findById(documentData.id);

//   if (document) return document;

//   return await Document.create({
//     _id: documentData.id,
//     data: "",
//     owner: documentData.owner,
//     name: `Untitled-document-${Date.now()}`,
//   });
// };

// exports.updateDocument = async (id, data) => {
//   if (id.body) {
//     if (id.body.contributer) {
//       return await Document.findByIdAndUpdate(id.body.id, {
//         $push: { contributers: id.body.contributer },
//       });
//     }
//     return await Document.findByIdAndUpdate(id.body.id, { name: id.body.name });
//   }
//   return await Document.findByIdAndUpdate(id, { data });
// };
