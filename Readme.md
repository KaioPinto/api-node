# **Projeto de API Node.js com Express e MongoDB**

Este é um projeto de uma API Node.js que utiliza o framework Express para criar endpoints e o MongoDB como banco de dados. A API é projetada para lidar com informações relacionadas a usuários e funcionários, com suporte a autenticação de usuários.

## **Configuração do Projeto**

Para começar a usar este projeto, siga as etapas abaixo:

### **1. Clone o Repositório**

Clone o repositório para o seu ambiente de desenvolvimento:

```bash
bashCopy code
git clone <URL_do_repositório>
cd nome-do-seu-projeto

```

### **2. Instale as Dependências**

Instale as dependências do projeto executando o seguinte comando na raiz do projeto:

```bash
bashCopy code
npm install

```

### **3. Configure as Variáveis de Ambiente**

O projeto utiliza um arquivo **`.env`** para armazenar informações sensíveis, como credenciais do banco de dados e configurações de autenticação. Certifique-se de criar um arquivo **`.env`** na raiz do projeto e configurar as variáveis necessárias. Aqui está um exemplo de como o arquivo **`.env`** pode ser configurado:

```makefile
makefileCopy code
DB_USER=sua_usuario
DB_PASS=sua_senha
JWT_SECRET=sua_chave_secreta

```

Certifique-se de substituir **`sua_usuario`**, **`sua_senha`** e **`sua_chave_secreta`** pelas informações reais do seu projeto.

### **4. Inicie o Servidor**

Inicie o servidor Express executando o seguinte comando:

```bash
bashCopy code
npm start

```

O servidor Express será iniciado e estará ouvindo na porta definida (no exemplo, a porta 3000).

## **Estrutura do Projeto**

A estrutura do projeto é organizada da seguinte forma:

- **`app.js`**: Este é o ponto de entrada da aplicação Express, onde as configurações iniciais, middleware e rotas são definidas.
- **`routes`**: Esta pasta contém os arquivos de roteamento para as entidades do projeto, ou seja, **`userRoutes.js`** para rotas relacionadas a usuários e **`employeeRoutes.js`** para rotas relacionadas a funcionários.
- **`middlewares`**: Aqui você encontrará o middleware de autenticação utilizado para proteger rotas que exigem autenticação de usuário.
- **`models`**: Este diretório é destinado para definir os modelos de dados que serão usados com o MongoDB, como os modelos de usuário e funcionário.
- **`controllers`**: Os controladores são responsáveis por lidar com a lógica de negócios das rotas. Cada rota geralmente tem seu próprio controlador para manter o código organizado.

## **Funcionalidades Principais**

Este projeto oferece as seguintes funcionalidades principais:

- Registro de usuários.
- Autenticação de usuários usando JWT (JSON Web Tokens).
- Operações CRUD (Criar, Ler, Atualizar e Excluir) para funcionários.
- Proteção de rotas autenticadas usando o middleware de autenticação.

## **Observações**

- Certifique-se de ter o MongoDB instalado e em execução localmente ou forneça a URL de conexão correta no arquivo **`.env`** para se conectar a um banco de dados remoto.
- Este é um projeto de exemplo e não possui implementações completas para todas as funcionalidades de um aplicativo real. Você pode estender este projeto adicionando mais recursos, validações e melhorias de segurança conforme necessário para atender aos requisitos do seu projeto.

## **Estrutura do Projeto**

A estrutura do projeto é organizada da seguinte forma:

- **`app.js`**: Este é o ponto de entrada da aplicação Express, onde as configurações iniciais, middleware e rotas são definidas.
- **`routes`**: Esta pasta contém os arquivos de roteamento para as entidades do projeto, ou seja, **`userRoutes.js`** para rotas relacionadas a usuários e **`employeeRoutes.js`** para rotas relacionadas a funcionários.
- **`middlewares`**: Aqui você encontrará o middleware de autenticação utilizado para proteger rotas que exigem autenticação de usuário.
- **`models`**: Este diretório é destinado para definir os modelos de dados que serão usados com o MongoDB, como os modelos de usuário e funcionário.
- **`controllers`**: Os controladores são responsáveis por lidar com a lógica de negócios das rotas. Cada rota geralmente tem seu próprio controlador para manter o código organizado.

## **Funcionalidades Principais**

Este projeto oferece as seguintes funcionalidades principais:

- Registro de usuários.
- Autenticação de usuários usando JWT (JSON Web Tokens).
- Operações CRUD (Criar, Ler, Atualizar e Excluir) para funcionários.
- Proteção de rotas autenticadas usando o middleware de autenticação.

## **Observações**

- Certifique-se de ter o MongoDB instalado e em execução localmente ou forneça a URL de conexão correta no arquivo **`.env`** para se conectar a um banco de dados remoto.
- Este é um projeto de exemplo e não possui implementações completas para todas as funcionalidades de um aplicativo real. Você pode estender este projeto adicionando mais recursos, validações e melhorias de segurança conforme necessário para atender aos requisitos do seu projeto.
