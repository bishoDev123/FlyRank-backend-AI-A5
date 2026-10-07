const taskRepository = require('../repositories/tasks.repositories');
const { validateTitle, validateTask, validateId, validateDone } = require('../util/validate');


async function getAllTasks({ search, status } = {}) {
    const normalizedStatus = status !== undefined
        ? (status === "done" ? true : false)
        : undefined;

    return await taskRepository.findAll({ search, status: normalizedStatus });
}

async function getTaskById(id) {
    validateId(Number(id));

    const task = await taskRepository.findById(id);

    validateTask(task, id);

    return task;
}

async function createTask(title) {
    const trimmed = validateTitle(title);

    return await taskRepository.insert(trimmed);
}

async function updateTask(title, done, id) {
    validateTitle(title);
    validateId(Number(id));
    validateDone(done);

    const task = await taskRepository.findById(id);
    validateTask(task, id);

    await taskRepository.update(id, title, done);
    return {...task, title, done};
}

async function deleteTask(id) {
    validateId(Number(id));

    const task = await taskRepository.findById(id);
    validateTask(task, id);

    await taskRepository.remove(id);
}

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};