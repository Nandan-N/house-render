import MeshSelection from "./meshselection"

export default function Scene() {
return (
    <>
    <MeshSelection />
    {/* <gridHelper args={[100, 100]} name="Grid" /> */}
    <mesh position={[0,0,0]} name="Box1">   
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color='purple' />
    </mesh>

    <mesh position={[0,0,2]} name="Box2">   
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color='blue' />
    </mesh>

    <mesh position={[0,0,3]} name="sphere">   
        <sphereGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color='green' />
    </mesh>

    <mesh position={[0,0,4]} name="sphere">   
        <sphereGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color='pink' />
    </mesh>

    <MeshSelection />
    </>
)
}