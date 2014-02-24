var path = require('path');

path.resolve(__dirname, '../apps/demo-site/templates/content.ejs'),

module.exports = {

    'home': {
        title: 'Home page tempate',
        model: 'Page',
        template: path.resolve(__dirname, '../apps/demo-site/templates/home.ejs'),
        slots: [
            {name:'content', label: 'Content'}
        ]
    },
    
    'content': {
        title: 'Content page tempate',
        model: 'Page',
        template: path.resolve(__dirname, '../apps/demo-site/templates/content.ejs'),
        slots: [
            {name:'content', label: 'Content'},
            {name:'sidebar', label: 'Sidebar'}
        ]
    }
};