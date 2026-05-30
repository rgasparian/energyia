import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/matrix")({
  component: MatrixPage,
});

export function MatrixPage() {
  return (
    <div style={{display:"flex",minHeight:"100vh",alignItems:"center",justifyContent:"center",background:"#080808",color:"#fff",textAlign:"center",padding:24}}>
      <div>
        <div style={{fontSize:40,marginBottom:16}}>⚡</div>
        <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:24,fontWeight:700}}>EnergyIA Matrix 360</h1>
        <p style={{color:"rgba(255,255,255,0.5)",marginTop:8}}>Acesse sua página personalizada com seu link de consultor.</p>
      </div>
    </div>
  );
}
