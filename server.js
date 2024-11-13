const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes'); 
const path = require('path');
const multer = require('multer');

const User = require('./models/userModel')
const UserDetails = require('./models/userDetails')
const AdminToken = require('./models/adminToken')
const cors = require('cors');

require('dotenv').config();


const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const authenticateToken = require('./middlewares/auth');
const adminAuthentication = require('./middlewares/adminAuth')

// adminAuth
const { generateAccessToken, generateRefreshToken } = require('./services/tokenService');


const SECRET_KEY = process.env.JWT_SECRET || '00000'; 


const app = express();
const PORT = process.env.PORT || 3000;



mongoose.connect('mongodb://localhost:27017/Angular_1', {
  })
  .then(() => console.log('Connected to Database'))
  .catch(err => console.error('Failed to connect to MongoDB', err));



const storage = multer.diskStorage({ 
    destination:(req, file, cb) => {
        // cb(null, '/uploads');  
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        // cb(null, file.originalname)
    }
});

const upload = multer({ storage });
// const upload = multer({ 
//     storage: storage, 
//     limits: { fileSize: 10 * 1024 * 1024 }  // Optional: limit the file size to 10MB
//   });


// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/assets', express.static(path.join(__dirname, 'public')));


// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:4200', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
}));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(express.static('public')); 

// Routes
app.use('/users', userRoutes); 

  

// Home route
app.get('/', async (req, res) => {
    try {
        // Fetch user and profile data from the database
        const users = await User.find({});
        const userProfile = await UserDetails.find({});
        console.log(userProfile)

        // Map through users and attach profile pic (if available)
        const userDetails = users.map(user => {
            const profile = userProfile.find(detail => detail.userId.equals(user._id)); // use equals for ObjectId comparison
            return {
                userId: user._id,
                username: user.username,
                email: user.email,
                profilePic: profile ? profile.profilePic : 'assets/default.png'
            };
        });

        // Render the index.ejs page with user details
        res.render('index', { userDetails });  // Pass userDetails to the EJS view

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });  // Corrected to use status method
    }
});




// user register------------------------------------
app.post('/user/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // console.log(req.body);

        const hashedPassword = await bcrypt.hash(password, 10);
 
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Invalid user data" });
        }


        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
});


// user login check-----------------------------------
app.post('/user/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User does not exist' });
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(token);

        return res.status(200).json({ message: 'User logged in successfully', token, userId: user._id });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


// user file upload-----------------------------------
app.post('/user/fileData', upload.single('file'), async (req, res) => {
    try {
            const img = req.file
        if (!img) {
            return res.status(400).json({ message: "No file found" });
        }

        const userId = req.body.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        let userDetails = await UserDetails.findOne({ userId });

        if (!userDetails) {
            userDetails = new UserDetails({
                userId,
                profilePic: img.path
            });
            await userDetails.save();

            return res.status(201).json({
                message: "Profile picture uploaded and user details created successfully",
                profilePic: userDetails.profilePic,
                userId: userDetails.userId
            });
        } else {
            userDetails.profilePic = img.path;
            await userDetails.save();

            return res.status(200).json({
                message: "Profile picture uploaded successfully",
                profilePic: userDetails.profilePic,
                userId: userDetails.userId
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }

})


// get users data
app.get('/users_data', adminAuthentication, async (req, res) => {
    try {
        let header = req.headers.Authorization
        console.log(header)
        const users = await User.find({});
        const userProfile = await UserDetails.find({});

        const userDetails = users.map(user => {
            const profile = userProfile.find(detail => detail.userId.equals(user._id)); // Use equals for ObjectId comparison
            return {
                userId: user._id,
                username: user.username,
                email: user.email,
                profilePic: profile ? profile.profilePic : 'assets/default.png' // Set default image if no profile pic
            };
        });

        res.status(200).json({ userDetails });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


//admin remove user
app.delete('/admin/removeUser', adminAuthentication, async (req, res) => {
       try {
        const { userId } = req.body;

        const user = await User.findOneAndDelete({ _id: userId });
        const userDetails = await UserDetails.findOneAndDelete({ userId: userId });

        if (user || userDetails) {
            return res.status(200).json({ message: 'Successfully removed user' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }

    } catch (error) {
        console.error('Error while removing user:', error);
        return res.status(500).json({ message: 'Failed to remove user', error });
    }
});


// Admin login
app.post('/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const admin = process.env.ADMIN
        const admPwd = process.env.ADMIN_PWD

        if(!admin || !admPwd) {
            return res.status(401).json({message: 'admin or password credentials not found'})
        }

        const checkUsername = await bcrypt.compare(username, admin);
        const checkPwd = await bcrypt.compare(password, admPwd);

        const isAuthenticated = (checkUsername && checkPwd);

        if (!isAuthenticated) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        const adminId = process.env.ADMIN_ID
        const accesstoken = generateAccessToken(adminId);
        const refreshtoken = generateRefreshToken(adminId);

        const newAdminToken = new AdminToken({
            refreshToken: refreshtoken,
            accessToken: accesstoken,
            accessTokenExpiry: new Date(Date.now() + 15 * 60 * 1000),
        });
        
        await newAdminToken.save(); 
     
        return res.status(200).json({ message: 'Login Successfull', accesstoken, refreshtoken})
    } catch (error) {
        console.log(error);
    }



// refresh admin Token
app.post('admin/token/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    if(!refreshToken) { return res.status(401).json({ message: 'refresh token required' }) }

    const admin = await Admin.findOne({ refreshToken }); 

    if(!admin) { return res.status(403).json({ message: 'Invalid refresh token' }) }

    jwt.verify(refreshToken, admin, (err, adminData) => {
        if(err) { return res.status(403).json({ message: 'Invalid refresh token' }) }

        const accessToken = generateAccessToken(admin)

        res.status(200).json({ accessToken });
    } )
})
    // app.post('/admin/token/refresh', async (req, res) => {
    //     const { refreshToken } = req.body;
    
    //     if (!refreshToken) {
    //         return res.status(401).json({ message: 'Refresh token required' });
    //     }
    
    //     try {
    //         // Find the admin by refresh token
    //         const admin = await Admin.findOne({ refreshToken });
    //         if (!admin) {
    //             return res.status(403).json({ message: 'Invalid refresh token' });
    //         }
    
    //         // Verify the refresh token
    //         jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, adminData) => {
    //             if (err) return res.status(403).json({ message: 'Invalid refresh token' });
    
    //             // Generate a new access token
    //             const accessToken = generateAccessToken(admin);
    
    //             res.status(200).json({
    //                 accessToken,
    //             });
    //         });
    //     } catch (error) {
    //         console.error('Refresh token error:', error);
    //         return res.status(500).json({ message: 'Internal server error' });
    //     }
    // });
    





}),












// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
