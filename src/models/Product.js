// Importa o módulo mongoose para modelagem de dados
const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Obtém o construtor de esquema do mongoose

// Define o esquema do modelo Invoice (Nota Fiscal)

const invoiceSchema = new Schema({
  cod: {type: Number, requiered: true, unique: true },
  type: { type: String, required: true }, // Tipo de compra (obrigatório)
  item: { type: String, required: true }, // Item comprado (obrigatório)
  amount: { type: Number, required: true }, // Quantidade comprada (obrigatória)
  value: { type: Number, required: true }, // Valor da compra (obrigatório)


});



// Exporta o modelo Invoice (Nota Fiscal) baseado no esquema definido
module.exports = mongoose.model("Products", invoiceSchema);
