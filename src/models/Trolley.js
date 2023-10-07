// Importa o módulo mongoose para modelagem de dados
const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Obtém o construtor de esquema do mongoose

// Define o esquema do modelo Trole (Carrinho)
const TrolleySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true

  },
  products: [
    {
      identifier: { type: mongoose.Schema.Types.ObjectId, ref:"Products" }, // Tipo de compra (obrigatório)
      amount: { type: Number}, // Quantidade comprada (obrigatória)
    }]
  
})
// Exporta o modelo Trole (Trole) baseado no esquema definido
module.exports = mongoose.model("Carrinho", TrolleySchema);
