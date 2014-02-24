var path = require('path')

module.exports = {
    'article': {
        title: 'Article',
        model: 'Content',
        template: path.resolve(__dirname, '../apps/demo-site/templates/article.ejs'),
        fields: [
            { name: "headline", label: 'Headline', type: 'text' },
            { name: "body", label: 'Body', type: 'html' }
        ]
    }
};