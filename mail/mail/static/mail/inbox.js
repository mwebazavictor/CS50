document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  
  
  // By default, load the inbox
  load_mailbox('inbox');

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
});

let CurrentView = "";

function compose_email(reply,recipients = '',subject = '',body = '',timestamp) {
  CurrentView = 'compose';
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#read-email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  
  if(reply === true && !subject.startsWith('RE: ')){
    subject = `RE: ${subject}`;
    body = `On ${timestamp} ${recipients} wrote: ${body}`;
  }else if(reply === true){
    body = `On ${timestamp} ${recipients} wrote: ${body}`;
  }

    // Clear out composition fields
  document.querySelector('#compose-recipients').value = recipients;
  document.querySelector('#compose-subject').value = subject;
  document.querySelector('#compose-body').value = body;
  
  


}

let SelectedEmails = [];
let EligibleForArchive = [];


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#read-email-view').style.display = 'none';

 

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  document.querySelector('#read-email-view').innerHTML='';
 // When the sent mailbox is required
  if (mailbox =='sent'){
    CurrentView = "sent";
    fetch('/emails/sent')
    .then(response => response.json())
    .then(emails => {
      emails.forEach(email => {
        let element = document.createElement('div');
        const recipients=email.recipients;
        const subject = email.subject;
        const timestamp =email.timestamp;
        const id = email.id;
        
        element.innerHTML=`<div><strong>${recipients.map(recipient => recipient ).join(', ')}</strong>&nbsp;&nbsp;${subject}</div>   <span class="timestamp"> ${timestamp}</span> `;


        element.style.display = 'flex';
        element.style.justifyContent = 'space-between';
        element.style.alignItems = 'center';
        element.style.borderStyle = 'solid';
        element.style.borderWidth = '1px';
        const PaddingStyling = ['paddingLeft', 'paddingBottom','paddingTop', 'paddingRight'];
        const Component = ['5px','8px','8px','5px'];
        PaddingStyling.forEach((paddingStyle, index) => {
          element.style[paddingStyle] = Component[index];
        })
        

        const TimestampSpan = element.querySelector('.timestamp');
        TimestampSpan.style.color ='grey';
        document.querySelector('#emails-view').append(element);
        element.addEventListener('click', () => load_mail(id, mailbox));
      });
    })
  } 
  else {
    CurrentView = "Other Mailboxes"
    fetch(`/emails/${mailbox}`)
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
        // Add email to eligible for archive
        if(!EligibleForArchive.includes(id)){
          EligibleForArchive.push(id);
        }
        
        
        //List Emails
        element.style.display = 'flex';
        element.style.justifyContent = 'space-between';
        element.style.alignItems = 'center';
        element.style.borderStyle = 'solid';
        element.style.borderWidth = '1px';
        const PaddingStyling = ['paddingLeft', 'paddingBottom','paddingTop', 'paddingRight'];
        const Component = ['5px','8px','8px','5px'];
        PaddingStyling.forEach((paddingStyle, index) => {
          element.style[paddingStyle] = Component[index];
        })
        element.innerHTML=`<div><strong>&nbsp;${sender}</strong>&nbsp;&nbsp;${subject}</div>   <span class="timestamp"> ${timestamp}</span> `;
        const TimestampSpan = element.querySelector('.timestamp');
        if(SelectedEmails.includes(id) || mailbox == 'archive'){
          element.style.backgroundColor = 'grey';
          TimestampSpan.style.color = '#ffffff';
        }
        else {
          TimestampSpan.style.color ='grey';
          }
        document.querySelector('#emails-view').append(element);

        //Once Emails clicked
        
          element.addEventListener('click', () => {
            if (['inbox','archive'].includes(mailbox)){
              if (!SelectedEmails.includes(id)){
                SelectedEmails.push(id);
              }
              fetch(`/emails/${id}`, {
                method : 'PUT',
                body : JSON.stringify({
                  read: true
                })
              })
            }
          load_mail(id, mailbox)
        });
      }); 
    });
  }

  
}

 // Loading an email
function load_mail(mail_id, mailbox){
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
    const ReadEmailView = document.querySelector('#read-email-view');
    const ReplyButton = document.createElement('button');
    const ButtonDiv = document.createElement('div');
    
    description.innerHTML = `
    <strong>From:</strong> ${sender}
    <br><strong>To:</strong> ${recipients.map(recipient => recipient).join(', ')}
    <br><strong>Subject: </strong>${subject}
    <br><strong>Timestamp: </strong> ${timestamp}
    `;
    content.innerHTML = `<p>${body}</p>`;
    
    
     
    
    // Archive Button
    if(mailbox !=='sent'){
      if(EligibleForArchive.includes(mail_id)){
      const ArchiveButton = document.createElement('button');
      ArchiveButton.className = 'btn btn-sm btn-outline-primary';
      ArchiveButton.innerHTML = email.archived ? "Unarchive" : "Archive";
      
      ArchiveButton.addEventListener('click', () => {
        fetch(`emails/${mail_id}`, {
          method: 'PUT',
          body: JSON.stringify({
            archived: !email.archived
          })
        })
        .then(() => load_mailbox('inbox')); 
      });
      ButtonDiv.appendChild(ArchiveButton);
    }
    }
    // Reply button
    ReplyButton.className = 'btn btn-sm btn-outline-primary';
    ReplyButton.innerHTML = 'Reply';
    ReplyButton.addEventListener('click', () => compose_email(true,sender,subject,body,timestamp));
    ButtonDiv.appendChild(ReplyButton);
    
    
   
    description.appendChild(ButtonDiv);
    description.append(document.createElement('hr'));
    ReadEmailView.innerHTML = '';
    ReadEmailView.appendChild(description);
    ReadEmailView.appendChild(content);
  });
  
}
 