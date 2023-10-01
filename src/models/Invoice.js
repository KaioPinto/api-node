// Importa o módulo mongoose para modelagem de dados
const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Obtém o construtor de esquema do mongoose

// Define o esquema do modelo Invoice (Nota Fiscal)
const invoiceSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true

  },
  products: [
    {
      identifier: { type: mongoose.Schema.Types.ObjectId, ref:"Products", required: true }, // Tipo de compra (obrigatório)
      amount: { type: Number, required: true }, // Quantidade comprada (obrigatória)
    },
  ],
  valueTotal: {
    type: Number,
    required: true
  }
});
// Exporta o modelo Invoice (Nota Fiscal) baseado no esquema definido
module.exports = mongoose.model("NotasFicais", invoiceSchema);
