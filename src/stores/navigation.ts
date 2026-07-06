import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Waypoint, Path, NavigationStatus } from '@/types'
import { rosApi } from '@/api/ros'

export const useNavigationStore = defineStore('navigation', () => {
  const waypoints = ref<Waypoint[]>([])
  const paths = ref<Path[]>([])
  const currentPath = ref<Path | null>(null)
  const navStatus = ref<NavigationStatus>({
    active: false,
    paused: false,
    currentWaypointIndex: 0,
    progress: 0,
  })

  let navInterval: ReturnType<typeof setInterval> | null = null

  function addWaypoint(wp: Omit<Waypoint, 'id' | 'order'>) {
    const id = 'wp' + (waypoints.value.length + 1)
    const order = waypoints.value.length + 1
    waypoints.value.push({ ...wp, id, order })
  }

  function removeWaypoint(id: string) {
    waypoints.value = waypoints.value.filter((w) => w.id !== id)
  }

  function clearWaypoints() {
    waypoints.value.splice(0, waypoints.value.length)
  }

  function savePath(name: string) {
    const path: Path = {
      id: 'path_' + Date.now(),
      name,
      waypoints: [...waypoints.value],
    }
    paths.value.push(path)
    return path
  }

  function loadPath(pathId: string) {
    const path = paths.value.find((p) => p.id === pathId)
    if (path) {
      currentPath.value = path
      waypoints.value = [...path.waypoints]
    }
  }

  function deletePath(pathId: string) {
    paths.value = paths.value.filter((p) => p.id !== pathId)
  }

  function startNavigation() {
    if (!currentPath.value && paths.value.length > 0) {
      currentPath.value = paths.value[0]
    }
    if (!currentPath.value) return
    navStatus.value.active = true
    navStatus.value.paused = false
    navStatus.value.currentWaypointIndex = 0
    navStatus.value.progress = 0
    navInterval = setInterval(() => {
      if (!navStatus.value.paused) {
        navStatus.value.progress += 2
        if (navStatus.value.progress >= 100) {
          navStatus.value.progress = 0
          navStatus.value.currentWaypointIndex++
          if (navStatus.value.currentWaypointIndex >= (currentPath.value?.waypoints.length || 0)) {
            stopNavigation()
          }
        }
      }
    }, 200)
  }

  function pauseNavigation() {
    navStatus.value.paused = true
  }

  function resumeNavigation() {
    navStatus.value.paused = false
  }

  function cancelNavigation() {
    stopNavigation()
  }

  function stopNavigation() {
    navStatus.value.active = false
    navStatus.value.paused = false
    navStatus.value.currentWaypointIndex = 0
    navStatus.value.progress = 0
    if (navInterval) {
      clearInterval(navInterval)
      navInterval = null
    }
  }

  function sendGoalPose(x: number, y: number, theta: number = 0) {
    const goalPose = {
      header: {
        stamp: { sec: Math.floor(Date.now() / 1000), nanosec: (Date.now() % 1000) * 1000000 },
        frame_id: 'map'
      },
      pose: {
        position: { x, y, z: 0 },
        orientation: {
          x: 0,
          y: 0,
          z: Math.sin(theta / 2),
          w: Math.cos(theta / 2)
        }
      }
    }
    rosApi.publishTopic('/goal_pose', 'geometry_msgs/msg/PoseStamped', goalPose)
  }

  return {
    waypoints,
    paths,
    currentPath,
    navStatus,
    addWaypoint,
    removeWaypoint,
    clearWaypoints,
    savePath,
    loadPath,
    deletePath,
    startNavigation,
    pauseNavigation,
    resumeNavigation,
    cancelNavigation,
    stopNavigation,
    sendGoalPose,
  }
})
