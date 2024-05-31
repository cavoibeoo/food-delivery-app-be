const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Path to the image in the static/uploads folder
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, 'static', 'uploads',))
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({storage: storage})
// Route for image similarity search
app.post('/search', upload.single("thumbnail"), (req, res) => {
    // Execute the Python script with the image path as an argument
    exec(`set PYTHONIOENCODING=utf-8 && python app.py ${req.file.path}`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error executing Python script:', error);
            return res.status(500).send('Error executing Python script');
        }
        if (stderr) {
            console.error('Python script stderr:', stderr);
        }
        console.log('Python script stdout:', stdout);

        // Parse the output from the Python script and send it as a response
        const responseData = stdout;

        // console.log(req.file.path)

        res.json(responseData);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});