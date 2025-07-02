import { type JSX, useEffect, useRef, useState } from 'react'
import './App.css'
import * as THREE from 'three'

function App(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGroup, setIsGroup] = useState<boolean>(true)

  useEffect(() => {
    // Make sure canvas exists
    if (!canvasRef.current) return

    const sizes = {
      width: 800,
      height: 600,
    }

    const canvas = canvasRef.current
    const scene = new THREE.Scene()
    
    // Add axes helper
    const axesHelper = new THREE.AxesHelper(1)
    scene.add(axesHelper)

    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
    camera.position.z = 3
    scene.add(camera)

    if (isGroup) {
      const group = new THREE.Group()

      group.position.set(0, 1, 0)
      scene.add(group)

      const cube1 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1), 
        new THREE.MeshBasicMaterial({ color: 0xff0000 })
      )
      
      group.add(cube1)

      const cube2 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1), 
        new THREE.MeshBasicMaterial({ color: 0x00ff00 })
      )
      cube2.position.set(-2, 0, 0)
      group.add(cube2)

      const cube3 = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1), 
        new THREE.MeshBasicMaterial({ color: 0x0000ff })
      )
      cube3.position.set(2, 0, 0)
      
      group.add(cube3)
      
      // Position and rotate the group to make it visible
      // group.position.set(0.5, 0, 0)
      
      // Look at the group
      // camera.lookAt(group.position)
      
      console.log("Group added to scene")
    } else {
      const geo = new THREE.BoxGeometry(1, 1, 1)

      const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        // wireframe: true,
      })

      const mesh = new THREE.Mesh(geo, material)
      // mesh.position.x = 0.7;
      // mesh.position.y = -0.6;
      // mesh.position.z = 1;
      mesh.position.set(0.7, -0.6, 1)
      mesh.scale.set(2, 0.5, 0.5)

      //solution of gimble lock
      mesh.rotation.reorder('YXZ')
      mesh.rotation.set(Math.PI / 4, Math.PI / 4, 0)

      scene.add(mesh)
      camera.lookAt(mesh.position)
      
      console.log("distance from origin(0,0,0) to object posi:", mesh.position.length())
      console.log("distance from any vector(0,1,2) to object posi:", mesh.position.distanceTo(new THREE.Vector3(0, 1, 2)))
      console.log("distance from camera to object posi:", camera.position.distanceTo(mesh.position))
    }

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      canvas
    })

    renderer.setSize(sizes.width, sizes.height)
    renderer.render(scene, camera)
  }, [isGroup])

  return (
    <>
      <div className='hero'>
        <canvas ref={canvasRef} className='webgl'></canvas>
        <div className="controls">
          <button onClick={() => setIsGroup(!isGroup)}>
            Toggle {isGroup ? "Single Cube" : "Group"}
          </button>
        </div>
      </div>
    </>
  )
}

export default App
