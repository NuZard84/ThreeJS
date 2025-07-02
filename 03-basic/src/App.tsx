import { type JSX, useEffect, useRef } from 'react'
import './App.css'
import * as THREE from 'three'

function App(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    // Make sure canvas exists
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    
    const scene = new THREE.Scene()

    const geo = new THREE.BoxGeometry(1, 1, 1)

    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      // wireframe: true,
    })

    const mesh = new THREE.Mesh(geo, material)
    scene.add(mesh)

    const sizes = {
      width: 800,
      height: 600,
    }
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
    camera.position.z = 4;
    camera.position.y = 1;
    scene.add(camera)

    const renderer = new THREE.WebGLRenderer({
      canvas
    })

    renderer.setSize(sizes.width, sizes.height)

    renderer.render(scene, camera)
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
