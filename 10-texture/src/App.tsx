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
  // const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // const image = new Image()
    // const texture = new THREE.Texture(image)
    // texture.colorSpace = THREE.SRGBColorSpace

    // image.onload = () => {
    //   texture.needsUpdate = true
    // }

    // image.src = "./textures/door/color.jpg"
    const loadingManager = new THREE.LoadingManager()
    loadingManager.onStart = () => {
      console.log('texture loading')
    }
    loadingManager.onLoad = () => {
      console.log('texture loaded')
    }
    loadingManager.onProgress = () => {
      console.log('texture progress')
    }
    loadingManager.onError = () => {
      console.log('texture error')
    }

    const textureLoader = new THREE.TextureLoader(loadingManager)
    // const texture = textureLoader.load('./textures/door/color.jpg')
    const texture = textureLoader.load('./textures/minecraft.png')
    // texture.repeat.x = 2
    // texture.repeat.y = 3
    // texture.wrapS = THREE.RepeatWrapping
    // texture.wrapT = THREE.RepeatWrapping
    // texture.offset.x = 0.5
    // texture.offset.y = 0.5
    // texture.rotation = Math.PI / 4
    // texture.center.x = 0.5
    // texture.center.y = 0.5
    texture.generateMipmaps = false
    texture.minFilter = THREE.NearestFilter
    texture.magFilter = THREE.NearestFilter
    // const texture2 = textureLoader.load('./textures/door/alpha.jpg')
    // const texture3 = textureLoader.load('./textures/door/ambientOcclusion.jpg')
    // const texture4 = textureLoader.load('./textures/door/height.jpg')
    // const texture5 = textureLoader.load('./textures/door/normal.jpg')
    // const texture6 = textureLoader.load('./textures/door/roughness.jpg')
    // const texture7 = textureLoader.load('./textures/door/metalness.jpg')
    // const texture = textureLoader.load('./textures/door/color.jpg', () => {
    //   console.log('texture loaded')
    // },
    //   () => {
    //     console.log('texture loading')
    //   },
    //   () => {
    //     console.log('texture error')
    //   }
    // )
    texture.colorSpace = THREE.SRGBColorSpace

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

    const geo = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({
      // color: 0xff0000,
      map: texture,
    })
    console.log(geo.attributes)
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