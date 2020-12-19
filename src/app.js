const express = require("express");
const path = require("path");
require("./db/conn");
const User = require("./models/usermessage");
const hbs = require("hbs");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 8000;

//setting the path
const staticpath = path.join(__dirname, "../public");
const templatepath = path.join(__dirname, "../templates/views");
const partialpath = path.join(__dirname, "../templates/partials");

//middleware
app.use(
  "/css",
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js"))
);
app.use(
  "/jq",
  express.static(path.join(__dirname, "../node_modules/jquery/dist"))
);

app.use(express.static(staticpath));
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "hbs");
app.set("views", templatepath);
hbs.registerPartials(partialpath);

//routing
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/contact", async (req, res) => {
  try {
    // Instantiate the SMTP server
    const smtpTrans = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: `user@gmail.com`, // YOUR EMAIL ADDRESS WITH SMTPJS.com registration
        pass: `hidden`,  // YOUR PASSWORD
      },
    });

    // Specify what the email will look like
    const mailOpts = {
      from: "user@gmail.com", // USER EMAIL
      to: `${req.body.email}`,
      subject: "this mail is for testing purpose",
      html: `<p>Hii ${req.body.name}<p>
            <p>Your message: (${req.body.message}) has reached to us and we 
               will contact you soon</P><br/>
               <p>Thank You</p>`,
    };

    // Attempt to send the email
    smtpTrans.sendMail(mailOpts, (error, response) => {
      if (error) {
        res.render("contact-failure"); // Show a page indicating failure
      } else {
        res.render("contact-success"); // Show a page indicating success
      }
    });

    //res.send(req.body)
    const userData = new User(req.body);
    await userData.save();
    res.status(201).render("index");
  } catch (error) {
    res.status(500).send(error);
  }
});

//server listen
app.listen(port, () => {
  console.log(`server is running at port no. ${port}`);
});
