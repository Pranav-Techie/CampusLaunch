const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/User");

/*
|--------------------------------------------------------------------------
| CREATE JWT TOKEN
|--------------------------------------------------------------------------
*/

const createToken = (userId) => {
  return jwt.sign(
    {
      id: userId.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone = "",
      password,
      role = "student",
      college = "",
      course = "",
      year = 1,
      skills = [],
      interests = [],
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: String(phone).trim(),
      password: hashedPassword,

      role: role === "admin" ? "admin" : "student",

      college,
      course,
      year: Number(year) || 1,

      skills: Array.isArray(skills) ? skills : [],
      interests: Array.isArray(interests) ? interests : [],
    });

    const token = createToken(user._id);

    return res.status(201).json({
      message: "Registration successful.",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        college: user.college,
        course: user.course,
        year: user.year,
        skills: user.skills,
        interests: user.interests,

        resume: user.resume
          ? {
              filename: user.resume.filename,
              contentType: user.resume.contentType,
              size: user.resume.size,
              uploadedAt: user.resume.uploadedAt,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Registration failed.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

const login = async (req, res) => {
  try {
    const {
      email,
      password,
      expectedRole,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    /*
     * Optional role validation.
     * Frontend does not have to send expectedRole.
     */
    if (expectedRole && user.role !== expectedRole) {
      return res.status(403).json({
        message:
          expectedRole === "admin"
            ? "This account is not an admin account."
            : "This account is not a student account.",
      });
    }

    /*
     * IMPORTANT:
     * JWT contains { id: user._id }
     * so authMiddleware can correctly find the user.
     */
    const token = createToken(user._id);

    return res.json({
      message: "Login successful.",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        college: user.college,
        course: user.course,
        year: user.year,
        skills: user.skills,
        interests: user.interests,

        resume: user.resume
          ? {
              filename: user.resume.filename,
              contentType: user.resume.contentType,
              size: user.resume.size,
              uploadedAt: user.resume.uploadedAt,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET CURRENT USER
|--------------------------------------------------------------------------
*/

const getMe = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("-password -resume.data");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.json({
      user,
    });
  } catch (error) {
    console.error("Get me error:", error);

    return res.status(500).json({
      message: "Unable to load user.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE + RESUME
|--------------------------------------------------------------------------
*/

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    /*
     * NORMAL PROFILE FIELDS
     */

    if (req.body.name !== undefined) {
      user.name = String(req.body.name).trim();
    }

    if (req.body.email !== undefined) {
      user.email = String(req.body.email)
        .trim()
        .toLowerCase();
    }

    /*
     * WHATSAPP / PHONE NUMBER
     */

    if (req.body.phone !== undefined) {
      user.phone = String(req.body.phone).trim();
    }

    if (req.body.college !== undefined) {
      user.college = String(
        req.body.college
      ).trim();
    }

    if (req.body.course !== undefined) {
      user.course = String(
        req.body.course
      ).trim();
    }

    if (req.body.year !== undefined) {
      user.year = Number(req.body.year) || 1;
    }

    /*
     * SKILLS
     */

    if (req.body.skills !== undefined) {
      if (Array.isArray(req.body.skills)) {
        user.skills = req.body.skills
          .map((item) => String(item).trim())
          .filter(Boolean);
      } else {
        try {
          const parsed = JSON.parse(
            req.body.skills
          );

          if (Array.isArray(parsed)) {
            user.skills = parsed
              .map((item) => String(item).trim())
              .filter(Boolean);
          }
        } catch {
          user.skills = String(req.body.skills)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }
    }

    /*
     * INTERESTS
     */

    if (req.body.interests !== undefined) {
      if (Array.isArray(req.body.interests)) {
        user.interests = req.body.interests
          .map((item) => String(item).trim())
          .filter(Boolean);
      } else {
        try {
          const parsed = JSON.parse(
            req.body.interests
          );

          if (Array.isArray(parsed)) {
            user.interests = parsed
              .map((item) => String(item).trim())
              .filter(Boolean);
          }
        } catch {
          user.interests = String(
            req.body.interests
          )
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }
    }

    /*
     * RESUME
     *
     * Frontend sends:
     *
     * FormData.append("resume", file)
     */

    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({
          message: "Only PDF resumes are allowed.",
        });
      }

      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          message: "Resume must be smaller than 5 MB.",
        });
      }

      user.resume = {
        data: req.file.buffer,
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date(),
      };
    }

    await user.save();

    /*
     * Never return resume.data
     */

    const responseUser = user.toObject();

    delete responseUser.password;

    if (responseUser.resume) {
      delete responseUser.resume.data;
    }

    return res.json({
      message: req.file
        ? "Profile and resume updated successfully."
        : "Profile updated successfully.",

      user: responseUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (
      error.code === 11000 &&
      error.keyPattern?.email
    ) {
      return res.status(409).json({
        message: "That email is already in use.",
      });
    }

    return res.status(500).json({
      message: "Unable to update your profile.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET MY RESUME
|--------------------------------------------------------------------------
*/

const getMyResume = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("resume");

    if (
      !user ||
      !user.resume ||
      !user.resume.data
    ) {
      return res.status(404).json({
        message: "No resume uploaded.",
      });
    }

    res.set({
      "Content-Type":
        user.resume.contentType ||
        "application/pdf",

      "Content-Disposition":
        `inline; filename="${encodeURIComponent(
          user.resume.filename || "resume.pdf"
        )}"`,

      "Content-Length":
        user.resume.data.length,
    });

    return res.send(user.resume.data);
  } catch (error) {
    console.error("Get my resume error:", error);

    return res.status(500).json({
      message: "Unable to load resume.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE MY RESUME
|--------------------------------------------------------------------------
*/

const deleteMyResume = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    user.resume = undefined;

    await user.save();

    return res.json({
      message: "Resume removed successfully.",
    });
  } catch (error) {
    console.error("Delete resume error:", error);

    return res.status(500).json({
      message: "Unable to remove resume.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| ADMIN: GET STUDENT RESUME
|--------------------------------------------------------------------------
*/

const getStudentResume = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        studentId
      )
    ) {
      return res.status(400).json({
        message: "Invalid student ID.",
      });
    }

    const student = await User.findById(
      studentId
    ).select(
      "name email role resume"
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    if (student.role !== "student") {
      return res.status(400).json({
        message:
          "Resume access is only available for student accounts.",
      });
    }

    if (
      !student.resume ||
      !student.resume.data
    ) {
      return res.status(404).json({
        message:
          "This student has not uploaded a resume.",
      });
    }

    res.set({
      "Content-Type":
        student.resume.contentType ||
        "application/pdf",

      "Content-Disposition":
        `inline; filename="${encodeURIComponent(
          student.resume.filename || "resume.pdf"
        )}"`,

      "Content-Length":
        student.resume.data.length,
    });

    return res.send(
      student.resume.data
    );
  } catch (error) {
    console.error(
      "Admin student resume error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to load student resume.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  getMyResume,
  deleteMyResume,
  getStudentResume,
};