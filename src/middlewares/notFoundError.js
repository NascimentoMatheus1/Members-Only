module.exports.getNotFoundPage = (req, res) => {
    res.render('pages/error_page.ejs', {
        title: 'Not Found',
        status: '404 Error',
        message: 'Not Found',
        notice: "The page you're looking for can't be found",
    });
};
