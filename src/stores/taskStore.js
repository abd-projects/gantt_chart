import { defineStore } from "pinia";
import {
    ref,
    watch
} from "vue";

export const useTaskStore = defineStore('tasks', () => {
    let id = Number(localStorage.getItem('nextTaskId')) || 5
    const defaultTasks = [
        {
            name: 'UI Design',
            start: '2026-09-29',
            end: '2026-10-05',
            status: 'In Progress',
            progress: 60,
            overdue: false,
            id: 1,
            subTasks: [
                {
                    name: 'SubTask 1',
                    start: '2026-09-29',
                    end: '2026-10-03',
                    status: 'Overdue',
                    progress: 60,
                    overdue: true,
                    id: 1.1,
                }
            ]
        },
        {
            name: 'Backend Development',
            start: '2026-10-01',
            end: '2026-10-12',
            status: 'Not Started',
            progress: 0,
            overdue: false,
            id: 2,
            subTasks: []
        },
        {
            name: 'Testing',
            start: '2026-10-10',
            end: '2026-10-16',
            status: 'Not Started',
            progress: 0,
            overdue: false,
            id: 3,
            subTasks: []
        },
        {
            name: 'Deployment',
            start: '2026-10-15',
            end: '2026-10-20',
            status: 'Completed',
            progress: 100,
            overdue: false,
            id: 4,
            subTasks: []
        }
    ]

    const savedTasks = localStorage.getItem('tasks')
    const tasks = ref(
        savedTasks ? JSON.parse(savedTasks) : defaultTasks
    )

    watch(
        tasks,
        (newTasks) => {
            localStorage.setItem(
                'tasks',
                JSON.stringify(newTasks)
            )
        },
        { deep: true }
    )

    function formatDate(date) {
        if (date instanceof Date) {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            return `${year}-${month}-${day}`
        }
        return date
    }

    function importTasks(rows) {
        id = 1
        localStorage.setItem('nextTaskId', id)
        tasks.value = []
        const taskMap = {}

        rows.forEach(row => {
            if (row.Type === 'Task') {
                const task = {
                    name: row.Name,
                    start: formatDate(row.Start),
                    end: formatDate(row.End),
                    status: row.Status || 'Not Started',
                    progress: Number(row.Progress) || 0,
                    overdue: false,
                    id: id++,
                    subTasks: []
                }

                tasks.value.push(task)
                taskMap[row.Name] = task
            }
        })

        rows.forEach(row => {
            if (row.Type === 'Subtask') {
                const parentTask = taskMap[row.Parent]
                if (parentTask) {
                    parentTask.subTasks.push({
                        name: row.Name,
                        start: formatDate(row.Start),
                        end: formatDate(row.End),
                        status: row.Status || 'Not Started',
                        progress: Number(row.Progress) || 0,
                        overdue: false,
                        id: parentTask.id +
                        (parentTask.subTasks.length + 1) / 10
                    })
                }
            }
        })

        updateOverdue()
    }

    function saveNextId() {
        localStorage.setItem('nextTaskId', id)
    }

    function updateOverdue() {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        tasks.value.forEach(task => {
            const taskEnd = new Date(task.end)
            taskEnd.setHours(0, 0, 0, 0)

            if (taskEnd < today && task.status !== 'Completed') {
                task.status = 'Overdue'
                task.overdue = true
            }

            task.subTasks.forEach(subTask => {
                const subTaskEnd = new Date(subTask.end)
                subTaskEnd.setHours(0, 0, 0, 0)

                if (subTaskEnd < today && subTask.status !== 'Completed') {
                    subTask.status = 'Overdue'
                    subTask.overdue = true
                }
            })
        })
    }

    function updateTaskProgress(id) {
        const task = tasks.value.find(task => task.id === id)

        if (task && task.subTasks.length > 0) {
            let progress = 0

            for (const subTask of task.subTasks) {
                if (subTask.status === 'Completed') {
                    progress += 100
                }
                else {
                    progress += subTask.progress
                }
            }
            task.progress = progress / task.subTasks.length
            if (task.progress === 100) {
                task.status = 'Completed'
            }
        }
    }

    function addTask(name, start, end) {
        if (end < start) {
            end = start
        }
        tasks.value.push({
            name: name,
            start: start,
            end: end,
            status: 'Not Started',
            progress: 0,
            overdue: false,
            id: id++,
            subTasks: []
        })
    }

    function updateTask(name, start, end, status, progress, id) {
        const task = tasks.value.find(task => task.id === id)

        if (task) {
            task.name = name
            if (end < start) {
                end = start
            }
            task.start = start
            task.end = end
            task.status = status
            if (status === 'Completed' || progress >= 100) {
                task.progress = 100
                task.status = 'Completed'
                task.subTasks.forEach(subTask => {
                    subTask.status = 'Completed'
                    subTask.progress = 100
                })
            }
            else if (progress<=0) {
                task.progress = 0
            }
            else {
                task.progress = progress
            }
        }
    }

    function deleteTask(id) {
        tasks.value = tasks.value.filter(task => task.id !== id)
    }

    function addSubTask(id, name, start, end) {
        const task = tasks.value.find(task => task.id === id)

        if (task) {
            if (task.start > start) {
                task.start = start
            }
            if (task.end < end) {
                task.end = end
            }
            if (end < start) {
                end = start
            }
            task.subTasks.push({
                name: name,
                start: start,
                end: end,
                status: 'Not Started',
                progress: 0,
                overdue: false,
                id: id + (task.subTasks.length + 1) / 10
            })

            updateTaskProgress(id)
        }
    }

    function updateSubTask(id, name, start, end, status, progress, sId) {
        const task = tasks.value.find(task => task.id === id)

        if (task) {
            const sTask = task.subTasks.find(sTask => sTask.id === sId)

            if (sTask) {
                if (task.start > start) {
                    task.start = start
                }
                if (task.end < end) {
                    task.end = end
                }
                if (end < start) {
                    end = start
                }
                sTask.name = name
                sTask.start = start
                sTask.end = end
                sTask.status = status
                if (status === 'Completed' || progress >= 100) {
                    sTask.progress = 100
                    sTask.status = 'Completed'
                }
                else if (progress<0) {
                    sTask.progress = 0
                }
                else {
                    sTask.progress = progress
                }

                updateTaskProgress(id)
            }
        }
    }
    
    function deleteSubTask(id, sId) {
        const task = tasks.value.find(task => task.id === id)

        if (task) {
            task.subTasks = task.subTasks.filter(sTask => sTask.id !== sId)

            updateTaskProgress(id)
        }
    }

    return {
        tasks,
        importTasks,
        addTask,
        updateTask,
        deleteTask,
        addSubTask,
        updateSubTask,
        deleteSubTask,
        updateOverdue
    }
})