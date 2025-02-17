import * as THREE from 'three'
import Transition from '../utils/Transition'
import PropTypes from 'prop-types'

import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Html } from '@react-three/drei'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

// Model configuration
const modelConfigs = {
	Mystique: {
		path: '/models/ring1.glb',
		cameraPosition: [3, 1, 20],
		fov: 15,
		diamondMainPart: ['Object'],
		diamondParts: [
			...Array.from(
				{ length: 44 },
				(_, i) => `dia${(i + 1).toString().padStart(3, '0')}`,
			),
			...Array.from(
				{ length: 16 },
				(_, i) => `diamond_side_cuchion_${(i + 1).toString().padStart(3, '0')}`,
			),
		],
		bodyParts: ['entourage', 'alliance'],
	},
	Lumina: {
		path: '/models/ring2.glb',
		cameraPosition: [3, 1, 20],
		fov: 15,
		diamondMainPart: ['Sphere'],
		diamondParts: ['dobj007', 'Sphere001'],
		bodyParts: ['Circle001', 'Circle'],
	},
	Harmonia: {
		path: '/models/ring3.glb',
		cameraPosition: [3, 1, 15],
		fov: 15,
		diamondMainPart: ['diamonds'],
		diamondParts: [
			...Array.from(
				{ length: 6 },
				(_, i) => `diamonds${(i + 1).toString().padStart(3, '0')}`,
			),
		],
		bodyParts: ['gold'],
		bodyPart2: ['silver'],
	},
	Cosmos: {
		path: '/models/vong1.glb',
		cameraPosition: [3, 8, 15],
		fov: 15,
		diamondMainPart: ['1', '2', '3', '4'],
		diamondParts: ['6', '5'],
		bodyParts: ['9', '12', '8', '11', '10'],
		bodyPart2: ['13', '7'],
	},
	Memoire: {
		path: '/models/vong2.glb',
		cameraPosition: [3, 8, 15],
		fov: 5,
		diamondMainPart: ['Gem_2'],
		diamondParts: ['Gem_1', 'Gem_3', 'Gem_14', 'Gem_5'],
		bodyParts: ['2', '3', '4', '5'],
	},
}

const CustomModel = ({ modelConfig, color, bodyColor, bodyColor2 }) => {
	const { scene } = useGLTF(modelConfig.path)
	const [environmentMap, setEnvironmentMap] = useState(null)

	useEffect(() => {
		new RGBELoader().load('/hdri.hdr', (texture) => {
			texture.mapping = THREE.EquirectangularReflectionMapping
			setEnvironmentMap(texture)
		})
	}, [])

	useEffect(() => {
		if (environmentMap) {
			scene.environment = environmentMap
			scene.traverse((child) => {
				// These code use for debug
				// if (child.isMesh) {
				// 	console.log(child.name)
				// }
				if (child.isMesh && modelConfig.bodyParts.includes(child.name)) {
					const newMaterial = new THREE.MeshPhysicalMaterial({
						color: new THREE.Color(bodyColor),
						metalness: 1,
						roughness: 0.08, // Slightly reduced for more shine
						transmission: 0,
						reflectivity: 1,
						clearcoat: 1,
						clearcoatRoughness: 0.03, // Reduced for sharper clearcoat reflections
						envMap: scene.environment, // Add the environment map
					})
					child.material = newMaterial
				}

				if (child.isMesh && modelConfig.bodyPart2?.includes(child.name)) {
					console.log('Success')
					const newMaterial = new THREE.MeshPhysicalMaterial({
						color: new THREE.Color(bodyColor2),
						metalness: 1, // Increase metalness for metallic look
						roughness: 0.08, // Slightly reduced for more shine
						transmission: 0, // Set to 0 for no transparency
						reflectivity: 1, // Adjust reflectivity for desired shininess
						clearcoat: 1, // Adjust clearcoat for additional shininess layer
						clearcoatRoughness: 0.03, // Reduced for sharper clearcoat reflections
						envMap: scene.environment, // Add the environment map
					})
					child.material = newMaterial
				}

				if (child.isMesh && modelConfig.diamondMainPart.includes(child.name)) {
					const newMaterial = new THREE.MeshPhysicalMaterial({
						color: new THREE.Color(color), // Set the color as before
						roughness: 0.5, // Increase roughness for less shiny surface
						metalness: 0.3, // Increase metalness for metallic look
						transmission: 0.6, // Set to 0 for no transparency
						reflectivity: 15, // Adjust reflectivity for desired shininess
						clearcoat: 1, // Adjust clearcoat for additional shininess layer
						clearcoatRoughness: 0, // Slightly rough clearcoat for realism
					})
					child.material = newMaterial
				}

				if (child.isMesh && modelConfig.diamondParts.includes(child.name)) {
					const newMaterial = new THREE.MeshPhysicalMaterial({
						color: new THREE.Color(color),
						roughness: 0.5, // Increase roughness for less shiny surface
						metalness: 0.3, // Increase metalness for metallic look
						transmission: 0.6, // Set to 0 for no transparency
						reflectivity: 15, // Adjust reflectivity for desired shininess
						clearcoat: 1, // Adjust clearcoat for additional shininess layer
						clearcoatRoughness: 0, // Slightly rough clearcoat for realism
					})
					child.material = newMaterial
				}
			})
		}
	}, [scene, color, bodyColor, bodyColor2, modelConfig, environmentMap])

	return environmentMap ? <primitive object={scene} /> : null
}

CustomModel.propTypes = {
	modelConfig: PropTypes.object.isRequired,
	color: PropTypes.string.isRequired,
	bodyColor: PropTypes.string.isRequired,
	bodyColor2: PropTypes.string.isRequired,
}

export default function App() {
	const [modelKey, setModelKey] = useState('Mystique') // Default model
	const [color, setColor] = useState('#fff')
	const [bodyColor, setBodyColor] = useState('#fff')
	const [bodyColor2, setBodyColor2] = useState('#fff')
	const [activeTab, setActiveTab] = useState('diamondColor')

	const modelConfig = modelConfigs[modelKey]

	const fixedColors = {
		diamondColor: ['#ffffff', '#E0115F', '#0F52BA', '#9966CC', '#FFC300'],
		bodyColor: ['#e4cb4e', '#f9cfbd', '#f5f7f8', '#fbf9e0', '#ffffff'],
		bodyColor2: ['#e4cb4e', '#f9cfbd', '#f5f7f8', '#fbf9e0', '#ffffff'],
	}

	const shouldShowBody2Tab = () => {
		return modelConfig.bodyPart2 !== undefined
	}

	const renderTabContent = () => {
		return (
			<div className="flex gap-2 p-2 justify-between">
				{fixedColors[activeTab]?.map((presetColor) => (
					<button
						key={presetColor}
						style={{ backgroundColor: presetColor }}
						className="w-14 h-14 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#957E48] focus:ring-[#957E48] cursor-pointer"
						onClick={() => {
							if (activeTab === 'diamondColor') setColor(presetColor)
							else if (activeTab === 'bodyColor') setBodyColor(presetColor)
							else if (activeTab === 'bodyColor2') setBodyColor2(presetColor)
						}}
					/>
				))}
			</div>
		)
	}

	return (
		<Transition className="relative flex bg-primary">
			<Canvas
				key={modelConfig.path}
				camera={{ position: modelConfig.cameraPosition, fov: modelConfig.fov }}
				style={{ width: '100%', height: '100vh' }}
				className="flex-grow"
			>
				<ambientLight intensity={1.25} />
				<directionalLight intensity={0.4} />
				<Suspense fallback={<Html center>Loading...</Html>}>
					<CustomModel
						key={modelConfig.path}
						modelConfig={modelConfig}
						color={color}
						bodyColor={bodyColor}
						bodyColor2={bodyColor2}
					/>
				</Suspense>
				<OrbitControls target={[0, 0, 0]} autoRotate autoRotateSpeed={1.0} />
			</Canvas>
			<div
				className="absolute bottom-0 -translate-y-1/2 left-20 p-5 border border-solid border-white"
				style={{
					backgroundColor: '#b99b5b',
					borderRadius: '25px',
				}}
			>
				<h2 className="uppercase text-white font-bold">Custom trang sức</h2>
				<select
					onChange={(e) => setModelKey(e.target.value)}
					className="block w-full my-3 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-4 px-6  text-white bg-[#957E48] font-bold appearance-none"
				>
					{Object.keys(modelConfigs).map((key) => (
						<option key={key} value={key}>
							{key}
						</option>
					))}
				</select>
				<div
					className={`${
						shouldShowBody2Tab() ? 'grid-cols-3' : 'grid-cols-2'
					} my-3 grid bg-[#957E48] py-2 px-4  rounded-full text-center gap-3 `}
				>
					<button
						onClick={() => setActiveTab('diamondColor')}
						className={`${
							activeTab === 'diamondColor' ? 'bg-[#b99b5b]' : ''
						} text-white box-border w-full px-4 py-1 rounded-full`}
					>
						Diamond
					</button>
					<button
						onClick={() => setActiveTab('bodyColor')}
						className={`${
							activeTab === 'bodyColor' ? 'bg-[#b99b5b]' : ''
						} text-white box-border w-full px-4 py-1 rounded-full`}
					>
						Body
					</button>
					{shouldShowBody2Tab() && (
						<button
							onClick={() => setActiveTab('bodyColor2')}
							className={`${
								activeTab === 'bodyColor2' ? 'bg-[#b99b5b]' : ''
							} text-white box-border w-full px-4 py-1 rounded-full`}
						>
							Body2
						</button>
					)}
				</div>
				{renderTabContent()}
			</div>
		</Transition>
	)
}
