const express = require('express');
const service = require('../services/tasks.service');

const router = express.Router();


/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *          type: string
 *         description: filter task by title
 *       - in: query
 *         name: status
 *         schema:
 *          type: string
 *         description: filter task by status
 *     responses:
 *       200:
 *         description: List of all tasks
 */
router.get("/tasks", async (req, res) => {
    const { search, status } = req.query;
    res.json(await service.getAllTasks({ search, status }));
});

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a single task by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task id
 *     responses:
 *       200:
 *         description: The matching task
 *       404:
 *         description: Task not found
 */
router.get("/tasks/:id", async (req, res, next) => {
    try {
        const task = await service.getTaskById(req.params.id);
        res.json(task);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *             example:
 *               title: Buy milk
 *     responses:
 *       201:
 *         description: The created task
 *       400:
 *         description: Missing title
 */
router.post("/tasks", async (req, res) => {
    const newTask = await service.createTask(req.body.title);

    res.status(201).json(newTask);
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update an existing task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               done:
 *                 type: integer
 *     responses:
 *       200:
 *         description: The updated task
 *       400:
 *         description: Invalid task
 *       404:
 *         description: Task not found
 */
router.put("/tasks/:id", async (req, res) => {
    const {
        body: { title, done },
        params: { id }
    } = req;

    const task = await service.updateTask(title, done, id);
    res.status(200).json(task);
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The task id
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete("/tasks/:id", async (req, res) => {
    await service.deleteTask(req.params.id);
    res.sendStatus(204);
});

module.exports = router;