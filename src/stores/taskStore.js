import { defineStore } from "pinia";
import { ref } from "vue";

export const useTaskStore = defineStore('tasks', () => {
    let id = 5
    const tasks = ref([
    {
        name: 'UI Design',
        start: '2026-09-29',
        end: '2026-10-05',
        status: 'In Progress',
        progress: 60,
        id: 1,
        subTasks: [
            {
                name: 'SubTask 1',
                start: '2026-09-29',
                end: '2026-10-05',
                status: 'Overdue',
                progress: 60,
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
        id: 2,
        subTasks: []
    },
    {
        name: 'Testing',
        start: '2026-10-10',
        end: '2026-10-16',
        status: 'Not Started',
        progress: 0,
        id: 3,
        subTasks: []
    },
    {
        name: 'Deployment',
        start: '2026-10-15',
        end: '2026-10-20',
        status: 'Completed',
        progress: 90,
        id: 4,
        subTasks: []
    }
    ])

    function updateTaskProgress(id) {
        const task = tasks.value.find(task => task.id === id)

        if (task && task.subTasks.length > 0) {
            let progress = 0

            for (const subTask of task.subTasks) {
                progress += subTask.progress
            }
            task.progress = progress / task.subTasks.length
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
            if (progress>=100) {
                task.progress = 100
                task.status = 'Completed'
            }
            else if (progress<=0) {
                task.progress = 0
                task.status = 'Not Started'
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
                start = task.start
            }
            if (task.end < end) {
                end = task.end
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
                    start = task.start
                }
                if (task.end < end) {
                    end = task.end
                }
                if (end < start) {
                    end = start
                }
                sTask.name = name
                sTask.start = start
                sTask.end = end
                sTask.status = status
                if (progress>=100) {
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
        addTask,
        updateTask,
        deleteTask,
        addSubTask,
        updateSubTask,
        deleteSubTask
    }
})