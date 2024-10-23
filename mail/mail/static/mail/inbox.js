document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  // Sending an Email
  document.querySelector('#compose-form').onsubmit= () => {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: `${document.querySelector('#compose-recipients').value}`,
        subject: `${document.querySelector('#compose-subject').value}`,
        body: `${document.querySelector('#compose-body').value}`
      })
    })
      .then(response => response.json())
      .then(result => {
        load_mailbox('sent');

      });
    return false;
  };
  
  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}
SelectedEmails = [];
function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#read-email-view').style.display = 'none';

 

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
 // When the sent mailbox is required
  if (mailbox =='sent'){
    fetch('/emails/sent')
    .then(response => response.json())
    .then(emails => {
      emails.forEach(email => {
        let element = document.createElement('div');
        const recipients=email.recipients;
        const subject = email.subject;
        const timestamp =email.timestamp;
        const id = email.id;
        element.innerHTML=`${timestamp}  <h3>${subject} <br> TO: ${recipients.map(recipient => recipient ).join(', ')}`;
        document.querySelector('#emails-view').append(element);
        element.addEventListener('click', () => load_mail(id));
      });
    })
  }

  if(mailbox=='inbox'){
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
      emails.sort((a,b) => b.id - a.id);
        //Show the emails
      emails.forEach(email => { 
        let element = document.createElement('div');
        const sender = email.sender;
        const subject = email.subject;
        const timestamp = email.timestamp;
        const id = email.id;
        element.innerHTML=`FROM : <strong>${sender}</strong>     ON : ${timestamp} <br><h3>${subject}</h3>`;
        document.querySelector('#emails-view').append(element);
        if(SelectedEmails.includes(id)){
          element.style.backgroundColor = 'grey';
        }
        document.querySelector('#emails-view').append(element);
        
        //Once Emails clicked
        element.addEventListener('click', () => {
          if (!SelectedEmails.includes(id)){
            SelectedEmails.push(id);
          }
          element.style.backgroundColor = 'grey';
          fetch(`/emails/${id}`, {
            method : 'PUT',
            body : JSON.stringify({
              read: true
            })
          })
          
          
          load_mail(id)
        });
        
          
        
      }); 
    });
  }
}

 // Loading an email
function load_mail(mail_id){
  // Show the email and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#read-email-view').style.display ='block';

  fetch(`/emails/${mail_id}`)
  .then(response => response.json())
  .then(email => {
    const sender = email.sender;
    const recipients = email.recipients;
    const subject  = email.subject;
    const timestamp = email.timestamp;
    const body = email.body;
    const description = document.createElement('div');
    const content = document.createElement('div');
    description.innerHTML = `
    <h2>${subject}</h2>
    <br><strong>TO : ${recipients.map(recipient => recipient).join(', ')}</strong>                 
    <br> FROM : ${sender}
    ON : ${timestamp}
    `;
    content.innerHTML = `<h4><p>${body}</p></h4>`;
    const ReadEmailView = document.querySelector('#read-email-view');
    ReadEmailView.innerHTML = '';
    ReadEmailView.append(description);
    ReadEmailView.append(content);
  })
}
 