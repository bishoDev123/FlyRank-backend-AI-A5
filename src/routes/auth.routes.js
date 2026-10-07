const express = require('express');
const service = require('../services/auth.service');
const requireAuth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johnsmith@test.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: hunter2
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *       400:
 *         description: Invalid email or password
 */
router.post('/auth/signup', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const data = await service.signUp(email, password);
        res.status(201).json({ data });
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johnsmith@test.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: hunter2
 *     responses:
 *       201:
 *         description: Login successful, returns access and refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *       401:
 *         description: Authentication failed
 */
router.post('/auth/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { accessToken, refreshToken } = await service.login(email, password);

        res.status(201).json({ accessToken, refreshToken });
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /public/info:
 *   get:
 *     summary: Get publicly accessible info
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Public info returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome stranger! this info is public
 */
router.get('/public/info', (req, res) => {
    res.status(200).json({ message: 'Welcome stranger! this info is public' });
});

/**
 * @swagger
 * /protected/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 email:
 *                   type: string
 *                   format: email
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Missing, invalid, or expired access token
 */
router.get('/protected/profile', requireAuth, (req, res) => {
    const { id, email, created_at } = req.user;

    res.status(200).json({ id, email, created_at });
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Logout successful, no content returned
 *       401:
 *         description: Missing, invalid, or expired access token
 */
router.post('/auth/logout', requireAuth, async (req, res, next) => {
    try {
        await service.signOut();
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /protected/dashboard:
 *   get:
 *     summary: Get the authenticated user's dashboard greeting
 *     tags: [Protected]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard greeting returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome johnsmith@test.com
 *       401:
 *         description: Missing, invalid, or expired access token
 */
router.get('/protected/dashboard', requireAuth, (req, res) => {
    res.status(200).json({ message: `Welcome ${req.user.email}` });
});

module.exports = router;