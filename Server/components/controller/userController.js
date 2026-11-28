const router = require('express').Router();
const User = require('../models/userModel');

router.get('/', async(request, response) =>{
    try{
        const users = await User.find();
        response.status(200).json(users);
    }catch(error){
        response.status(500).json({
            message: "An Error has occured",
            error: error.message
        })
    }
})

router.post('/create', async(request, response) =>{
    try{
        const {name, email,  password} = request.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return response.status(409).json({
                message: "User with this email already exist",
                success: false
            })
        }

        const newUser = new User ({
            name: name,
            email: email,
            password: password
        })

        await newUser.save()
        response.status(201).json({
            message: "User created successfully",
            success: true,
            user: newUser
        })

    } catch(error){
        response.status(500).json({
            message: "An error has occured",
            error: error.message
        })
    }
})

router.get('/:id', async (request, response) =>{
    try{
        const user = await User.findById(request.params.id);
        if(!user){
            return response.status(404).json({
                message: "User not found",
                success: false,
                error: error.message
            })
        }
        response.status(200).json(user)
    } catch(error){
        response.status(500).json({
            message: "An Error has occured",
            error: error.message
        })
    }
})

router.put('/update/:id', async(request, response) =>{
    try{

        const user = await User.findById(request.params.id);
        if(!user){
            return response.status(404).json({
                message: "User not found",
                success: false,
                error: error.message
            })
        }

        const {name, email, password} = request.body;
        user.name = name
        user.email = email 
        user.password = password
        await user.save();
        response.status(200).json({
            message: "User updated successfully",
            success: true,
            user: user
        });

    } catch(error){
        response.status(500).json({
            message: "An Error has occured",
            error: error.message
        })
    }
})


router.delete('/delete/:id', async(request, response) =>{
    try{
        await User.findByIdAndDelete(request.params.id);
        response.status(200).json({
            message: "User deleted successfully",
            success: true
        });
    } catch(error){
        response.status(500).json({
            message: "An Error has occured",
            error: error.message
        })
    }
})


router.post('/login', async(request, response) => {
    try {
        const { email, password } = request.body;

        const user = await User.findOne({ email });

        if(!user) {
            return response.status(404).json({
                message: "User not found",
                success: false
            });
        }

        if(user.password !== password) {
            return response.status(401).json({
                message: "Incorrect password",
                success: false
            });
        }

        response.status(200).json({
            message: "Login successful",
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch(error) {
        response.status(500).json({
            message: "An error has occurred",
            error: error.message
        });
    }
});

module.exports = router;