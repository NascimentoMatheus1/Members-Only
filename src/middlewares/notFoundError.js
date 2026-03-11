module.exports.getNotFoundPage = (req, res) => {
    res.render('pages/error_page.ejs', {
        title: 'Página não encontrada',
        status: 'Erro 404',
        message: 'Página não encontrada',
        notice: "Desculpe, mas o conteúdo que você busca não existe ou foi movido.",
    });
};
