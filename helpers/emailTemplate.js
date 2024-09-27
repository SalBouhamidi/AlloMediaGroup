const mailGen = require('mailgen');

function emailTemplate(url){
    let mailGenerator = new mailGen({
        theme: 'cerberus',
        product:{
            name: 'AlloMediaGroup',
            link: 'http:://localhost:3000'
        }
    });
    let email = {
        body: {
            name: 'Verify Your email please',
            intro: 'Welcome to AlloMedia We\'re very excited to have you on board.',
            action: {
                instructions: 'To verify your account, please click here:',
                button: {
                    color: '#f564e5',
                    text: 'Confirm your account',
                    link: `${url}`,
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }
    let emailBody = mailGenerator.generate(email);
    require('fs').writeFileSync('preview.html', emailBody, 'utf8');
    return emailBody;
}

module.exports = emailTemplate;


