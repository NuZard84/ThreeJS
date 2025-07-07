import { type JSX, useEffect, useRef, useState } from 'react'
import './App.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

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

    const gui = new GUI()

    const canvas = canvasRef.current
    const scene = new THREE.Scene()
    scene.add(new THREE.AxesHelper(1))

    // const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    // scene.add(ambientLight)

    // const pointLight = new THREE.PointLight(0xffffff, 10)
    // pointLight.position.set(2, 3, 5)
    // scene.add(pointLight)

    const rgbeLoader = new RGBELoader()
    rgbeLoader.load('./textures/environmentMap/2k.hdr', (envMap) => {
      envMap.mapping = THREE.EquirectangularReflectionMapping
      scene.background = envMap
      scene.environment = envMap
    })

    const textureLoader = new THREE.TextureLoader();
    const doorColor = textureLoader.load('./textures/door/color.jpg')
    const doorAlpha = textureLoader.load('./textures/door/alpha.jpg')
    const doorAmbientOcclusion = textureLoader.load('./textures/door/ambientOcclusion.jpg')
    const doorHeight = textureLoader.load('./textures/door/height.jpg')
    const doorNormal = textureLoader.load('./textures/door/normal.jpg')
    const doorMetalness = textureLoader.load('./textures/door/metalness.jpg')
    const doorRoughness = textureLoader.load('./textures/door/roughness.jpg')

    const matcapTexture = textureLoader.load('./textures/matcaps/8.png')
    const gradient = textureLoader.load('./textures/gradients/3.jpg')

    doorColor.colorSpace = THREE.SRGBColorSpace
    matcapTexture.colorSpace = THREE.SRGBColorSpace


    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.z = 3
    scene.add(camera)

    const controls = new OrbitControls(camera, canvas)
    // controls.enabled = false
    controls.enableDamping = true
    controls.dampingFactor = 0.05

    //basic material
    // const material = new THREE.MeshBasicMaterial()
    // material.map = doorColor
    // material.transparent = true
    // material.opacity = 0.5
    // material.alphaMap = doorColor
    // material.side = THREE.DoubleSide

    //normal material
    // const material = new THREE.MeshNormalMaterial()
    // material.flatShading = true

    //matcap material
    // const material = new THREE.MeshMatcapMaterial()
    // material.matcap = matcapTexture

    //mesh depth material
    // const material = new THREE.MeshDepthMaterial()

    //mesh lambert material - support env map - light need mateiral - like normal mesh material
    // const material = new THREE.MeshLambertMaterial()
    // material.map = doorColor

    //mesh phong material - support env map - light need mateiral - like normal mesh material - has reflection
    // const material = new THREE.MeshPhongMaterial()
    // material.map = doorColor
    // material.shininess = 100
    // material.specular = new THREE.Color('red')

    // mesh toon material 
    // const material = new THREE.MeshToonMaterial()
    // gradient.minFilter = THREE.NearestFilter
    // gradient.magFilter = THREE.NearestFilter
    // gradient.generateMipmaps = false
    // material.gradientMap = gradient

    //light need mateiral - like normal mesh material - has reflection- support env map
    // material.roughness = 0.5
    // material.metalness = 0.5
    // mesh standard material 
    // const material = new THREE.MeshStandardMaterial()
    // material.map = doorColor
    // material.aoMap = doorAmbientOcclusion
    // material.metalness = 1
    // material.roughness = 1
    // material.aoMapIntensity = 1
    // material.displacementMap = doorHeight
    // material.displacementScale = 0.1
    // material.metalnessMap = doorMetalness
    // material.roughnessMap = doorRoughness
    // material.normalMap = doorNormal
    // material.normalScale.set(0.5, 0.5)
    // material.alphaMap = doorAlpha
    // material.transparent = true

    //mesh physical material - its like standerd material but have more options
    const material = new THREE.MeshPhysicalMaterial()
    material.roughness = 0.5
    material.metalness = 0.5
    // material.map = doorColor
    // material.aoMap = doorAmbientOcclusion
    // material.metalness = 1
    // material.roughness = 1
    // material.aoMapIntensity = 1
    // material.displacementMap = doorHeight
    // material.displacementScale = 0.1
    // material.metalnessMap = doorMetalness
    // material.roughnessMap = doorRoughness
    // material.normalMap = doorNormal
    // material.normalScale.set(0.5, 0.5)
    // material.alphaMap = doorAlpha
    // material.transparent = true

    // material.clearcoat = 1 //simulate a thin layer of varnish on top of the actual material
    // material.clearcoatRoughness = 0.1

    // material.sheen = 1 //highlight the materrial when seen from narrow angle usually on fluffy material like fabric
    //  material.sheenRoughness = 0.25
    //  material.sheenColor.set(1,1,1)

    // material.iridescence = 1 //create color artifacts like fuel puddle, soap bubbles or even laserDiscs
    // material.iridescenceThicknessRange = [100, 800]
    // material.iridescenceIOR = 1

    // material.transmission = 1 //enable light to go through the material more thean just transparency with opacity becuase the image behind the object gets diformed
    // material.ior = 1.5 //index of reflection
    // material.thickness = 0.5 //thickness of the material

 
    gui.add(material, 'metalness').min(0).max(1).step(0.001)
    gui.add(material, 'roughness').min(0).max(1).step(0.001)

    // gui.add(material, "clearcoat").min(0).max(1).step(0.001)
    // gui.add(material, "clearcoatRoughness").min(0).max(1).step(0.001)
    // gui.add(material, "sheen").min(0).max(1).step(0.001)
    // gui.add(material, "sheenRoughness").min(0).max(1).step(0.001)
    // gui.addColor(material, "sheenColor")
    // gui.add(material, "iridescence").min(0).max(1).step(0.001)
    // gui.add(material, "iridescenceIOR").min(0).max(2.333).step(0.001)
    // gui.add(material.iridescenceThicknessRange, '0').min(1).max(1000).step(1)
    // gui.add(material.iridescenceThicknessRange, '1').min(1).max(1000).step(1)
    // gui.add(material, 'transmission').min(0).max(1).step(0.001)
    // gui.add(material, 'ior').min(1).max(10).step(0.001)
    // gui.add(material, 'thickness').min(0).max(1).step(0.001)




    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 128, 128),
      material
    )
    sphere.position.set(-2, 0, 0)
    const plan = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 128, 128),
      material
    )


    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(0.5, 0.2, 64, 128),
      material
    )
    torus.position.x = 2
    scene.add(sphere, plan, torus)


    const renderer = new THREE.WebGLRenderer({
      canvas
    })
    renderer.setSize(sizes.width, sizes.height)

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

    const clock = new THREE.Clock()

    const tick = () => {
      const elapsedTime = clock.getElapsedTime()

      sphere.rotation.y = elapsedTime * 0.1
      plan.rotation.y = elapsedTime * 0.1
      torus.rotation.y = elapsedTime * 0.1

      plan.rotation.x = elapsedTime * -0.15
      torus.rotation.x = elapsedTime * -0.15
      sphere.rotation.x = elapsedTime * -0.15




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