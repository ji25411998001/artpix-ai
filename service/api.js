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
    let data = {
        "key": "lJDqwAAcnoZJo3k6boLhLTojo1E8p3gtLbapYnibSuqoEV9LFg3IgZsl5Eoq",
        "model_id": "dark-sushi-mix-mix",
        "prompt": "ultra realistic close up portrait ((beautiful pale cyberpunk female with heavy black eyeliner)), blue eyes, shaved side haircut, hyper detail, cinematic lighting, magic neon, dark red city, Canon EOS R3, nikon, f/1.4, ISO 200, 1/160s, 8K, RAW, unedited, symmetrical balance, in-frame, 8K",
        "negative_prompt": "painting, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, deformed, ugly, blurry, bad anatomy, bad proportions, extra limbs, cloned face, skinny, glitchy, double torso, extra arms, extra hands, mangled fingers, missing lips, ugly face, distorted face, extra legs, anime",
        "width": "512",
        "height": "512",
        "samples": "1",
        "num_inference_steps": "20",
        "seed": null,
        "guidance_scale": 7.5,
        "safety_checker": "yes",
        "multi_lingual": "no",
        "panorama": "no",
        "self_attention": "no",
        "upscale": "no",
        "embeddings_model": null,
        "webhook": null,
        "track_id": null
      };
    axios.post('https://stablediffusionapi.com/api/v3/text2img', data)
        .then(response => {

            res.json(response.data)

        })
        .catch(error => {
            res.json({'error': 1});
        });
});

module.exports = router;