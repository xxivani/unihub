const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { email, password, role, studentName, yearOfStudy, committeeName, club, committeeRole } = req.body;
    // Create user (password hashing is handled by the model hook)
    const user = await User.create({
      email,
      password,
      role,
      studentName: role === 'student' ? studentName : null,
      yearOfStudy: role === 'student' ? yearOfStudy : null,
      committeeName: role === 'committee' ? committeeName : null,
      club: role === 'committee' ? club : null,
      committeeRole: role === 'committee' ? committeeRole : null,
    });
    res.status(201).json({ message: 'User registered', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log('Login attempt for:', req.body.email);
    const { email, password } = req.body;
    
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('User found, verifying password');
    // Compare provided password with hashed password stored in database
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('Password verified, generating token');
    // Sign a JWT including the user's role
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('Login successful for user:', email);
    // Return the token and role in the response
    res.json({ message: 'Logged in successfully', token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};
module.exports = { registerUser, loginUser };
