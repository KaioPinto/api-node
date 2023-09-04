// Importa os modelos Employee, User e Product
const Employee = require('../models/Employee');
const User = require('../models/User');
const Product = require('../models/Product');
// Importa as bibliotecas jwt (JSON Web Token) e bcrypt para autenticação e criptografia
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();
const secret = process.env.SECRET;

// Função para gerar um token JWT
function tokenGenerator(params = {}) {
  return jwt.sign({ id: params }, secret, {
    expiresIn: 86400 // Token expira em 24 horas
  });
}

// Controladores para as rotas relacionadas aos funcionários

// Cria um novo funcionário
exports.createEmployee = async (req, res) => {

  const newEmployee = req.body;

  if (!newEmployee) {
    res.status(400).json({ message: "Digite os dados solicitados!" })
  }
  const register = req.body.register;
  try {
    if (await Employee.findOne({ "register": register })) {
      return res.status(400).json({ message: 'Usuário já existe!' });
    }
    newEmployee.password = undefined; // Remove a senha do objeto de resposta
    return res
      .status(201)
      .json({ message: `Registro concluído, seu token é: ${tokenGenerator({ id: register })}` });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ error: 'O registro falhou' });
  }
  ;

}


// Efetua login de um funcionário
exports.loginEmployee = async (req, res) => {

  try {
    const { register, password } = req.body;
    if (!register) {
      return res.status(406).json({ message: "Digite uma matrícula" })
    }
    if (!password) {
      return res.status(406).json({ message: "Digite uma senha" })
    }

    const checkEmployee = await Employee.findOne({ register }).select('password');
    if (!checkEmployee) {
      return res.status(404).json({ message: 'Usuário não localizado' });
    }
    if (!(await bcrypt.compare(password, checkEmployee.password))) {
      return res.status(400).json({ message: 'Senha inválida' });
    }

    res.json({
      message: `Login concluído, seu token de acesso: ${tokenGenerator({
        id: checkEmployee.cpf
      })}, lembre-se que tem validade de 1 dia`
    });
  } catch (error) { 
    res.status(500).json({ error: 'Erro ao efetuar login do funcionário.' });
  }
};

// Obtém um funcionário por ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employeeId = req.body.id;

    const findEmployeeById = await Employee.findOne({ register: employeeId }).select(['-__v', '-_id']);
    if (!findEmployeeById) {
      return res.status(404).json({ message: 'Funcionário não encontrado.' });
    }
    res.json(findEmployeeById);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o funcionário.' });
  }
};

// Obtém todos os funcionários
exports.getEmployee = async (req, res) => {
  console.log('entrei foi em funcionários');
  try {
    const findEmployee = await Employee.find().select(['-__v', '-_id']);
    if (!findEmployee) {
      return res.status(404).json({ message: 'Funcionário não encontrado.' });
    }
    res.json(findEmployee);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o funcionário.' });
  }
};

// Atualiza um funcionário por ID
exports.updateEmployee = async (req, res) => {
  //aqui é para futuramente quando o funcionário tiver cargos, ai será bloqueado e apenas gerentes conseguirão alterar
  try {
    const employeeId = req.params.id;
    const filter = { register: employeeId };
    const dateEmployee = req.body;
    const updateEmployee = await Employee.findOneAndUpdate(filter, dateEmployee, {
      new: true
    });
    if (!updateEmployee) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json({ message: `Funcionário ${req.body.name} atualizado.` });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o funcionário.' });
  }
};

// Remove um funcionário por ID
exports.deleteEmployee = async (req, res) => {
   //aqui é para futuramente quando o funcionário tiver cargos, ai será bloqueado e apenas gerentes conseguirão excluir
  try {
    const employeeId = req.body.id;
    const filter = { register: employeeId };
    const deleteEmployee = await Employee.findOneAndRemove(filter);
    if (!deleteEmployee) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json({ message: 'Usuário removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover o funcionário.' });
  }
};

// Funções adicionais de funcionários para operar em outras classes (usuários e produtos)

// Remove um usuário por ID (para uso por funcionários)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.body.cpf;
    const delUser = await User.findOneAndRemove({ cpf: userId });
    if (!delUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json({ message: 'Usuário removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover o usuário.' });
  }
};

// Obtém todos os usuários (para uso por funcionários)
exports.getUsers = async (req, res) => {
  try {
    const listUsers = await User.find().select(['-__v', '-_id']);
    if (!listUsers) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(listUsers);
  } catch (error) {
    console.log('Erro do banco', error);
    res.status(500).json({ error: 'Erro ao buscar o usuário.' });
  }
};

// Obtém um usuário por ID (para uso por funcionários)
exports.getUserID = async (req, res) => {
  try {
    const userID = req.body.cpf;
    if (!userID) {
      return res.status(406).json({ message: " Digite o cpf para que a busca ocorra!" })
    }
    const newEmployee = await User.findOne({ cpf: userID }).select(['-__v', '-_id']);
    if (!newEmployee) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o usuário.' });
  }
};

// Cria um novo produto
exports.createProduct = async (req, res) => {
  try {
    const productDate = req.body;
    const newProduct = await Product.create(productDate);
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao criar um novo produto.' });
  }
};

// Obtém todos os produtos
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().select(['-__v']);
    if (!products) {
      return res.status(404).json({ message: 'Produtos não encontrados.' });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os produtos.' });
  }
};

// Obtém um produto por ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).select(['-__v']);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o produto pelo ID.' });
  }
};

// Atualiza um produto por ID
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const productDate = req.body;
    const updateProduct = await Product.findByIdAndUpdate(productId, productDate, { new: true });
    if (!updateProduct) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    res.json({ message: `O produto ${updateProduct.name}, foi alterado.` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao atualizar o produto.' });
  }
};

// Remove um produto por ID
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deleteProduct = await Product.findByIdAndRemove(productId);
    if (!deleteProduct) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }
    res.json({ message: `Produto ${deleteProduct.name} removido com sucesso.` });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover o produto.' });
  }
};
