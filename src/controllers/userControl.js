// Importa os modelos User, Product e Invoice
const User = require('../models/User');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');
// Importa as bibliotecas jwt (JSON Web Token) e bcrypt para autenticação e criptografia
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();
const secret = process.env.SECRET;

// Função para gerar um token JWT
function geradorToken(params = {}) {
  return jwt.sign({ id: params }, secret, {
    expiresIn: 86400 // Token expira em 24 horas
  });
}

// Controladores para as rotas relacionadas aos usuários

// Cria um novo usuário
exports.createUser = async (req, res) => {
  const cpf = req.body.cpf;
  if (!cpf) {
    return res.status(400).json({ message: "Faltam dados" })
  }
  try {
    if (await User.findOne({ cpf })) {
      return res.status(400).json({ message: 'Usuário já existe!' });
    }

    const newUser = req.body;
    await User.create(req.body);
    newUser.pass = undefined; // Remove a senha do objeto de resposta
    return res
      .status(201)
      .json({ message: `Registro concluído, seu token é:${geradorToken({ id: cpf })}` });
  } catch (error) {
    return res.status(500).send({ error: 'Registro falhou' });
  }
};

// Efetua login de um usuário
exports.loginUser = async (req, res) => {
  const { cpf, pass } = req.body;
  if (!cpf) {
    return res.status(400).json({ message: "Cpf nulo, por favor digite algo válido" })
  }
  if (!pass) {
    return res.status(400).json({ message: "A senha está nula, por favor digite algo válido" })
  }
  const userQuery = await User.findOne({ cpf }).select('password');
  if (!userQuery) {
    return res.status(400).json({ message: 'Usuário não localizado' });
  }
  if (!(await bcrypt.compare(pass, userQuery.password))) {
    return res.status(400).json({ message: 'Senha inválida' });
  }

  res.json({
    message: `Login concluído, seu token de acesso: ${geradorToken({
      id: userQuery.cpf
    })}, lembre-se que tem validade de 1 dia`
  });
};

// Obtém um usuário por ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.body.cpf;
    if (!userId) {
      return res.status(406).json({ message: "Digite o cpf para que a consulta seja realizada!" })
    }
    const findUser = await User.findOne({ cpf: userId }).select(['-__v', '-_id']);

    if (!findUser) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(findUser);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o usuário.' });
  }
};

// Obtém todos os usuários
exports.getUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select(['-__v', '-_id']);
    if (!allUsers) {
      return res.status(404).json({ message: 'Usuários não encontrado.' });
    }
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o usuários.' });
  }
};

// Atualiza um usuário por ID
exports.updateUser = async (req, res) => {
  try {
    const cpf = req.body.cpf;
    const password = req.body.password;


    const userBd = await User.findOne({ cpf: cpf }).select(['password'])
    if (!userBd) {
      return res.status(404).json({ message: 'Usuário não localizado' });
    }
    const comparePassword = await bcrypt.compare(password, userBd.password)

    if (!comparePassword) {
      return res.secret(400).json({ message: 'Senha inválida' })
    }


    const dataUser = req.body.name
    await User.findOneAndUpdate({ cpf: cpf }, dataUser, { new: true });
    res.json({ message: `Usuário  ${req.body.name} atualizado ` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao atualizar o usuário.' });
  }
};

// Controladores para as operações relacionadas a promoções e compras

// Obtém uma promoção aleatória com base no histórico de compras do usuário
exports.getPromotion = async (req, res) => {
  try {
    const cpf = req.body.id;

    const arrayType = await Invoice.find({ 'client.cpf': cpf });

    const dWords = {};

    for (const item of arrayType) {
      dWords[item] = (dWords[item] || 0) + 1;
    }

    let hR = 0;
    let valueR;

    for (const key in dWords) {
      if (hR == 0 || dWords[key] > hR) {
        valueR = key;
        hR = dWords[key];
      }
    }
    if (!valueR || !arrayTipo.purchase) {
      return res.json({
        message: 'Você não possui registro na loja, faça sua primeira e nas próximas terá descontos'
      });
    }

    const categoryProduct = await Product.find({ type: valueR }).select(['-__v', '-_id']);

    const aleatoryProduct = categoryProduct[Math.floor(Math.random() * categoryProduct.length)];
    if (aleatoryProduct) {
      aleatoryProduct.preco *= 0.9; //
    } else {
      return res.json({
        message: 'Não foram encontrados produtos na categoria correspondente a sua primeira compra.'
      });
    }

    return res.json(aleatoryProduct);
  } catch (error) {
    console.error('Erro ao buscar o produto aleatório:', error);
    res.status(500).json({ error: 'Erro ao buscar produto aleatório.' });
  }
};

// Registra uma compra de produtos
exports.productBuy = async (req, res) => {
  try {
    const purchaseProduct = req.body;
    const clientName = purchases.cliente[0].name;

    await Invoice.create(purchaseProduct);

    return res.status(201).json({ message: `Compras de ${clientName} criada` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro na compra.' });
  }
};
