import { type JSX, useEffect, useRef, useState } from 'react'
import './App.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const sizes = {
  width: 800,
  height: 600,
}

function App(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    // Make sure canvas exists
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const scene = new THREE.Scene()
    
    // Add axes helper
    const axesHelper = new THREE.AxesHelper(1)
    scene.add(axesHelper)

    // Setup perspectivecamera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.z = 3
    scene.add(camera)

    // Setup orbit controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true // Add smooth animation
    controls.dampingFactor = 0.05 // Control the damping speed

    const geo = new THREE.BoxGeometry(1, 1, 1)

    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
    })

    const mesh = new THREE.Mesh(geo, material)
    mesh.rotation.set(0, 0, 0)
    scene.add(mesh)
    camera.lookAt(mesh.position)

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      canvas
    })

    renderer.setSize(sizes.width, sizes.height)

    const clock = new THREE.Clock()

    // mouse move event
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / sizes.width - 0.5) * 2,
        y: -(e.clientY / sizes.height - 0.5) * 2,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    //animation
    const tick = () => {
      // const elapsedTime = clock.getElapsedTime();
      // mesh.rotation.y = elapsedTime * Math.PI * 0.5; // 360 deg / sec

      // camera.position.x = Math.sin(mouse.x * Math.PI * 2) * 3
      // camera.position.z = Math.cos(mouse.x * Math.PI * 2) * 3
      // camera.position.y = mouse.y * 3
      // camera.lookAt(new THREE.Vector3(0, 0, 0))
      
      // Update controls in each frame
      controls.update()
      
      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    }

    tick();

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      controls.dispose()
      renderer.dispose()
      geo.dispose()
      material.dispose()
    }
  }, []) 

  return (
    <>
      <div className='hero'>
        <canvas ref={canvasRef} className='webgl'></canvas>
      </div>
    </>
  )
}

export default App