const jwt = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

// Middleware de autenticação
module.exports = (req, res, next) => {
  const routes = req.path;
  const allowedRoutes = [
    "/user/register",
    "/user/login",
    "/employee/login",
    "/employee/register"
  ];

  // Verifica se a rota solicitada está na lista de rotas permitidas
  if (allowedRoutes.includes(routes)) {
    return next(); // Se estiver, permite o acesso à rota
  }

  const authHeader = req.headers.authorization

  if (!authHeader) {

    return res.status(401).json({ message: "Token não informado" });

  }

  const parts = authHeader.split(" ");


  if (!parts.length === 2) {

    return res.status(401).json({ message: "Formato inválido" });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {

    return res.status(401).json({ message: "Seu token não corresponde." });
  }

  // Verifica se o token é válido usando a biblioteca jwt e a chave secreta
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token não é válido" });
      return res.status(401).json({ message: "Token não é válido" });
    }
    req.userId = decoded.id; // Se o token for válido, armazena o ID do usuário no objeto de solicitação (req)
    return next(); // Permite que a solicitação continue para a rota protegida
  });
};
