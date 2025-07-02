import { type JSX, useEffect, useRef } from 'react'
import './App.css'
import * as THREE from 'three'
import gsap from 'gsap'

function App(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    const geo = new THREE.BoxGeometry(1, 1, 1)

    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      // wireframe: true,
    })

    const mesh = new THREE.Mesh(geo, material)

    mesh.rotation.set(0, 0, 0)

    scene.add(mesh)
    camera.lookAt(mesh.position)
    
    console.log("distance from origin(0,0,0) to object posi:", mesh.position.length())
    console.log("distance from any vector(0,1,2) to object posi:", mesh.position.distanceTo(new THREE.Vector3(0, 1, 2)))
    console.log("distance from camera to object posi:", camera.position.distanceTo(mesh.position))

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      canvas
    })

    renderer.setSize(sizes.width, sizes.height)

    // let time = Date.now();

    const clock = new THREE.Clock()

    gsap.to(mesh.position, {
      x: 2, duration: 1, delay: 1
    })
    gsap.to(mesh.position, {
      x: 0, duration: 1, delay: 2
    })

    //aniamtion
    const tick = () => {

      // const cur_time = Date.now();
      // const delta = cur_time - time;
      // time = cur_time;

      // mesh.rotation.y += delta * 0.001;

      // const elapsedTime = clock.getElapsedTime();
      // mesh.rotation.y = elapsedTime * Math.PI * 2; // 360 deg / sec
      // mesh.position.y = Math.sin(elapsedTime); //wave
      // mesh.position.x = Math.cos(elapsedTime); //wave

      renderer.render(scene, camera);
      window.requestAnimationFrame(tick);
    }

    tick();
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
