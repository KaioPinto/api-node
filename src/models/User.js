// Importa o módulo mongoose para modelagem de dados
const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Obtém o construtor de esquema do mongoose
const bcrypt = require('bcrypt'); // Importa a biblioteca bcrypt para hash de senhas

// Define o esquema do modelo User (Usuário)
const userSchema = new Schema({
  name: { type: String, required: true }, // Nome do usuário (obrigatório)
  cpf: { type: String, required: true, unique: true }, // CPF do usuário (obrigatório e único)
  password: { type: String, required: true, select: false }, // Senha do usuário (obrigatória, mas não será selecionada por padrão)
  createdAt: {
    type: Date,
    default: Date.now // Data de criação do usuário (padrão: data atual)
  }
});

// Pré-processamento antes de salvar no banco de dados
userSchema.pre('save', async function (next) {
  // Gera um hash seguro da senha do usuário usando o bcrypt com fator de custo 10
  const hash = await bcrypt.hash(this.password, 10);

  // Substitui a senha original pelo hash gerado
  this.password = hash;

  next(); // Chama a função next() para continuar o processo de salvamento
});

// Exporta o modelo User (Usuário) baseado no esquema definido
module.exports = mongoose.model('Users', userSchema);
