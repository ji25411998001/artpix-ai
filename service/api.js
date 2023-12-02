const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const cheerio = require('cheerio');
const CryptoJS = require("crypto-js");

const router = express.Router();

// Set up storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define routes
router.post('/:type', upload.single('file'), (req, res) => {

    const type = req.params.type;
    const formData = new FormData();

    if (type === 'text-to-image') {

        const prompt = req.body.prompt;
        const model = req.body.model;

        formData.append('action', 'processing_text');
        formData.append('function', 'ai-image-generator');
        formData.append('nonce', '36f16b4940');
        formData.append('text', prompt);
        formData.append('type', model);
        formData.append('custom', '');

    }

    if (type === 'remove-background') {

        const fileBuffer = req.file.buffer;

        formData.append('files[]', fileBuffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });
        formData.append('action', 'processing_images');
        formData.append('function', 'remove-background-from-image');
        formData.append('nonce', '3622647219');

    }

    const url = 'https://imageupscaler.com/wp-admin/admin-ajax.php';

    axios.post(url, formData)
        .then(response => {


            const $ = cheerio.load(response.data);
            const imgUrl = $('img').attr('src');

            var ciphertext = CryptoJS.AES.encrypt(imgUrl, 'DC7B4D3A782B37EC').toString();

            let base64 = Buffer.from(ciphertext).toString('base64');

            res.json({
                'error': 0,
                'url': 'http://localhost:5000/image/' + base64
            })

        })
        .catch(error => {
            res.json({'error': 1});
        });

});

router.get('/test', (req, res) => {
    res.send('okkkk');
});

module.exports = router;