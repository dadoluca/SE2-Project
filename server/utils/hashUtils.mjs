import bcrypt from 'bcrypt';

// Function to hash a password
export const hashPassword = async (password) => {
  const saltRounds = 10; // You can adjust the cost factor as needed
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    throw new Error('Error hashing password');
  }
};

// Function to compare a plain text password with a hashed password
export const verifyPassword = async (password, hashedPassword) => {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (err) {
    throw new Error('Error verifying password');
  }
};
