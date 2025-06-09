export default function DataDisplay({ data }) {
  return (
    <div>
      <h2>Datos Recibidos:</h2>
      <p>{data.text}</p>
    </div>
  );
}