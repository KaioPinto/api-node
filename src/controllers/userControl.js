// Importa os modelos User, Product e Invoice
const User = require("../models/User");
const Product = require("../models/Product");
const Invoice = require("../models/Invoice");
const Carrinho = require("../models/Trolley")

//Importa os middlewares de erro
require("express-async-errors");
const { BadRequest, InternalServerError, NotAcceptable, NotFound } = require("../helpers/apiError")
// Importa as bibliotecas jwt (JSON Web Token) e bcrypt para autenticação e criptografia
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// Carrega as variáveis de ambiente do arquivo .env
require("dotenv").config();
const secret = process.env.SECRET;

// Função para gerar um token JWT
function geradorToken(params) {
  return jwt.sign({ id: params }, secret, {
    expiresIn: 86400, // Token expira em 24 horas
  });
}

// Controladores para as rotas relacionadas aos usuários

// Cria um novo usuário
exports.createUser = async (req, res) => {

  //erro é aqui
  // throw new BadRequest('Mensagem')

  const cpf = req.body.cpf;
  if (!cpf) {
    return res.status(400).json({ message: "Faltam dados" });
  }
  try {
    if (await User.findOne({ cpf })) {
      return res.status(400).json({ message: "Usuário já existe!" });
    }
    await User.create(req.body);
    const usuario = await User.findOne({ cpf: cpf })
    const num = usuario._id.toHexString()


    return res.status(201).json({ message: `Registro concluído, seu token é:${geradorToken({ id: num })}`, });
  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: "Registro falhou" });
  }
};

// Efetua login de um usuário
exports.loginUser = async (req, res) => {
  const { cpf, pass } = req.body;

  if (!cpf) {
    return res
      .status(400)
      .json({ message: "Cpf nulo, por favor digite algo válido" });
  }
  if (!pass) {
    return res
      .status(400)
      .json({ message: "A senha está nula, por favor digite algo válido" });
  }
  const userQuery = await User.findOne({ cpf }).select("password");
  if (!userQuery) {
    return res.status(400).json({ message: "Usuário não localizado" });
  }
  if (!(await bcrypt.compare(pass, userQuery.password))) {
    return res.status(400).json({ message: "Senha inválida" });
  }

  const id = userQuery._id.toHexString()


  return res.status(201).json({ message: `login concluído, seu token é:${geradorToken({ id: id })}`, })
}

// Obtém um usuário por ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.body.cpf;
    if (!userId) {
      return res
        .status(406)
        .json({ message: "Digite o cpf para que a consulta seja realizada!" });
    }
    const findUser = await User.findOne({ cpf: userId }).select([
      "-__v", "-password",
    ]);

    if (!findUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.json(findUser);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o usuário." });
  }
};

// Obtém todos os usuários
exports.getUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select(["-__v", "-_id", "-password"]);
    if (!allUsers) {
      return res.status(404).json({ message: "Usuários não encontrado." });
    }
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o usuários." });
  }
};

// Atualiza um usuário por ID
exports.updateUser = async (req, res) => {
  try {
    const { cpf, password } = req.body;

    const userBd = await User.findOne({ cpf: cpf }).select(["password"]);
    if (!userBd) {
      return res.status(404).json({ message: "Usuário não localizado" });
    }
    const comparePassword = await bcrypt.compare(password, userBd.password);

    if (!comparePassword) {
      return res.secret(400).json({ message: "Senha inválida" });
    }

    const dataUser = req.body.name;
    await User.findOneAndUpdate({ cpf: cpf }, dataUser, { new: true });
    res.json({ message: `Usuário  ${req.body.name} atualizado ` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro ao atualizar o usuário." });
  }
};

// Controladores para as operações relacionadas a promoções e compras

// Obtém uma promoção aleatória com base no histórico de compras do usuário
exports.getPromotion = async (req, res) => {

  //focar em casa 
  try {
    const id = req.userId.id


    const arrayType = await Invoice.find({ "user": id });

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
        message:
          "Você não possui registro na loja, faça sua primeira e nas próximas terá descontos",
      });
    }

    const categoryProduct = await Product.find({ type: valueR }).select([
      "-__v",
      "-_id",
    ]);

    const aleatoryProduct =
      categoryProduct[Math.floor(Math.random() * categoryProduct.length)];
    if (aleatoryProduct) {
      aleatoryProduct.preco *= 0.9; //
    } else {
      return res.json({
        message:
          "Não foram encontrados produtos na categoria correspondente a sua primeira compra.",
      });
    }

    return res.json(aleatoryProduct);
  } catch (error) {
    console.error("Erro ao buscar o produto aleatório:", error);
    res.status(500).json({ error: "Erro ao buscar produto aleatório." });
  }
};

// Registra uma compra de produtos
exports.productBuy = async (req, res) => {

  try {

    const findTrolley = await Carrinho.findOne({ user: req.userId.id }).populate("products.identifier")


    if (!findTrolley || findTrolley.products.length <= 0) {
      return res.status(500).json({ message: "Erro na compra, pois seu carrinho está vázio" });
    }
    let total = 0;
    findTrolley.products.forEach((x) => {
      const productValue = Number(x.identifier.value);
      const productTotal = x.amount * productValue;
      total += productTotal;


    }
    )

    await Invoice.create({ user: req.userId.id, products: findTrolley.products, valueTotal: total.toFixed(2) });
    findTrolley.products = []
    findTrolley.save()



    return res.status(201).json({ message: `Compra criada` });
  } catch (error) {
    res.status(500).json({ error: "Erro na compra." });
  }
};

exports.addTrolley = async (req, res) => {
  try {

    if (!req.params.id) {
      return res.status(500).json({ message: "Faltam dados referente ao produto, para que seja realizado a busca" })

    } if (!req.body.amount) {
      return res.status(500).json({ message: "É necessário preencher o campo quantidade" })

    }

    const validationItem = await Product.findById(req.params.id)
    if (!validationItem) {
      return res.status(404).json({ message: "Produto nao encontrado" });

    }

    const findTrolley = await Carrinho.findOne({ user: req.userId.id });

    if (!findTrolley) {
      const newTrolley = await Carrinho.create({ user: req.userId.id });
      newTrolley.products.push({ identifier: req.params.id, amount: req.body.amount });
      await newTrolley.save();
      return res.status(201).json({ message: "Produto adicionado!" });
    }

    const productToUpdate = findTrolley.products.find(
      (x) => req.params.id === x.identifier.toHexString()
    );

    if (productToUpdate) {
      productToUpdate.amount += req.body.amount;
    } else {
      findTrolley.products.push({ identifier: req.params.id, amount: req.body.amount });
    }

    await findTrolley.save();
    return res.status(201).json({ message: "Produto adicionado!" });
  } catch (err) {
    return res.status(500).json({ message: "Erro ao adicionar produto" });
  }
};

exports.removeProduct = async (req, res) => {

  try {
    const productId = req.body.id
    const idCart = req.userId.id
    if (!idCart) {
      return res.status(500).json({ message: "Forneça o id do produto, para ser removido" })

    }
    const findTrolley = await Carrinho.findOne({ user: req.userId.id }).populate("products.identifier")
    if (!findTrolley || findTrolley.products.length <= 0) {
      return res.status(500).json({ message: "Não foi encontrado compras em seu nome" })
    }
    const productToUpdate = findTrolley.products.find( (x) => productId === x.identifier._id.toHexString()
    );
    if(!productToUpdate){
      return res.status(500).json({ message: "Produto não localizado!" })

    }
    if (productToUpdate.amount > 1) {
      productToUpdate.amount -= 1;
    } else {
      findTrolley.products.pull({ identifier: req.body.id });

    }
    await findTrolley.save()
    return res.status(201).json({ message: "Item removido com sucesso!" })

  }

  catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Aconteceu algum erro na remoção" })


  }

}