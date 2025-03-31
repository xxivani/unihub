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
    const { email, password } = req.body;
    
    // Debug logging
    console.log('Login attempt for email:', email);
    console.log('JWT_SECRET is set:', !!process.env.JWT_SECRET);
    
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Compare provided password with hashed password stored in database
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Sign a JWT including the user's role
    try {
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '1h' }
      );
      
      // Return the token and role in the response
      res.json({ message: 'Logged in successfully', token, role: user.role, id: user.id });
    } catch (jwtError) {
      console.error('JWT signing error:', jwtError);
      res.status(500).json({ error: 'Authentication error' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'email', 'role'], // only return safe/public fields
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user by email:', err);
    res.status(500).json({ error: 'Server error while retrieving user' });
  }
};

module.exports = { registerUser, loginUser, getUserByEmail };
