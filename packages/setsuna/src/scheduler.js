import { isFunction } from "@setsunajs/share"
import { callWithErrorHandler } from "./handler/callWithErrorHandler"
import { error } from "./handler/errorHandler"

let pending = true
let pendingQueue = []
let flushingQueue = []
let workingJob = null
export const postQueue = []

export function flushJobs() {
  flushingQueue = pendingQueue
  pendingQueue = []

  if (flushingQueue.length > 1) {
    flushingQueue.sort((a, b) => a.c.cid - b.c.cid)
  }

  while ((workingJob = flushingQueue.shift())) {
    callWithErrorHandler(workingJob.c.VNode, workingJob)
  }

  if (pendingQueue.length > 0) {
    flushJobs()
  }
}

export const schedulerJobs = (() => {
  if ("MessageChannel" in globalThis) {
    const { port1, port2 } = new globalThis.MessageChannel()
    port1.onmessage = _schedulerJobs
    return () => port2.postMessage(null)
  } else {
    return () => setTimeout(_schedulerJobs)
  }

  function _schedulerJobs() {
    pending = false
    flushJobs()
    pending = true
    flushPostQueue()
  }
})()

export function appendJob(job, deep = false) {
  if (flushingQueue.includes(job) || pendingQueue.includes(job)) {
    if (deep) job.deep = true
    return
  }

  job.deep = deep
  pendingQueue.push(job)

  if (pending) {
    schedulerJobs()
  }
}

function flushPostQueue() {
  postQueue.forEach(job => {
    if (isFunction(job)) {
      return callWithErrorHandler(null, job)
    }

    const { VNode, fns } = job
    fns.forEach(fn => {
      callWithErrorHandler(VNode, fn)
    })
  })
  postQueue.length = 0
}

export function nextTick(fn) {
  if (!isFunction(fn)) {
    return error("nextTick", "fn is not a function", fn)
  }

  postQueue.push(fn)
  schedulerJobs()
}
