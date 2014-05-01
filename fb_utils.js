// facebook utility functions

// gets an array of all friends' facebook ids
// user:      guy to look up
// https:     shttp object from require
// callback:  called with list when request is done
function getFriendIDs(user, https, callback) {
  var options = {
    host: 'graph.facebook.com',
    port: 443,
    path: '/me/friends?&access_token=' + user.access_token
  };

  https.get(options, function(response) {
    if (response.statusCode != 200) {
      console.error("https status code " + response.statusCode);
    }
    var result = '';
    response.on('data', function(data) {
      result += data;
    });
    response.on('end', function() {
      var friends = JSON.parse(result.toString()).data;
      var ids = new Array();
      for (var i = 0; i < friends.length; i += 1) {
        ids.push(friends[i].id);
      }
      callback(ids);
    });
  }).on('error', function(e) {
    console.error(e);
  });
}

// mails to user purchase confirm based on buyin info from cookie, then calls
//   callback with nothing?
function mailConfirmation(user, info, form, mail, callback) {
  var msg = "Dear " + form.firstName + " " + form.lastName + "\n\n";
  msg += "Thank you for your purchase of " + form.shares + " shares on Pool Play.\n";
  msg += "You've been charged $" + info.price + ".00 for this purchase.\n";
  msg += "If you have any questions, don't hesitate to contact us!\n\n";
  msg += "Thanks,\n";
  msg += "  The Pool Play team";
  console.log("mailto: " + form.email);
  var mailInfo = {
    from: "Pool Play <gtechpoolplay@gmail.com>",
    to: form.email,
    subject: "Confirmation of your Pool Play purchase",
    text: msg
  };
  
  var smtpTransport = mail.createTransport("SMTP", {
    service: "Gmail",
    auth: {
      user: "gtechpoolplay@gmail.com",
      pass: "165198795"
    }
  });
  smtpTransport.sendMail(mailInfo, function(error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: " + response.message);
    }
    callback();
  });
}

exports.mailConfirmation = mailConfirmation;
exports.getFriendIDs = getFriendIDs;