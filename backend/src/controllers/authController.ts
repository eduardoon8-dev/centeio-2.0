import { Response } from 'express';
import bcrypt from 'bcrypt';
import validator from 'validator';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!req.userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (email !== undefined && !validator.isEmail(email)) {
    res.status(400).json({ message: 'Invalid email format' });
    return;
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (email !== undefined && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        res.status(400).json({ message: 'Email already in use' });
        return;
      }
      user.email = email;
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (password !== undefined) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
