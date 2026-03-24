module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).render('pages/error_page', {
            title: 'Não autorizado',
            status: 'Erro 401',
            message: 'Acesso negado / Não autorizado',
            notice: `Desculpe, você não tem permissão para acessar esta página. Por favor, verifique suas credenciais.`,
        });
    }
};

module.exports.isMember = (req, res, next) => {
    if (req.isAuthenticated() && req.user.membership_status) {
        next();
    } else {
        res.status(403).render('pages/error_page', {
            title: 'Proibido',
            status: 403,
            message: `Solicitação proibida – Você não tem permissão para acessar.`,
            notice: `Ocorreu um erro. Lamentamos, mas você não tem acesso a esta página.`,
        });
    }
};

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.admin) {
        next();
    } else {
        res.status(401).render('pages/error_page', {
            title: 'Não autorizado',
            status: 'Erro 401',
            message: 'Acesso negado / Não autorizado',
            notice: `Desculpe, você não tem permissão para acessar esta página. Por favor, verifique suas credenciais.`,
        });
    }
};
