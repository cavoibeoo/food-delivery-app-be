'use strict';

const userData = require('../data/user');

//get all user
const getAllUsers = async (req, res, next) => {
    try {
        const userList = await userData.getUser();
        //console.log(userList)
        res.send(userList);        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//get user by user id for user (check cookie)
const getUserById = async (req, res) => {
    try {   
        // // Get userId from the cookie
        const user_id = req.cookies.user_id;    

        // Check if userId is available
        if (!user_id) {
            return res.send({
                status: 'Error',
                message: 'User ID not found in the cookie'
            });
        }

        // Get user information based on userId
        const user = await userData.getById(user_id);

        if (!user) {
            return res.status(404).send({
                status: 'Error',
                message: 'User not found'
            });
        }
        // Send user information in the response
        return res.send({
            status: 'OK',
            user: user
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
};

//Get user by id for admin
const getUserByIdAdmin = async (req, res) => {
    try {   
        // // Get userId from the cookie
        const user_id = req.body.user_id;    

        // Get user information based on userId
        const user = await userData.getById(user_id);

        if (!user) {
            return res.status(404).send({
                status: 'Error',
                message: 'User not found'
            });
        }
        // Send user information in the response
        return res.status(200).send({
            status: 'Success',
            user: user
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
};

//add new user
const addUser = async (req, res, next) => {
    
    try {
        const data = req.body;
        const checkExist = await userData.checkEmailExist(data.email)

        if(!checkExist){
            const insert = await userData.createUser(data);
            res.status(200).send({status: "Success", insert: insert});
        }else {
            res.send({
                status: 'Error',
                message: 'This is email already exists'
            })
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//Upload user avatar
const uploadAvatar = async (req, res, next) =>{
    try {
        const user_id = req.cookies.user_id;

        // Check if userId is available
        if (!user_id) {
            return res.send({
                status: 'Error',
                message: 'User ID not found in the cookie'
            });
        }

        // Check if file is uploaded
        if (!req.file) {
          return res.status(400).json({ message: 'No image file uploaded' });
        }
    
        const result = await userData.uploadUserAva(user_id, req.file);
    
        // Send the response
        res.status(200).json({ status : "Success", message: 'Avatar uploaded successfully', user: result });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
      }
}


//Reset password
const resetPassword = async(req, res, next) =>{
    try {
        const {email, password} = req.body;
        const reset = await userData.resetPassword(email, password);
        res.send(reset);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// Update for user
const updateUser = async (req, res, next) => {
    try {
        const data = req.body;
        const id = req.cookies.user_id;

                // Check if userId is available
        if (!id) {
            return res.send({
                status: 'Error',
                message: 'User ID not found in the cookie'
            });
        }

        const updated = await userData.updateUser(id, data);

        if (updated.msg != 'Update successfully') 
            return res.send({status : "Error", updated : updated});

        res.status(200).send( {status : "Success", updated : updated} );
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// Use for user password
const updateUserPassword = async(req, res, next) =>{
    try {
        const password = req.body.password;
        const id = req.cookies.user_id;

        // Check if userId is available
        if (!id) {
            return res.send({
                status: 'Error',
                message: 'User ID not found in the cookie'
            });
        }

        const updated = await userData.updateUserPassword(id, password);
        res.status(200).send( {status : "Success", updated :updated} );
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//get recent accessed product
const getRecentProducts = async (req, res, next) => {

    try {
        const user_id = req.cookies.user_id;
                // Check if userId is available
        if (!user_id) {
            return res.send({
                status: 'Error',
                message: 'User ID not found in the cookie'
            });
        }
        
        let product = await userData.getRecentProduct(user_id);
        // product = product.filter(productItem => productItem != {})
        
        res.send(product);
    }catch(error) {
        res.status(400).send(error.message);
    }

}

// For admin to update user info
const updateUserInfo = async (req, res, next) => {
    try {
        const data = req.body;
        const updated = await userData.updateUserInfo(data);
        if (updated.msg != 'Update successfully') 
            return res.send({status : "Error", updated : updated});
        res.status(200).send({status : "Success", updated : updated});
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//For admin to upload user avatar
const uploadUserAvatar = async (req, res, next) =>{
    try {
        // Check if file is uploaded
        if (!req.file) {
          return res.status(400).json({ message: 'No image file uploaded' });
        }
    
        const result = await userData.uploadUserAva(req.body.user_id, req.file);
    
        // Send the response
        res.status(200).json({status : "Success", message: 'Avatar uploaded successfully', user: result });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
      }
}

//disable user
const deleteUser = async (req, res, next) => {
    try {
        const id = req.body.user_id;
        const deleted = await userData.deleteUser(id);
        res.send(deleted);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//enable user
const enableUser = async (req, res, next)=>{
    try {
        const id = req.body.user_id;
        const enable = await userData.enableUser(id);
        res.send(enable);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// const removeAdmin = async(req, res, next)=>{
//     try {
//         const id = req.body.id;
//         const remove = await userData.removeAdmin(id);
//         res.send(remove);
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }

module.exports = {
    getAllUsers,
    getUserById,
    getUserByIdAdmin,
    addUser,
    updateUser,
    updateUserInfo,
    updateUserPassword,
    resetPassword,
    uploadAvatar,
    deleteUser,
    enableUser,
    // removeAdmin
    getRecentProducts,
    uploadUserAvatar
}