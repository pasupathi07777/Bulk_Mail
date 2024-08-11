




const express = require('express');
const cors = require('cors');
const nodemailer = require("nodemailer");
const mongoose = require('mongoose'); // Fixed typo
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://pasupathi0757:123@cluster0.0mhar.mongodb.net/bulk?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Database Connected ");
    })
    .catch((e) => {
        console.log(e)
        console.log("Database not  Connected ");
    });

// Define a schema for the model
const mailSchema = new mongoose.Schema({}, { collection: 'bulkmail' });

const MailModel = mongoose.model("model", {}, "bulkmail");

app.post('/sent', async (req, res) => {
    const { from, subject, composeMail, file } = req.body;
    console.log(from, subject, composeMail, file);

    try {
        const users = await MailModel.find();
        const { user, pass } = users[0].toJSON();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: user,
                pass: pass,
            },
        });

        for (let i = 0; i < file.length; i++) { // Use < instead of <=
            try {
                await transporter.sendMail({
                    from: from, // Use the from parameter from the request
                    to: file[i],
                    subject: subject,
                    text: composeMail,
                });
                console.log(`${file[i]} sent successfully`);
            } catch (error) {
                console.log(`Error sending to ${file[i]}: ${error.message}`);
            }
        }

        res.status(200).send(true);

    } catch (error) {
        console.error("Error: ", error);
        res.status(500).send(false);
    }
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
});
