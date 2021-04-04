const express = require('express');
const cors = require('express');
const path = require('path');
const router = express.Router();


const indexHTML = path.join(__dirname, '../views/index.html');
const errorHTML = path.join(__dirname, '../views/404.html');

const PORT = process.env.PORT || 5000;


// Route Handlers
function getIndexView(req, res) {
    try {
        res.status(200).sendFile(indexHTML);
    } catch (error) {
        console.error(error);
    }
}

function whoIAm(req, res) {
    try {
        const userLang = req.headers['accept-language'];
        const userAgent = req.headers['user-agent'];
        res.status(200).json({
            "ipaddress": req.ip,
            "language": userLang,
            "software": userAgent,
        })
    } catch (error) {
        console.log({error: error});
    }
}


// Routes
router.get('/', getIndexView);
router.get('/api/whoami', whoIAm)

// Loader
function loader(app) {
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use(router);
    console.info('Express running!')
    
    app.use(function(req, res) {
        res.status(404).sendFile(errorHTML);
    })
    
    app.use(function(err, req, res) {
        res.status(500).json({error: err.message});
    })
}

// Server
function serverBootstrap() {
    const app = express();
    app.use(cors());
    const server = app.listen(PORT);

    server.on('error', onError);
    server.on('listening', function() {
        console.info(`Server is running on port ${PORT}`);
        loader(app);
    })

    function onError(err) {
        switch(err.code) {
            case 'EACCES':
                console.error('Requires elevated privileges!');
                break;
            case 'EADDRINUSE':
                console.error(`Port ${PORT} already in use!`);
            default:
                console.error(err);
        }
    }
}

serverBootstrap()