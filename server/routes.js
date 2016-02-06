var controllers = require('./controllers');
var router = require('express').Router();

for (var route in controllers) {
  router.route("/" + route)
    .get(controllers[route].get)
    .post(controllers[route].post);
}

module.exports = router;


/*  

router.messages('/messages').get(controllers.messages.get).post(controllers.messages.post)
                            .get(function(req, res){})

var app = express();

app.get('/', function(req, res){
  
})




*/

