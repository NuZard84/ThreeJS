import { type JSX, useEffect, useRef, useState } from 'react'
import './App.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

let sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

function App(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  })

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const scene = new THREE.Scene()
    
    const axesHelper = new THREE.AxesHelper(1)
    scene.add(axesHelper)

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.z = 3
    scene.add(camera)

    const controls = new OrbitControls(camera, canvas)
    // controls.enabled = false
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    // const geo = new THREE.BoxGeometry(1, 1, 1,20,20,20)

    // posiArr[0] = 0
    // posiArr[1] = 0
    // posiArr[2] = 0

    // posiArr[3] = 0
    // posiArr[4] = 1
    // posiArr[5] = 0


    // posiArr[6] = 1
    // posiArr[7] = 0
    // posiArr[8] = 0
    // const posiArr = new Float32Array([
    //   0, 0, 0,
    //   0, 1, 0,
    //   1, 0, 0,
    // ])
    // const posiAtt = new THREE.BufferAttribute(posiArr, 3)

    const geo = new THREE.BufferGeometry()

    const count = 50
    const posiArr = new Float32Array(count *  3 * 3)

    for (let i = 0 ; i < count * 3 * 3; i++) {
      posiArr[i] = (Math.random() - 0.5)
    }
    const posiAtt = new THREE.BufferAttribute(posiArr, 3)
    geo.setAttribute('position', posiAtt)
    
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
    })

    const mesh = new THREE.Mesh(geo, material)
    mesh.rotation.set(0, 0, 0)
    scene.add(mesh)
    camera.lookAt(mesh.position)

    const renderer = new THREE.WebGLRenderer({
      canvas
    })
    renderer.setSize(sizes.width, sizes.height)

    const clock = new THREE.Clock()

    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / sizes.width - 0.5) * 2,
        y: -(e.clientY / sizes.height - 0.5) * 2,
      })
    }

    const handleResize = (e: UIEvent) => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      //update the camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      //update the renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(Math.min(window.devicePixelRatio, 2)))

    }

    const handleDoubleClick = (e: MouseEvent) => {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        canvas.requestFullscreen()
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    window.addEventListener('dblclick', handleDoubleClick)

    const tick = () => {
      controls.update()
      renderer.render(scene, camera)
      window.requestAnimationFrame(tick)
    }

    tick()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener("dblclick", handleDoubleClick)

      controls.dispose()
      renderer.dispose()
      geo.dispose()
      material.dispose()
    }
  }, [sizes]) 

  return (
    <>
      <div className='hero'>
        <canvas ref={canvasRef} className='webgl'></canvas>
      </div>
    </>
  )
}

export default App