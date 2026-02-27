import { Router, Request, Response } from "express";

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

router.post("/register", (req: Request, res: Response) => {
  const { name, email, password } = req.body as RegisterBody;

  if (!name?.trim() || !email?.trim() || !password) {
    res.status(400).json({ message: "Name, email and password are required." });
    return;
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    res.status(400).json({ message: "Invalid email format." });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ message: "Password must be at least 8 characters long." });
    return;
  }

  res.status(201).json({
    message: "User registered successfully.",
    user: { name: name.trim(), email: email.trim() },
  });
});

export default router;
