// src/components/BackgroundScene.jsx
import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function BackgroundScene({ heavy = true }) {
  const mountRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.position = 'fixed'
    renderer.domElement.style.left = '0'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.zIndex = '0'
    mount.appendChild(renderer.domElement)

    // Scene + Camera
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0b1220) // deep space
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 4000)
    camera.position.set(0, 28, 140)

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.30)
    scene.add(ambient)
    const point = new THREE.PointLight(0xffffff, 1.2, 800)
    point.position.set(0, 0, 0)
    scene.add(point)

    // STARFIELD (vivid)
    const starGeo = new THREE.BufferGeometry()
    const starCount = heavy ? 900 : 350
    const starPositions = new Float32Array(starCount * 3)
    const starColors = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      const radius = 900 + Math.random() * 700
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)
      starPositions[i * 3 + 0] = x
      starPositions[i * 3 + 1] = y
      starPositions[i * 3 + 2] = z
      // color subtle hue variations
      const hue = 0.55 + (Math.random() - 0.5) * 0.15
      const col = new THREE.Color().setHSL(hue, 0.9, 0.8 - Math.random() * 0.5)
      starColors[i * 3 + 0] = col.r
      starColors[i * 3 + 1] = col.g
      starColors[i * 3 + 2] = col.b
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3))
    const starMat = new THREE.PointsMaterial({
      size: heavy ? 1.4 : 1.0,
      vertexColors: true,
      transparent: true,
      opacity: heavy ? 0.95 : 0.6,
      depthWrite: false
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // Glowing Sun (big)
    const sunGeo = new THREE.SphereGeometry(14, 32, 32)
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffcc66 })
    const sun = new THREE.Mesh(sunGeo, sunMat)
    scene.add(sun)

    // Huge glow sprite for sun
    const makeGlowTex = (size, color) => {
      const c = document.createElement('canvas')
      c.width = c.height = size
      const ctx = c.getContext('2d')
      const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
      grad.addColorStop(0, color)
      grad.addColorStop(0.35, color)
      grad.addColorStop(0.6, 'rgba(255,200,140,0.35)')
      grad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = grad
      ctx.fillRect(0,0,size,size)
      return new THREE.CanvasTexture(c)
    }
    const sunSpriteMat = new THREE.SpriteMaterial({
      map: makeGlowTex(512, 'rgba(255,200,120,1)'),
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.95,
      depthWrite: false
    })
    const sunSprite = new THREE.Sprite(sunSpriteMat)
    sunSprite.scale.set(160, 160, 1)
    sunSprite.position.set(0, 0, 0)
    scene.add(sunSprite)

    // PLANETS — vivid and larger
    const planetDefs = [
      { name:'Merc', size: 1.6, color: 0xd9d7d4, dist: 18, speed: 0.03, tilt: 0.02 },
      { name:'Venus', size: 2.6, color: 0xffd9a6, dist: 26, speed: 0.02, tilt: 0.01 },
      { name:'Earth', size: 3.4, color: 0x6aa7ff, dist: 36, speed: 0.015, tilt: 0.03 },
      { name:'Mars', size: 2.2, color: 0xff7b7b, dist: 48, speed: 0.011, tilt: 0.02 },
      { name:'Jup', size: 7.0, color: 0xd1b090, dist: 72, speed: 0.006, tilt: 0.008 }
    ]

    const planets = []
    planetDefs.forEach(p => {
      const geo = new THREE.SphereGeometry(p.size, 28, 28)
      const mat = new THREE.MeshStandardMaterial({
        color: p.color,
        metalness: 0.05,
        roughness: 0.7,
        emissive: new THREE.Color(p.color).multiplyScalar(0.02)
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(p.dist, 0, 0)
      scene.add(mesh)

      // thicker glow sprite
      const spriteMat = new THREE.SpriteMaterial({
        map: makeGlowTex(Math.min(512, Math.max(128, Math.floor(p.size * 40))), '#' + p.color.toString(16).padStart(6,'0')),
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.9,
        depthWrite: false
      })
      const sprite = new THREE.Sprite(spriteMat)
      sprite.scale.set(p.size * 12, p.size * 12, 1)
      sprite.position.copy(mesh.position)
      scene.add(sprite)

      planets.push({ mesh, sprite, ...p, angle: Math.random() * Math.PI * 2 })
    })

    // subtle rings for Jupiter-like
    const ringGeo = new THREE.RingGeometry(9, 12, 64)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xe0cdb2, side: THREE.DoubleSide, transparent: true, opacity: 0.35 })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2.6
    ring.position.copy(planets[4].mesh.position)
    scene.add(ring)

    // group
    const root = new THREE.Group()
    scene.add(root)
    root.add(sun, sunSprite)
    planets.forEach(p => root.add(p.mesh, p.sprite))

    // mouse parallax
    let mouseX = 0, mouseY = 0
    function onMouseMove(e) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      mouseX = nx
      mouseY = ny
    }
    window.addEventListener('mousemove', onMouseMove)

    // animation
    let last = performance.now()
    function tick(now) {
      rafRef.current = requestAnimationFrame(tick)
      const dt = (now - last) / 1000
      last = now

      // camera parallax slight
      camera.position.x += (mouseX * 30 - camera.position.x) * 0.06
      camera.position.y += (-mouseY * 18 - camera.position.y) * 0.06
      camera.lookAt(0, 0, 0)

      // spinning root faster
      root.rotation.y += 0.0022

      // animate planets orbit + spin + halo pulsing
      planets.forEach((p, i) => {
        p.angle += p.speed * (1 + Math.sin(now * 0.0005 + i))
        const x = Math.cos(p.angle) * p.dist
        const z = Math.sin(p.angle) * p.dist
        const y = Math.sin(p.angle * 2.0) * (p.tilt * 10)
        p.mesh.position.set(x, y, z)
        p.mesh.rotation.y += 0.02 + (i * 0.003)
        p.sprite.position.copy(p.mesh.position)
        // subtle halo pulse
        const pulse = 1 + 0.15 * Math.sin(now * 0.002 + i)
        p.sprite.scale.set(p.size * 12 * pulse, p.size * 12 * pulse, 1)
      })

      // starfield slight rotation
      stars.rotation.y += 0.0008

      renderer.render(scene, camera)
    }
    rafRef.current = requestAnimationFrame(tick)

    // resize
    function onResize() {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    // cleanup
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      try { mount.removeChild(renderer.domElement) } catch(e){}
      // dispose
      starGeo.dispose()
      starMat.dispose()
      planets.forEach(p => {
        p.mesh.geometry.dispose()
        if (Array.isArray(p.mesh.material)) p.mesh.material.forEach(m=>m.dispose())
        else p.mesh.material.dispose()
        if (p.sprite && p.sprite.material && p.sprite.material.map) p.sprite.material.map.dispose()
        if (p.sprite) p.sprite.material.dispose()
      })
      if (sunSprite && sunSprite.material && sunSprite.material.map) sunSprite.material.map.dispose()
      if (sunSprite) sunSprite.material.dispose()
      renderer.dispose()
    }
  }, [heavy])

  return <div ref={mountRef} style={{ position: 'fixed', left:0, top:0, width:'100%', height:'100%', zIndex: 0, pointerEvents: 'none' }} />
}
