import { type JSX, useEffect, useRef, useState } from 'react'
import './App.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import GUI from 'lil-gui'
import gsap from 'gsap'

type debugObjType = {
  color: number;
  spin : () => void;
  subDivision : number;
}

function App(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isSpin, setIsSpin] = useState(false)
  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  })

  // Use refs to store mutable values that need to be accessed in callbacks
  const spinAnimationRef = useRef<gsap.core.Tween | null>(null)
  const spinDebugLabelRef = useRef<any>(null)

  console.log("isSpin", isSpin)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const scene = new THREE.Scene()
    
    const gui = new GUI({
      width: 400,
      closeFolders: true,
      title: 'Debug',

    })
    gui.close() //close the debug panel
    gui.hide() //hide the debug panel

    window.addEventListener('keydown', (e) => {
      if (e.key === 'h') {
        gui.show(gui._hidden)
      }
    })

    const debugObj: debugObjType = {
      color: 0xff0000,
      spin : () => {},
      subDivision : 3,
    }
    
    let sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }
    
    const axesHelper = new THREE.AxesHelper(1)
    scene.add(axesHelper)

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.z = 3
    scene.add(camera)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    const geo = new THREE.BoxGeometry(1, 1, 1, debugObj.subDivision, debugObj.subDivision, debugObj.subDivision)
    const material = new THREE.MeshBasicMaterial({
      color: debugObj.color,
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

    const cubeTweaks = gui.addFolder('cube tweaks')
    cubeTweaks.add(mesh.position, "y",).min(-3).max(3).step(0.01).name("evlevation")
    cubeTweaks.add(mesh, 'visible').name('show cube')
    cubeTweaks.add(material, 'wireframe')
    gui.addColor(debugObj, 'color').onChange((value : any) => {
      material.color.set(debugObj.color)
    })
    gui.add(debugObj, 'subDivision').min(1).max(10).step(1).name('subDivision').onFinishChange(() => {
      mesh.geometry.dispose()
      mesh.geometry = new THREE.BoxGeometry(1, 1, 1, debugObj.subDivision, debugObj.subDivision, debugObj.subDivision)
    })
    
    debugObj.spin = () => {
      console.log("in debug spin", isSpin)
      
      // Check if animation is currently running
      if (spinAnimationRef.current) {
        // Stop spinning
        spinAnimationRef.current.kill()
        spinAnimationRef.current = null
        setIsSpin(false)
        // Update button label
        if (spinDebugLabelRef.current) {
          spinDebugLabelRef.current.name('Spin Cube')
        }
      } else {
        // Start spinning
        setIsSpin(true)
        spinAnimationRef.current = gsap.to(mesh.rotation, {
          y: mesh.rotation.y + Math.PI * 2, // 2 * Math.PI for full rotation
          duration: 3,
          ease: 'none',
          repeat: -1,
        })
        // Update button label
        if (spinDebugLabelRef.current) {
          spinDebugLabelRef.current.name('Stop Cube')
        }
      }
    }

    // Store the GUI control reference
    spinDebugLabelRef.current = gui.add(debugObj, 'spin').name('Spin Cube')

    const clock = new THREE.Clock()

    /**
     * Update the mouse position based on the user's mouse move event.
     *
     * The position is normalized to the range [-1, 1] and centered at (0, 0).
     * @parame The mouse move event.
     */
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / sizes.width - 0.5) * 2,
        y: -(e.clientY / sizes.height - 0.5) * 2,
      })
    }

    const handleResize = (e: UIEvent) => {
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

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

      // Clean up animation if it's running
      if (spinAnimationRef.current) {
        spinAnimationRef.current.kill()
      }

      gui.destroy()
      
      controls.dispose()
      renderer.dispose()
      geo.dispose()
      material.dispose()
    }
  }, []) // Remove isSpin from dependencies

  return (
    <>
      <div className='debug-info'>Press "h" to show/hide debug panel</div>

      <div className='hero'>
        <canvas ref={canvasRef} className='webgl'></canvas>
      </div>
    </>
  )
}

export default App