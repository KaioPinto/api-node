try {
    const cpf = req.params.id;

    const arrayType = await Invoice.find({ 'client.cpf': cpf })
    
    const dWords = {}

    for (const item of arrayType) {
      dWords[item] = (dWords[item] || 0) + 1;
    }

    let hR = 0;
    let valueR

    for (const key in dWords) {
      if (hR == 0 || dWords[key] > hR) {
        valueR = key
        hR = dWords[key]

      }

    }
    if (!valueR || !arrayTipo.purchase) {
      return res.json({ message: 'Você não possui registro na loja, faça sua primeira e nas próximas terá descontos' });
    }
    
    const categoryProduct = await Product.find({ type: valueR }).select(['-__v', '-_id']);

    const aleatoryProduct = categoryProduct[Math.floor(Math.random() * categoryProduct.length)];
    if (aleatoryProduct) {

      aleatoryProduct.preco *= 0.9; //
    } else {
      return res.json({ message: 'Não foram encontrados produtos na categoria correspondente a sua primeira compra.' });
    }

    return res.json(aleatoryProduct);

  } catch (error) {
    console.error('Erro ao buscar o produto aleatório:', error);
    res.status(500).json({ error: 'Erro ao buscar produto aleatório.' });
  }
};