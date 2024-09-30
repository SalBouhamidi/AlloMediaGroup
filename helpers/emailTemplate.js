const mailGen = require('mailgen');

function emailTemplate(url,name, intro,instructions,buttonText){
    let mailGenerator = new mailGen({
        theme: 'cerberus',
        product:{
            name: 'AlloMediaGroup',
            link: 'http:://localhost:3000'
        }
    });
    let email = {
        body: {
            name: name,
            intro: intro,
            action: {
                instructions: instructions,
                button: {
                    color: '#f564e5',
                    text: buttonText,
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


