export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.38} color="#7d86a0" />
      <directionalLight position={[5, 8, 4]} intensity={1.15} color="#e8eeff" />
      <directionalLight position={[-7, 3, -6]} intensity={0.7} color="#9d86e8" />
      <directionalLight position={[0, -6, 8]} intensity={0.3} color="#4a5a8a" />
    </>
  )
}
