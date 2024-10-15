/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unknown-property */
import * as THREE from 'three'
import React, { useRef, useState, FC, useEffect, Suspense } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import CardWrap from './car_info/CardWrap'

const Scene: React.FC = () => {
  const sceneDOM = useRef<HTMLDivElement>(null)
  return (
    <div ref={sceneDOM} style={{ width: '100%', height: '100%' }} className="3D-scene">
      <Canvas
        gl={(canvas) => {
          const gl = new THREE.WebGLRenderer({ canvas, antialias: true })
          gl.setClearColor('#e4e3e3', 1)
          return gl
        }}
      >
        <ambientLight color={0xffffff} intensity={1} />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
        <gridHelper args={[10, 10, '#292828', '#292929']} />
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default Scene
