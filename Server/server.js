const express = require('express');
const connectDB = require('./components/config/db.Connect')
const userRoutes = require('./components/controller/userController')
const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', userRoutes);

app.get('/', (request, response) => {
  response.send('Hello Jhon Kelly Pielago!');
});

app.post('/greetings', (request, response) => {
    try{
        const {name, course, section } = request.body;

        response.status(200).json({
           name: name,
              course: course,
              section: section,
              message : `Hello ${name} from section ${section} of the course ${course}`
        });
    } catch (error) {

        response.status(500).json({
            message: "An error has occured!",
            error
        });
    }
})

app.post('/login', (request, response) => {
    try {
        const { username, password } = request.body;
        if(username === 'admin' && password === '1234') {
            return response.status(200).json({
                message: "User logged in successfully",
                success: true
            })
        } else {
            return response.status(401).json({
                message: "Invalid credentials",
                success: false
            })

        }
    } catch(error) {
        response.status(500).json({
            message: "Error logging in",
            error
        })
    }
})

app.listen(8000, error => {
  if (error) {
    console.error('Failed to start server');
    console.error("Error", error);
  } else {
    console.log('Server is now running on port 8000');
  }
});