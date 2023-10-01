// Importa o módulo mongoose para modelagem de dados
const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Obtém o construtor de esquema do mongoose
const bcrypt = require("bcrypt"); // Importa a biblioteca bcrypt para hash de senhas

// Define o esquema do modelo Employee
const employeeSchema = new Schema({
  name: { type: String, required: true }, // Nome do funcionário (obrigatório)
  register: { type: Number, required: true, unique: true }, // Registro único do funcionário (obrigatório e único)
  password: { type: String, required: true }, // Senha do funcionário (obrigatória)
 // type: { type: String, required: true }, // Tipo de funcionário (obrigatório)
});

// Pré-processamento antes de salvar no banco de dados
employeeSchema.pre("save", async function (next) {
  // Gera um hash seguro da senha do funcionário usando o bcrypt com fator de custo 10
  const hash = await bcrypt.hash(this.password, 10);

  // Substitui a senha original pelo hash gerado
  this.password = hash;

  next(); // Chama a função next() para continuar o processo de salvamento
});

// Exporta o modelo Employee baseado no esquema definido
module.exports = mongoose.model("Employee", employeeSchema);
