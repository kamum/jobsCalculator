const express = require('express')
const routes = express.Router()

const views = __dirname + "/views/"

const profile = {
    name: "Jonathan",
    avatar: "https://avatars.githubusercontent.com/u/17974280?v=4",
    "days-per-week": 5,
    "monthly-budget": 8000,
    
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "hourly-rate": 75,
}

const jobs =[
    {
        id:1,
        name: "Pizarria Guloso",
        "daily-hours": 2,
        "total-hours": 60,
        created_at: Date.now()
    },
    {
        id:2,
        name: "Site de sacanagem",
        "daily-hours": 3,
        "total-hours": 47,
        created_at: Date.now()
    },
]

function remainingDays(job) {

        const remaniningDays = (job["total-hours"] / job ["daily-hours"]).toFixed()
        const createdDate = new Date(job.created_at)
        const dueDay = createdDate.getDate() + Number (remaniningDays)
        const dueDateInMs = createdDate.setDate(dueDay)

        const timeDiffInMs = dueDateInMs - Date.now()
        // transform milliseconds in days
        const dayInMs = 1000 * 60 * 60 * 24
        const dayDiff = Math.floor(timeDiffInMs / dayInMs)

        //o restante dos dias
        return dayDiff
}
//req, res
routes.get('/', (req, res) => {
    //remaining calculate jobs
    const updatedJobs = jobs.map((job) => {
        
        const remaining = remainingDays(job)
        const status = remaining <= 0 ? "done" : "progress"

        
        return {
            ...job,
            remaining,
            status,
            budget: profile["hourly-rate"] * job["total-hours"]
        }
    })
    
    
    
    
    return res.render(views + "index",{jobs: updatedJobs})


})
routes.get('/job', (req, res) => res.render(views + "job"))
routes.post('/job', (req, res) => {
    
    const lastId = jobs[jobs.length - 1]?.id || 1;
   
    jobs.push({
        id: lastId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now()
    })
    return res.redirect('/')
})
routes.get('/job/edit', (req, res) => res.render(views + "job-edit"))
routes.get('/profile', (req, res) => res.render(views + "profile", {profile}))

module.exports = routes;